/**
 * Notifications View - Centro de Notificaciones
 */
window.Pages = window.Pages || {};

window.Pages.NotificationsView = (router) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm animate-up';

    const t = (key) => window.DosisStore.t(key);
    const notifications = window.DosisNotifications.getNotifications();

    const getIconForType = (type) => {
        const icons = {
            reminder: 'notifications_active',
            insight: 'insights',
            alert: 'warning',
            tip: 'lightbulb',
            update: 'new_releases'
        };
        return icons[type] || 'notifications';
    };

    const getColorForType = (type) => {
        const colors = {
            reminder: 'bg-blue-500',
            insight: 'bg-purple-500',
            alert: 'bg-red-500',
            tip: 'bg-green-500',
            update: 'bg-orange-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    const getPriorityBorder = (priority) => {
        const borders = {
            high: 'border-l-4 border-red-500',
            medium: 'border-l-4 border-yellow-500',
            low: 'border-l-4 border-gray-300 dark:border-slate-600'
        };
        return borders[priority] || '';
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('just_now') || 'Justo ahora';
        if (diffMins < 60) return `${diffMins} min`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString();
    };

    el.innerHTML = `
        <div class="w-full max-w-md mt-4 mx-4 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-h-[85vh] flex flex-col animate-slide-down">
            <!-- Header -->
            <div class="p-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">${t('notifications')}</h2>
                    <button id="btn-close" class="size-10 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center active:scale-95 transition-all">
                        <span class="material-symbols-outlined text-gray-600 dark:text-slate-300">close</span>
                    </button>
                </div>
                ${notifications.length > 0 ? `
                    <div class="flex gap-2">
                        <button id="btn-mark-all" class="flex-1 h-10 bg-primary/10 text-primary text-xs font-black rounded-xl active:scale-95 transition-all">
                            ${t('mark_all_read').toUpperCase()}
                        </button>
                        <button id="btn-clear-all" class="flex-1 h-10 bg-red-500/10 text-red-500 text-xs font-black rounded-xl active:scale-95 transition-all">
                            ${t('clear_all').toUpperCase()}
                        </button>
                    </div>
                ` : ''}
            </div>

            <!-- Notifications List -->
            <div class="flex-1 overflow-y-auto p-4 space-y-3">
                ${notifications.length === 0 ? `
                    <div class="flex flex-col items-center justify-center py-20 opacity-50">
                        <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-700 mb-4">notifications_off</span>
                        <p class="text-lg font-bold text-gray-400 dark:text-slate-600">${t('no_notifications')}</p>
                    </div>
                ` : notifications.map(notification => `
                    <div class="notification-item bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 ${getPriorityBorder(notification.priority)} ${notification.read ? 'opacity-60' : ''} transition-all" data-id="${notification.id}" data-route="${notification.actionRoute || ''}">
                        <div class="flex gap-3">
                            <div class="size-10 ${getColorForType(notification.type)} rounded-xl flex items-center justify-center text-white shrink-0">
                                <span class="material-symbols-outlined !text-xl">${getIconForType(notification.type)}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between gap-2 mb-1">
                                    <h3 class="font-black text-sm text-gray-800 dark:text-slate-100">${notification.title}</h3>
                                    <span class="text-[10px] font-bold text-gray-400 dark:text-slate-500 shrink-0">${formatTimestamp(notification.timestamp)}</span>
                                </div>
                                <p class="text-xs font-medium text-gray-600 dark:text-slate-400 leading-relaxed">${notification.message}</p>
                                ${notification.actionRoute ? `
                                    <button class="btn-action mt-2 text-xs font-black text-primary flex items-center gap-1">
                                        ${t('view_details')}
                                        <span class="material-symbols-outlined !text-sm">arrow_forward</span>
                                    </button>
                                ` : ''}
                            </div>
                            <button class="btn-dismiss size-8 bg-gray-200 dark:bg-slate-800 rounded-lg flex items-center justify-center active:scale-90 transition-all shrink-0">
                                <span class="material-symbols-outlined !text-sm text-gray-500 dark:text-slate-400">close</span>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Event Listeners
    el.querySelector('#btn-close').onclick = () => {
        el.remove();
    };

    if (notifications.length > 0) {
        el.querySelector('#btn-mark-all')?.addEventListener('click', () => {
            window.DosisNotifications.markAllAsRead();
            el.remove();
            router.navigateTo(router.currentRoute); // Refresh
        });

        el.querySelector('#btn-clear-all')?.addEventListener('click', () => {
            if (confirm(t('confirm_clear_notifications') || '¿Eliminar todas las notificaciones?')) {
                window.DosisNotifications.clearAll();
                el.remove();
                router.navigateTo(router.currentRoute);
            }
        });
    }

    // Click en notificación
    el.querySelectorAll('.notification-item').forEach(item => {
        const notificationId = item.dataset.id;
        const actionRoute = item.dataset.route;

        // Marcar como leída al hacer click
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-dismiss') && !e.target.closest('.btn-action')) {
                window.DosisNotifications.markAsRead(notificationId);
            }
        });

        // Botón de acción
        item.querySelector('.btn-action')?.addEventListener('click', (e) => {
            e.stopPropagation();
            window.DosisNotifications.markAsRead(notificationId);
            el.remove();
            if (actionRoute) {
                router.navigateTo(actionRoute);
            }
        });

        // Botón de descartar
        item.querySelector('.btn-dismiss')?.addEventListener('click', (e) => {
            e.stopPropagation();
            window.DosisNotifications.deleteNotification(notificationId);
            item.style.transform = 'translateX(100%)';
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                if (el.querySelectorAll('.notification-item').length === 0) {
                    el.remove();
                    router.navigateTo(router.currentRoute);
                }
            }, 300);
        });
    });

    // Click fuera del modal
    el.addEventListener('click', (e) => {
        if (e.target === el) {
            el.remove();
        }
    });

    return el;
};
