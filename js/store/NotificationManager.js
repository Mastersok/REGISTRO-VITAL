/**
 * Notification Manager - Sistema de Notificaciones y Recordatorios
 */

class NotificationManager {
    constructor() {
        this.storageKey = 'dosis_vital_notifications';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Obtener todas las notificaciones
    getNotifications() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    // Obtener notificaciones no leídas
    getUnreadCount() {
        const notifications = this.getNotifications();
        return notifications.filter(n => !n.read).length;
    }

    // Añadir nueva notificación
    addNotification(type, title, message, actionRoute = null, priority = 'medium') {
        const notifications = this.getNotifications();
        const newNotification = {
            id: Date.now().toString(),
            type, // 'reminder', 'insight', 'alert', 'tip', 'update'
            title,
            message,
            actionRoute,
            priority, // 'high', 'medium', 'low'
            read: false,
            timestamp: new Date().toISOString()
        };

        notifications.unshift(newNotification);

        // Mantener solo las últimas 50 notificaciones
        if (notifications.length > 50) {
            notifications.splice(50);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(notifications));
        return newNotification;
    }

    // Marcar como leída
    markAsRead(notificationId) {
        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem(this.storageKey, JSON.stringify(notifications));
        }
    }

    // Marcar todas como leídas
    markAllAsRead() {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.read = true);
        localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    }

    // Eliminar notificación
    deleteNotification(notificationId) {
        let notifications = this.getNotifications();
        notifications = notifications.filter(n => n.id !== notificationId);
        localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    }

    // Limpiar todas las notificaciones
    clearAll() {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
    }

    // Generar recordatorios inteligentes basados en la última actividad
    generateSmartReminders(profileId) {
        const store = window.DosisStore;
        const readings = store.getReadings();
        const now = new Date();

        const measurementTypes = [
            { id: 'pressure', name: store.t('pressure_short'), days: 2 },
            { id: 'glucose', name: store.t('glucose'), days: 1 },
            { id: 'oxygen_temp', name: store.t('bio_health_short'), days: 3 },
            { id: 'weight', name: store.t('weight_short'), days: 7 },
            { id: 'pain', name: store.t('pain_short'), days: 1 },
            { id: 'bristol', name: store.t('bristol_short'), days: 2 },
            { id: 'sleep', name: store.t('sleep_short'), days: 1 }
        ];

        measurementTypes.forEach(type => {
            const lastReading = readings
                .filter(r => r.type === type.id)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

            if (!lastReading) {
                // Nunca ha registrado este tipo
                this.addNotification(
                    'reminder',
                    store.t('reminder_never_title'),
                    `${store.t('reminder_never_message')} ${type.name}`,
                    `form-${type.id}`,
                    'medium'
                );
            } else {
                const lastDate = new Date(lastReading.timestamp);
                const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

                if (daysSince >= type.days) {
                    this.addNotification(
                        'reminder',
                        `${store.t('reminder_overdue_title')} ${type.name}`,
                        `${store.t('reminder_overdue_message')} ${daysSince} ${store.t('days').toLowerCase()}`,
                        `form-${type.id}`,
                        daysSince >= type.days * 2 ? 'high' : 'medium'
                    );
                }
            }
        });
    }

    // Generar insights de salud
    generateHealthInsights(profileId) {
        const store = window.DosisStore;
        const readings = store.getReadings();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Análisis de presión arterial
        const pressureReadings = readings
            .filter(r => r.type === 'pressure' && new Date(r.timestamp) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (pressureReadings.length >= 3) {
            const dangerCount = pressureReadings.filter(r => {
                const eval_result = store.evaluateReading(r.type, r.values, r.timing);
                return eval_result.status === 'danger';
            }).length;

            if (dangerCount >= 2) {
                this.addNotification(
                    'alert',
                    store.t('alert_pressure_title'),
                    `${store.t('alert_pressure_message')} ${dangerCount} ${store.t('alert_pressure_count')}`,
                    'trends',
                    'high'
                );
            }

            // Calcular tendencia
            const avgFirst = pressureReadings.slice(-3).reduce((sum, r) => sum + parseInt(r.values.systolic), 0) / 3;
            const avgLast = pressureReadings.slice(0, 3).reduce((sum, r) => sum + parseInt(r.values.systolic), 0) / 3;
            const change = ((avgLast - avgFirst) / avgFirst * 100).toFixed(1);

            if (Math.abs(change) >= 5) {
                this.addNotification(
                    'insight',
                    store.t('insight_pressure_title'),
                    `${store.t('insight_pressure_message')} ${change > 0 ? '+' : ''}${change}% ${store.t('insight_this_week')}`,
                    'trends',
                    'medium'
                );
            }
        }

        // Análisis de glucosa
        const glucoseReadings = readings
            .filter(r => r.type === 'glucose' && new Date(r.timestamp) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (glucoseReadings.length >= 3) {
            const avgFirst = glucoseReadings.slice(-3).reduce((sum, r) => sum + parseInt(r.values.value), 0) / 3;
            const avgLast = glucoseReadings.slice(0, 3).reduce((sum, r) => sum + parseInt(r.values.value), 0) / 3;
            const change = ((avgLast - avgFirst) / avgFirst * 100).toFixed(1);

            if (Math.abs(change) >= 5) {
                this.addNotification(
                    'insight',
                    store.t('insight_glucose_title'),
                    `${store.t('insight_glucose_message')} ${change > 0 ? '+' : ''}${change}% ${store.t('insight_this_week')}`,
                    'trends',
                    'medium'
                );
            }
        }
    }

    // Añadir notificación del desarrollador
    addDeveloperMessage(title, message, priority = 'low') {
        this.addNotification('update', title, message, null, priority);
    }

    // Añadir tip de salud
    addHealthTip(title, message) {
        this.addNotification('tip', title, message, null, 'low');
    }
}

// Instancia global
window.DosisNotifications = new NotificationManager();
