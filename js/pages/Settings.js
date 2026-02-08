/**
 * Settings Component
 */
window.Pages = window.Pages || {};

window.Pages.SettingsView = (router) => {
    const el = document.createElement('div');
    el.className = 'flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 animate-up pb-32 transition-colors duration-300';

    const render = () => {
        const settings = window.DosisStore.state.settings;

        el.innerHTML = `
            <header class="p-6 pb-4">
                <div class="flex items-center gap-4">
                    <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">Configuración</h2>
                </div>
            </header>

            <main class="flex-1 px-6 space-y-8">
                <!-- Section: Personalización -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Preferencias del Sistema</p>
                    <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <!-- Idioma -->
                        <div class="p-6 flex items-center justify-between border-b border-gray-50 dark:border-slate-700/50">
                            <div class="flex items-center gap-4">
                                <div class="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <span class="material-symbols-outlined text-blue-500">language</span>
                                </div>
                                <p class="font-bold text-gray-700 dark:text-slate-200">Idioma</p>
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
                                <p class="font-bold text-gray-700 dark:text-slate-200">Sistema</p>
                            </div>
                            <select id="set-units" class="bg-gray-50 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm font-bold text-primary outline-none">
                                <option value="metric" ${settings.units === 'metric' ? 'selected' : ''}>Métrico (kg, °C)</option>
                                <option value="imperial" ${settings.units === 'imperial' ? 'selected' : ''}>Imperial (lb, °F)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <!-- Section: Seguridad -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Seguridad y Privacidad</p>
                    <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <div class="p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="size-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                    <span class="material-symbols-outlined text-red-500">lock</span>
                                </div>
                                <div>
                                    <p class="font-bold text-gray-700 dark:text-slate-200">PIN de Acceso</p>
                                    <p class="text-[10px] text-gray-400 font-medium">Protege tus datos localmente</p>
                                </div>
                            </div>
                            <button id="btn-set-pin" class="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-full shadow-lg shadow-primary/30">
                                ${settings.pin ? 'Cambiar PIN' : 'Activar'}
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Section: Datos -->
                <section class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Manejo de Datos</p>
                    <div class="grid grid-cols-2 gap-4">
                        <button id="btn-export" class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm">
                            <span class="material-symbols-outlined text-primary !text-3xl">download</span>
                            <span class="text-[10px] font-black uppercase tracking-wider text-gray-700 dark:text-slate-200">Exportar</span>
                        </button>
                        <button id="btn-import-trigger" class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm">
                            <span class="material-symbols-outlined text-orange-500 !text-3xl">upload</span>
                            <span class="text-[10px] font-black uppercase tracking-wider text-gray-700 dark:text-slate-200">Importar</span>
                        </button>
                    </div>
                    <input type="file" id="file-import" class="hidden" accept=".json">
                    
                    <button id="btn-wipe" class="w-full p-6 bg-red-500/5 text-red-500 border-2 border-red-500/10 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all font-black text-xs uppercase tracking-widest">
                        <span class="material-symbols-outlined">delete_forever</span>
                        Borrar Todos los Datos
                    </button>
                </section>

                <!-- Footer Info -->
                <div class="text-center space-y-2 py-8">
                    <p class="text-[10px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-[0.5em]">Dosis Vital v2.1</p>
                    <p class="text-[9px] text-gray-400 dark:text-slate-600 font-medium italic">Creado como herramienta de apoyo clínico personal.</p>
                </div>
            </main>

            <!-- Navigation Bar -->
            <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-8 flex justify-between items-center z-50">
                <button id="nav-home" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                    <span class="material-symbols-outlined !text-3xl">home</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Inicio</span>
                </button>
                <button id="nav-history" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                    <span class="material-symbols-outlined !text-3xl">calendar_month</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Historial</span>
                </button>
                <button id="nav-trends" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                    <span class="material-symbols-outlined !text-3xl">insights</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Gráficas</span>
                </button>
                <button id="nav-profile" class="flex flex-col items-center gap-1 text-primary">
                    <span class="material-symbols-outlined !text-3xl">person</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Perfil</span>
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
            router.showToast('Idioma actualizado');
        };
        el.querySelector('#set-units').onchange = (e) => {
            window.DosisStore.updateSettings({ units: e.target.value });
            router.showToast('Sistema de unidades actualizado');
        };

        // PIN
        el.querySelector('#btn-set-pin').onclick = () => {
            const pin = prompt('Ingresa un nuevo PIN de 4 dígitos (deja vacío para desactivar):');
            if (pin === null) return;
            if (pin === '' || /^\d{4}$/.test(pin)) {
                window.DosisStore.setPIN(pin || null);
                router.showToast(pin ? 'PIN activado' : 'PIN desactivado');
                render();
            } else {
                alert('El PIN debe tener exactamente 4 números.');
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
    };

    render();
    return el;
};
