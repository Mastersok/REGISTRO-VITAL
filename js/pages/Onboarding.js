/**
 * Onboarding View - First Run Experience
 */
window.Pages = window.Pages || {};

window.Pages.OnboardingView = (router) => {
    const el = document.createElement('div');
    el.className = 'flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300';

    const t = (key) => window.DosisStore.t(key);
    const medicalColors = [
        { name: 'Oceano', hex: '#0ea5e9' },
        { name: 'Esmeralda', hex: '#10b981' },
        { name: 'Indigo', hex: '#6366f1' },
        { name: 'Rosa', hex: '#f43f5e' },
        { name: 'Violeta', hex: '#8b5cf6' },
        { name: 'Noche', hex: '#0f172a' }
    ];

    let selectedColor = medicalColors[0].hex;

    const render = () => {
        el.innerHTML = `
            <main class="flex-1 flex flex-col p-8 max-w-md mx-auto w-full">
                <!-- Branding -->
                <div class="flex flex-col items-center text-center mt-12 mb-10 animate-up">
                    <div class="size-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-primary/5">
                        <img src="assets/logo.png" class="size-16 object-contain" alt="Logo">
                    </div>
                    <h1 class="text-3xl font-black italic tracking-tighter text-gray-800 dark:text-slate-50 leading-tight mb-3">
                        ${t('welcome_title')}
                    </h1>
                    <p class="text-sm font-medium text-gray-400 dark:text-slate-500 max-w-[280px]">
                        ${t('welcome_subtitle')}
                    </p>
                </div>

                <!-- Form Section -->
                <div class="space-y-6 animate-up stagger-1">
                    <div class="space-y-4">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('patient_name')}</label>
                        <input type="text" id="on-name" placeholder="Ej: Juan Pérez" 
                            class="w-full h-16 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-xl font-black text-gray-800 dark:text-slate-50 outline-none transition-all shadow-sm">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('birthdate')}</label>
                            <input type="date" id="on-birth" 
                                class="w-full h-16 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl px-4 text-sm font-black text-gray-800 dark:text-slate-50 outline-none transition-all shadow-sm">
                        </div>
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('height_m')}</label>
                            <input type="number" id="on-height" placeholder="1.70" step="0.01"
                                class="w-full h-16 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 text-xl font-black text-gray-800 dark:text-slate-50 outline-none transition-all shadow-sm">
                        </div>
                    </div>

                    <div class="space-y-4">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('select_color')}</label>
                        <div class="flex justify-between gap-3 px-2">
                            ${medicalColors.map(c => `
                                <button data-hex="${c.hex}" class="color-swatch size-11 rounded-xl border-4 transition-all active:scale-90 shadow-sm
                                    ${selectedColor === c.hex ? 'border-primary scale-110 shadow-lg' : 'border-transparent'}" 
                                    style="background-color: ${c.hex}"></button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Footer Action -->
                <div class="mt-auto py-10 animate-up stagger-2">
                    <button id="btn-start" class="w-full h-20 bg-primary text-white text-sm font-black rounded-full flex items-center justify-center gap-4 shadow-xl shadow-primary/30 active:scale-95 transition-all">
                        ${t('start_using').toUpperCase()}
                        <span class="material-symbols-outlined !text-2xl">arrow_forward</span>
                    </button>
                    <p class="text-center text-[9px] text-gray-400 mt-6 font-bold uppercase tracking-widest opacity-40">
                        © 2026 DOSIS VITAL - SALUD LOCAL Y PRIVADA
                    </p>
                </div>
            </main>
        `;

        // Handlers
        el.querySelectorAll('.color-swatch').forEach(btn => {
            btn.onclick = () => {
                selectedColor = btn.dataset.hex;
                render();
            };
        });

        el.querySelector('#btn-start').onclick = () => {
            const name = el.querySelector('#on-name').value.trim();
            const birth = el.querySelector('#on-birth').value;
            const height = parseFloat(el.querySelector('#on-height').value);

            if (!name) { router.showToast(t('error_enter_name') || 'Ingresa un nombre'); return; }
            if (!birth) { router.showToast(t('error_enter_birth') || 'Ingresa tu fecha de nacimiento'); return; }
            if (!height || height < 0.5 || height > 2.5) { router.showToast('Altura no válida'); return; }

            // Create Profile
            const profile = window.DosisStore.addProfile(name, selectedColor, height, birth);
            window.DosisStore.setActiveProfile(profile.id);

            router.showToast(t('setup_complete'));
            setTimeout(() => router.navigateTo('dashboard'), 500);
        };
    };

    render();
    return el;
};
