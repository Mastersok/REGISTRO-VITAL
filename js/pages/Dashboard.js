/**
 * Dashboard Component
 */
window.Pages = window.Pages || {};

window.Pages.Dashboard = (router) => {
    const profile = window.DosisStore.getActiveProfile();
    const readings = window.DosisStore.getReadings();
    const isDark = window.DosisStore.state.theme === 'dark';

    const streak = new Set(readings.map(r => new Date(r.timestamp).toDateString())).size;

    const el = document.createElement('div');
    el.className = 'p-6 pb-32 animate-up';

    const t = (key) => window.DosisStore.t(key);

    el.innerHTML = `
        <!-- Header -->
        <header class="flex items-center justify-between mb-8">
            <div id="btn-profiles" class="flex items-center gap-4 cursor-pointer active:scale-95 transition-all group">
                <div class="size-16 rounded-full border-4 border-primary p-1 shadow-premium group-hover:border-blue-400 transition-colors">
                    <img src="${profile.avatar}" class="size-full rounded-full object-cover">
                </div>
                <div>
                    <h2 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white transition-colors">${t('home').toUpperCase()}, ${profile.name}</h2>
                    <p class="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                        ${t('active_patient')}
                        <span class="material-symbols-outlined !text-[12px]">swap_horiz</span>
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button id="btn-notifications" class="relative size-14 bg-white dark:bg-white/10 shadow-premium rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-transparent dark:border-white/5">
                    <span class="material-symbols-outlined !text-2xl text-gray-700 dark:text-slate-300">notifications</span>
                    <span id="notification-badge" class="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <button id="btn-theme" class="size-14 bg-white dark:bg-white/10 shadow-premium rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-transparent dark:border-white/5">
                    <span class="material-symbols-outlined !text-2xl text-gray-700 dark:text-yellow-400">
                        ${isDark ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
            </div>
        </header>

        <!-- Gamification Card -->
        <div class="bg-gradient-to-br from-primary to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 mb-10 relative overflow-hidden">
            <div class="relative z-10">
                <p class="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-1">${t('health_streak')}</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-6xl font-black">${streak}</h3>
                    <span class="text-2xl font-bold opacity-80">${t('days')}</span>
                </div>
                <p class="text-blue-100/70 text-sm mt-2 font-medium">${t('excellent_constancy')}</p>
            </div>
            <div class="absolute -right-6 -bottom-6 size-40 bg-white/10 rounded-full blur-3xl"></div>
            <span class="absolute top-8 right-8 text-5xl opacity-40">🔥</span>
        </div>

        <!-- Quick Access Grid -->
        <h4 class="text-lg font-black mb-6 flex items-center gap-2 text-gray-800 dark:text-white transition-colors">
            <span class="material-symbols-outlined text-primary">add_circle</span>
            ${t('register_measure')}
        </h4>
        <div class="grid grid-cols-2 gap-4 mb-10">
            <button id="btn-pressure" class="h-44 bg-[#fef2f2] dark:bg-red-500/10 border-2 border-red-100 dark:border-red-500/20 rounded-[2.5rem] p-6 flex flex-col justify-between text-left active:scale-95 transition-all group">
                <div class="size-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 group-active:scale-90 transition-transform">
                    <span class="material-symbols-outlined !text-3xl">favorite</span>
                </div>
                <div>
                    <p class="font-black text-xl text-gray-800 dark:text-red-50/90">${t('pressure_short')}</p>
                    <p class="text-[9px] font-black text-red-400 dark:text-red-400/80 uppercase tracking-widest">${t('systolic')} / DIAST.</p>
                </div>
            </button>
            <button id="btn-glucose" class="h-44 bg-[#fff7ed] dark:bg-orange-500/10 border-2 border-orange-100 dark:border-orange-500/20 rounded-[2.5rem] p-6 flex flex-col justify-between text-left active:scale-95 transition-all group">
                <div class="size-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-active:scale-90 transition-transform">
                    <span class="material-symbols-outlined !text-3xl">water_drop</span>
                </div>
                <div>
                    <p class="font-black text-xl text-gray-800 dark:text-orange-50/90">${t('glucose')}</p>
                    <p class="text-[9px] font-black text-orange-400 dark:text-orange-400/80 uppercase tracking-widest">${t('fasting')} / POST</p>
                </div>
            </button>
            <button id="btn-oxygen" class="h-44 bg-[#f0f9ff] dark:bg-blue-500/10 border-2 border-blue-100 dark:border-blue-500/20 rounded-[2.5rem] p-6 flex flex-col justify-between text-left active:scale-95 transition-all group">
                <div class="size-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-active:scale-90 transition-transform">
                    <span class="material-symbols-outlined !text-3xl">thermostat</span>
                </div>
                <div>
                    <p class="font-black text-xl text-gray-800 dark:text-blue-50/90">${t('bio_health_short')}</p>
                    <p class="text-[9px] font-black text-blue-400 dark:text-blue-400/80 uppercase tracking-widest">${t('oxygen_short') || 'O2'} / TEMP</p>
                </div>
            </button>
            <button id="btn-weight" class="h-44 bg-[#f0fdf4] dark:bg-green-500/10 border-2 border-green-100 dark:border-green-500/20 rounded-[2.5rem] p-6 flex flex-col justify-between text-left active:scale-95 transition-all group">
                <div class="size-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 group-active:scale-90 transition-transform">
                    <span class="material-symbols-outlined !text-3xl">scale</span>
                </div>
                <div>
                    <p class="font-black text-xl text-gray-800 dark:text-green-50/90">${t('weight_short')}</p>
                    <p class="text-[9px] font-black text-green-400 dark:text-green-400/80 uppercase tracking-widest">CALC. AUTO</p>
                </div>
            </button>
        </div>

        <!-- Evaluation List -->
        <h4 class="text-lg font-black mb-4 text-gray-800 dark:text-white transition-colors">${t('daily_evaluation')}</h4>
        <div class="space-y-4">
            <button id="btn-pain" class="w-full bg-white dark:bg-slate-800 p-6 rounded-[2rem] flex items-center justify-between border-2 border-gray-100 dark:border-slate-700 active:scale-[0.98] transition-all text-left shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="size-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary">mood_bad</span>
                    </div>
                    <div>
                        <p class="font-black text-gray-800 dark:text-slate-100">${t('pain_scale')}</p>
                        <p class="text-xs text-gray-500 dark:text-slate-400 font-bold">${t('how_feel_today') || '¿Cómo te sientes hoy?'}</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-gray-300 dark:text-slate-600">chevron_right</span>
            </button>
            
            <button id="btn-bristol" class="w-full bg-white dark:bg-slate-800 p-6 rounded-[2rem] flex items-center justify-between border-2 border-gray-100 dark:border-slate-700 active:scale-[0.98] transition-all text-left shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="size-14 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center">
                        <span class="material-symbols-outlined text-amber-600 dark:text-amber-500">spa</span>
                    </div>
                    <div>
                        <p class="font-black text-gray-800 dark:text-slate-100">${t('bristol_scale')}</p>
                        <p class="text-xs text-gray-500 dark:text-slate-400 font-bold">${t('bristol_short')}</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-gray-300 dark:text-slate-600">chevron_right</span>
            </button>
        </div>

        <!-- Navigation Bar -->
        <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-8 flex justify-between items-center z-50">
            <button class="flex flex-col items-center gap-1 text-primary">
                <span class="material-symbols-outlined !text-3xl">home</span>
                <span class="text-[9px] font-black uppercase tracking-widest">${t('home')}</span>
            </button>
            <button id="nav-history" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                <span class="material-symbols-outlined !text-3xl">calendar_month</span>
                <span class="text-[9px] font-black uppercase tracking-widest">${t('history')}</span>
            </button>
            <button id="nav-trends" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                <span class="material-symbols-outlined !text-3xl">insights</span>
                <span class="text-[9px] font-black uppercase tracking-widest">${t('trends')}</span>
            </button>
            <button id="nav-profile" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                <span class="material-symbols-outlined !text-3xl">person</span>
                <span class="text-[9px] font-black uppercase tracking-widest">${t('profile')}</span>
            </button>
        </nav>
    `;

    el.querySelector('#btn-theme').onclick = () => {
        window.DosisStore.toggleTheme();
        router.navigateTo('dashboard');
    };

    // Botón de notificaciones
    el.querySelector('#btn-notifications').onclick = () => {
        const modal = window.Pages.NotificationsView(router);
        document.body.appendChild(modal);
    };

    // Actualizar badge de notificaciones
    const updateNotificationBadge = () => {
        const unreadCount = window.DosisNotifications.getUnreadCount();
        const badge = el.querySelector('#notification-badge');
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    };

    // Generar recordatorios e insights automáticamente
    const generateSmartNotifications = () => {
        const profile = window.DosisStore.getActiveProfile();
        if (profile) {
            // Generar recordatorios solo si han pasado más de 12 horas desde la última generación
            const lastGenKey = `last_notification_gen_${profile.id}`;
            const lastGen = localStorage.getItem(lastGenKey);
            const now = Date.now();

            if (!lastGen || (now - parseInt(lastGen)) > 12 * 60 * 60 * 1000) {
                window.DosisNotifications.generateSmartReminders(profile.id);
                window.DosisNotifications.generateHealthInsights(profile.id);
                localStorage.setItem(lastGenKey, now.toString());
            }
        }
    };

    generateSmartNotifications();
    updateNotificationBadge();

    el.querySelector('#btn-profiles').onclick = () => router.navigateTo('profiles');
    el.querySelector('#btn-pressure').onclick = () => router.navigateTo('form-pressure');
    el.querySelector('#btn-glucose').onclick = () => router.navigateTo('form-glucose');
    el.querySelector('#btn-oxygen').onclick = () => router.navigateTo('form-oxygen');
    el.querySelector('#btn-weight').onclick = () => router.navigateTo('form-weight');
    el.querySelector('#btn-pain').onclick = () => router.navigateTo('form-pain');
    el.querySelector('#btn-bristol').onclick = () => router.navigateTo('form-bristol');
    el.querySelector('#nav-history').onclick = () => router.navigateTo('history');
    el.querySelector('#nav-trends').onclick = () => router.navigateTo('trends');
    el.querySelector('#nav-profile').onclick = () => router.navigateTo('profile');

    return el;
};
