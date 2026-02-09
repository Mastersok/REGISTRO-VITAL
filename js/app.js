/**
 * Dosis Vital - Main App Router & Initialization
 * Refactored for file:// protocol compatibility (No ES Modules)
 */

class App {
    constructor() {
        this.container = document.getElementById('view-container');
        window.addEventListener('popstate', () => this.route());

        const pin = window.DosisStore.state.settings.pin;
        if (pin) {
            this.showLockScreen();
        } else {
            this.route();
        }
    }

    showLockScreen() {
        // Asegurarse de que los modales estén cargados
        if (window.Modals && window.Modals.PinModal) {
            const lock = window.Modals.PinModal(this, () => this.route(), true);
            document.body.appendChild(lock);
        } else {
            // Fallback si el modal no cargó
            this.route();
        }
    }

    navigateTo(path) {
        window.history.pushState({}, '', `#${path}`);
        this.route();
    }

    route() {
        const hash = window.location.hash || '#dashboard';
        this.container.innerHTML = ''; // Clear current view

        let view;
        const Pages = window.Pages;

        switch (hash) {
            case '#dashboard':
                view = Pages.Dashboard(this);
                break;
            case '#history':
                view = Pages.HistoryView(this);
                break;
            case '#form-pressure':
                view = Pages.PressureForm(this);
                break;
            case '#form-glucose':
                view = Pages.GlucoseForm(this);
                break;
            case '#form-oxygen':
                view = Pages.OxygenForm(this);
                break;
            case '#form-weight':
                view = Pages.WeightForm(this);
                break;
            case '#form-pain':
                view = Pages.PainForm(this);
                break;
            case '#form-bristol':
                view = Pages.BristolForm(this);
                break;
            case '#trends':
                view = Pages.TrendsView(this);
                break;
            case '#profile':
                view = Pages.ProfileView(this);
                break;
            case '#profiles':
                view = Pages.ProfilesView(this);
                break;
            case '#settings':
                view = Pages.SettingsView(this);
                break;
            case '#weekly-summary':
                view = Pages.WeeklySummary(this);
                break;
            default:
                view = Pages.Dashboard(this);
        }

        // Safety check if view is undefined (e.g. page not loaded yet)
        if (view) {
            this.container.appendChild(view);
            window.scrollTo(0, 0);
        } else {
            console.error("View not found for hash:", hash);
            this.container.innerHTML = `<div class="p-10 text-center text-red-500 font-bold">Error cargando vista: ${hash}</div>`;
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `glass px-6 py-4 rounded-full shadow-premium flex items-center gap-3 animate-up mb-4`;
        toast.style.backgroundColor = type === 'success' ? '#34c759' : '#ff3b30';
        toast.innerHTML = `
            <span class="material-symbols-outlined text-white">check_circle</span>
            <span class="text-white font-bold">${message}</span>
        `;
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
}

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.DosisVital = new App();

    // Mostrar notificación de bienvenida al nuevo sistema (solo una vez)
    const hasSeenWelcome = localStorage.getItem('notification_system_welcome');
    if (!hasSeenWelcome) {
        setTimeout(() => {
            const t = (key) => window.DosisStore.t(key);
            window.DosisNotifications.addDeveloperMessage(
                '🎉 ' + (t('new_feature') || 'Nueva Función'),
                (t('notification_welcome_message') || 'Centro de Notificaciones activado. Ahora recibirás recordatorios inteligentes y análisis de tus tendencias de salud.'),
                'medium'
            );
            localStorage.setItem('notification_system_welcome', 'true');
        }, 2000);
    }
});
