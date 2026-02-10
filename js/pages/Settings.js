/**
 * Settings Component
 */
window.Pages = window.Pages || {};

window.Pages.SettingsView = (router) => {
    const el = document.createElement('div');
    el.className = 'flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 animate-up pb-32 transition-colors duration-300';

    const t = (key) => window.DosisStore.t(key);

    const render = () => {
        const settings = window.DosisStore.state.settings;

        el.innerHTML = `
            <header class="p-6 pb-4">
                <div class="flex items-center gap-4">
                    <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">${t('settings')}</h2>
                </div>
            </header>

            <main class="flex-1 px-6 space-y-8">
                <!-- Section: Personalización -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">${t('system_prefs')}</p>
                    <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <!-- Idioma -->
                        <div class="p-6 flex items-center justify-between border-b border-gray-50 dark:border-slate-700/50">
                            <div class="flex items-center gap-4">
                                <div class="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <span class="material-symbols-outlined text-blue-500">language</span>
                                </div>
                                <p class="font-bold text-gray-700 dark:text-slate-200">${t('language')}</p>
                            </div>
                            <select id="set-lang" class="bg-gray-50 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm font-bold text-primary outline-none">
                                <option value="es" ${settings.language === 'es' ? 'selected' : ''}>Español</option>
                                <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                            </select>
                        </div>

                        <!-- Unidades -->
                        <div class="p-6 flex items-center justify-between border-b border-gray-50 dark:border-slate-700/50">
                            <div class="flex items-center gap-4">
                                <div class="size-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                                    <span class="material-symbols-outlined text-green-500">straighten</span>
                                </div>
                                <p class="font-bold text-gray-700 dark:text-slate-200">${t('units')}</p>
                            </div>
                            <select id="set-units" class="bg-gray-50 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm font-bold text-primary outline-none">
                                <option value="metric" ${settings.units === 'metric' ? 'selected' : ''}>Métrico (kg, °C)</option>
                                <option value="imperial" ${settings.units === 'imperial' ? 'selected' : ''}>Imperial (lb, °F)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <!-- Section: Configuración Médica (Pro) -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">${t('doctor_contact')}</p>
                    <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 overflow-hidden p-6 space-y-4">
                        <div class="flex items-center gap-4 mb-2">
                            <div class="size-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                                <span class="material-symbols-outlined">contact_phone</span>
                            </div>
                            <div class="flex-1">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">${t('doctor_phone')}</label>
                                <input type="text" id="set-doctor-phone" value="${settings.doctorPhone || ''}" placeholder="${t('doctor_phone_placeholder')}"
                                    class="w-full h-12 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-xl px-4 text-sm font-bold text-gray-800 dark:text-slate-50 focus:border-primary outline-none transition-all mt-1">
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Section: Seguridad Avanzada (Pro) -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">${t('security_privacy')}</p>
                    <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <!-- PIN -->
                        <div class="p-6 flex items-center justify-between border-b border-gray-50 dark:border-slate-700/50">
                            <div class="flex items-center gap-4">
                                <div class="size-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                    <span class="material-symbols-outlined text-red-500">lock</span>
                                </div>
                                <div>
                                    <p class="font-bold text-gray-700 dark:text-slate-200">${t('access_pin')}</p>
                                    <p class="text-[10px] text-gray-400 font-medium">${t('protect_data')}</p>
                                </div>
                            </div>
                            <button id="btn-set-pin" class="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-full shadow-lg shadow-primary/30">
                                ${settings.pin ? t('change_pin') : t('activate')}
                            </button>
                        </div>
                        
                        <!-- Biometría (Pro) -->
                        <div class="p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="size-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                    <span class="material-symbols-outlined text-purple-500">fingerprint</span>
                                </div>
                                <div>
                                    <p class="font-bold text-gray-700 dark:text-slate-200">${t('biometry')}</p>
                                    <p class="text-[10px] text-gray-400 font-medium">${t('biometry_desc')}</p>
                                </div>
                            </div>
                            <div class="relative inline-block w-12 h-6 transition duration-200 ease-in mt-1">
                                <input type="checkbox" id="toggle-biometry" ${settings.biometryEnabled ? 'checked' : ''} class="absolute w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:bg-primary checked:border-primary checked:right-0 right-6 transition-all duration-300"/>
                                <label for="toggle-biometry" class="block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer transition-colors duration-300 peer-checked:bg-primary/20"></label>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Section: Datos -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">${t('data_management')}</p>
                    <div class="grid grid-cols-2 gap-4">
                        <button id="btn-export" class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm">
                            <span class="material-symbols-outlined text-primary !text-3xl">upload</span>
                            <span class="text-[10px] font-black uppercase tracking-wider text-gray-700 dark:text-slate-200">${t('export')}</span>
                        </button>
                        <button id="btn-import-trigger" class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm">
                            <span class="material-symbols-outlined text-orange-500 !text-3xl">download</span>
                            <span class="text-[10px] font-black uppercase tracking-wider text-gray-700 dark:text-slate-200">${t('import')}</span>
                        </button>
                    </div>
                    <input type="file" id="file-import" class="hidden" accept=".json">
                    
                    <button id="btn-wipe" class="w-full p-6 bg-red-500/5 text-red-500 border-2 border-red-500/10 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all font-black text-xs uppercase tracking-widest">
                        <span class="material-symbols-outlined">delete_forever</span>
                        ${t('wipe_data')}
                    </button>
                </section>

                <!-- Section: Premium -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">PRO</p>
                    <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <div class="p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="size-10 ${settings.isPremium ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-400'} rounded-xl flex items-center justify-center">
                                    <span class="material-symbols-outlined">${settings.isPremium ? 'verified' : 'workspace_premium'}</span>
                                </div>
                                <div>
                                    <p class="font-bold text-gray-700 dark:text-slate-200">${settings.isPremium ? t('premium_active') : t('premium_upgrade')}</p>
                                    <p class="text-[10px] text-gray-400 font-medium">${settings.isPremium ? t('premium_subtitle') : t('one_time_payment')}</p>
                                </div>
                            </div>
                            ${!settings.isPremium ? `
                            <button onclick="window.showPaywall()" class="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg shadow-amber-500/30 active:scale-95 transition-all">
                                ${t('unlock_pro')}
                            </button>
                            ` : ''}
                        </div>
                    </div>
                </section>

                <!-- Footer Info -->
                <div class="text-center space-y-2 py-8">
                    <p id="dev-trigger" class="text-[10px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-[0.5em] transition-all cursor-pointer select-none">Dosis Vital v2.1</p>
                    <p class="text-[9px] text-gray-400 dark:text-slate-600 font-medium italic">Creado como herramienta de apoyo clínico personal.</p>
                    
                    <div id="dev-controls" class="hidden animate-up mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                         <p class="text-[9px] font-black text-primary uppercase mb-3 mr-2">${t('dev_mode')}</p>
                         <button id="btn-toggle-pro" class="h-10 px-4 bg-primary text-white text-[9px] font-black uppercase rounded-xl">
                            ${t('toggle_premium')}
                         </button>
                    </div>
                </div>
            </main>

            <!-- Navigation Bar -->
            <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-8 flex justify-between items-center z-50">
                <button id="nav-home" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
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
                <button id="nav-profile" class="flex flex-col items-center gap-1 text-primary">
                    <span class="material-symbols-outlined !text-3xl">person</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">${t('profile')}</span>
                </button>
            </nav>
        `;

        // Event Handlers
        el.querySelector('#btn-back').onclick = () => router.navigateTo('profile');
        el.querySelector('#nav-home').onclick = () => router.navigateTo('dashboard');
        el.querySelector('#nav-history').onclick = () => router.navigateTo('history');
        el.querySelector('#nav-trends').onclick = () => router.navigateTo('trends');
        el.querySelector('#nav-profile').onclick = () => router.navigateTo('profile');

        // Settings updates
        el.querySelector('#set-lang').onchange = (e) => {
            window.DosisStore.updateSettings({ language: e.target.value });
            router.showToast(t('language') + ' ' + t('status_normal').toLowerCase());
            render();
        };
        el.querySelector('#set-units').onchange = (e) => {
            window.DosisStore.updateSettings({ units: e.target.value });
            router.showToast('Sistema de unidades actualizado');
        };

        // Doctor Phone (Pro)
        el.querySelector('#set-doctor-phone').onblur = (e) => {
            const isPremium = window.DosisStore.state.settings.isPremium;
            if (!isPremium) {
                e.target.value = '';
                window.showPaywall();
                return;
            }
            window.DosisStore.updateSettings({ doctorPhone: e.target.value });
            router.showToast(t('record_updated'));
        };

        // Biometry (Pro)
        el.querySelector('#toggle-biometry').onclick = async (e) => {
            const isPremium = window.DosisStore.state.settings.isPremium;
            if (!isPremium) {
                e.preventDefault();
                window.showPaywall();
                return;
            }

            // Check if biometry is supported
            if (window.PublicKeyCredential) {
                try {
                    const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                    if (available) {
                        window.DosisStore.updateSettings({ biometryEnabled: e.target.checked });
                        router.showToast(e.target.checked ? t('biometry_activated') : t('record_updated'));
                    } else {
                        e.preventDefault();
                        alert(t('biometry_not_supported'));
                    }
                } catch (err) {
                    e.preventDefault();
                    console.error(err);
                }
            } else {
                e.preventDefault();
                alert(t('biometry_not_supported'));
            }
        };

        // PIN
        el.querySelector('#btn-set-pin').onclick = () => {
            const pin = settings.pin ?
                prompt(t('enter_new_pin') || 'Ingresa el nuevo PIN de 4 dígitos (vacío para desactivar):') :
                prompt(t('set_pin_message') || 'Crea un PIN de 4 dígitos para proteger tus datos:');

            if (pin === null) return;

            if (pin === '') {
                window.DosisStore.setPIN(null);
                router.showToast(t('pin_disabled') || 'PIN desactivado');
                render();
            } else if (/^\d{4}$/.test(pin)) {
                // Si está activando el PIN, pedir pregunta de seguridad
                const question = prompt(t('prompt_security_question') || 'Pregunta de seguridad (ej: ¿Nombre de tu primera mascota?):');
                if (!question) return;
                const answer = prompt(t('prompt_security_answer') || 'Respuesta a la pregunta:');
                if (!answer) return;

                window.DosisStore.setPIN(pin, question, answer);
                router.showToast(t('pin_activated') || 'PIN activado con seguridad');
                render();
            } else {
                alert(t('pin_error_length') || 'El PIN debe tener exactamente 4 números.');
            }
        };

        // Data Management
        el.querySelector('#btn-export').onclick = () => {
            const data = window.DosisStore.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dosis-vital-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            router.showToast('Backup generado');
        };

        el.querySelector('#btn-import-trigger').onclick = () => el.querySelector('#file-import').click();

        el.querySelector('#file-import').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const success = window.DosisStore.importData(event.target.result);
                if (success) {
                    router.showToast('Datos importados correctamente');
                    router.navigateTo('dashboard');
                } else {
                    alert('Error: El archivo no tiene un formato válido.');
                }
            };
            reader.readAsText(file);
        };

        el.querySelector('#btn-wipe').onclick = () => {
            if (confirm('¿ESTÁS ABSOLUTAMENTE SEGURO? Se borrarán todos los perfiles y registros. Esta acción no se puede deshacer.')) {
                localStorage.clear();
                location.reload();
            }
        };

        // Developer Mode Trigger
        let devClicks = 0;
        el.querySelector('#dev-trigger').onclick = () => {
            devClicks++;
            if (devClicks >= 5) {
                el.querySelector('#dev-controls').classList.remove('hidden');
                el.querySelector('#dev-trigger').classList.add('text-primary');
                router.showToast('Developer Mode Active');
            }
        };

        el.querySelector('#btn-toggle-pro').onclick = () => {
            const isPro = window.DosisStore.togglePremium();
            router.showToast('Premium: ' + (isPro ? 'ON' : 'OFF'));
            render(); // Refresh the settings view
        };
    };

    render();
    return el;
};
