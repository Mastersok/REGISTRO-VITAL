/**
 * Profile Component
 */
window.Pages = window.Pages || {};

window.Pages.ProfileView = (router) => {
    const profile = window.DosisStore.getActiveProfile();

    // Serious, clinical-style avatar generator based on Initials
    // We use a set of medical/institutional colors
    const medicalColors = ['0ea5e9', '10b981', '6366f1', 'f43f5e', '8b5cf6', '0f172a'];

    const getProfessionalAvatar = (name, colorIndex) => {
        const color = medicalColors[colorIndex % medicalColors.length];
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${color}&fontWeight=800&chars=2`;
    };

    const el = document.createElement('div');
    el.className = 'flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 animate-up pb-32 transition-colors duration-300';

    let colorIndex = 0;

    const t = (key) => window.DosisStore.t(key);

    const render = () => {
        el.innerHTML = `
            <header class="p-6 pb-4">
                <div class="flex items-center gap-4">
                    <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">${t('my_profile')}</h2>
                </div>
            </header>

            <main class="flex-1 px-6 space-y-8">
                <!-- Avatar Section -->
                <div class="flex flex-col items-center gap-6 mt-4">
                    <div class="relative group">
                        <div class="size-36 rounded-full border-4 border-white dark:border-slate-700 shadow-2xl relative overflow-hidden transition-all duration-500">
                            <img id="profile-avatar-preview" src="${profile.avatar}" class="size-full rounded-full object-cover">
                        </div>
                        <button id="btn-change-color" class="absolute bottom-1 right-1 size-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900 active:scale-90 transition-all">
                            <span class="material-symbols-outlined !text-2xl">${window.DosisStore.state.settings.isPremium ? 'camera_alt' : 'palette'}</span>
                        </button>
                    </div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">${t('toca_paleta')}</p>
                </div>

                <!-- Form Section -->
                <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('patient_name')}</label>
                            <input type="text" id="profile-name" value="${profile.name}" placeholder="Ej: Juan Pérez"
                                class="w-full h-16 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-6 text-xl font-black text-gray-800 dark:text-slate-50 focus:border-primary outline-none transition-all">
                        </div>
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('height_m')}</label>
                            <input type="number" id="profile-height" value="${profile.height || '1.70'}" step="0.01" placeholder="1.70"
                                class="w-full h-16 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-6 text-xl font-black text-gray-800 dark:text-slate-50 focus:border-primary outline-none transition-all">
                        </div>
                    </div>

                    <div class="p-5 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-start gap-4">
                        <div class="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                            <span class="material-symbols-outlined text-blue-500">verified_user</span>
                        </div>
                        <div>
                            <p class="text-[11px] text-gray-800 dark:text-slate-200 font-black uppercase tracking-wide">${t('local_privacy')}</p>
                            <p class="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                                ${t('local_privacy_desc')}
                            </p>
                        </div>
                    </div>

                    <button id="btn-manage-profiles" class="w-full h-16 bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-200 text-xs font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all border border-gray-200 dark:border-slate-700">
                        <span class="material-symbols-outlined !text-xl">group</span>
                        ${t('manage_patients').toUpperCase()}
                    </button>

                    <button id="btn-settings" class="w-full h-16 bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-200 text-xs font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all border border-gray-200 dark:border-slate-700">
                        <span class="material-symbols-outlined !text-xl">settings</span>
                        ${t('settings').toUpperCase()}
                    </button>

                    <button id="btn-save-profile" class="w-full h-20 bg-primary text-white text-lg font-black rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4">
                        <span class="material-symbols-outlined !text-2xl">save</span>
                        ${t('save').toUpperCase()}
                    </button>
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
                    <span class="text-[9px] font-black uppercase tracking-widest">${t('charts')}</span>
                </button>
                <button class="flex flex-col items-center gap-1 text-primary">
                    <span class="material-symbols-outlined !text-3xl">person</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">${t('profile')}</span>
                </button>
            </nav>
        `;

        el.querySelector('#btn-back').onclick = () => router.navigateTo('dashboard');
        el.querySelector('#nav-home').onclick = () => router.navigateTo('dashboard');
        el.querySelector('#nav-history').onclick = () => router.navigateTo('history');
        el.querySelector('#nav-trends').onclick = () => router.navigateTo('trends');
        el.querySelector('#btn-manage-profiles').onclick = () => router.navigateTo('profiles');
        el.querySelector('#btn-settings').onclick = () => router.navigateTo('settings');

        const nameInput = el.querySelector('#profile-name');
        const avatarPreview = el.querySelector('#profile-avatar-preview');

        // Create hidden file input for photo upload (Pro)
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profile.avatar = event.target.result;
                    avatarPreview.src = profile.avatar;
                };
                reader.readAsDataURL(file);
            }
        };

        // Dynamic change color (Free) or Photo (Pro)
        el.querySelector('#btn-change-color').onclick = () => {
            const isPremium = window.DosisStore.state.settings.isPremium;
            if (isPremium) {
                fileInput.click();
            } else {
                colorIndex++;
                const newAvatar = getProfessionalAvatar(nameInput.value || 'U', colorIndex);
                profile.avatar = newAvatar;
                avatarPreview.src = newAvatar;

                // Show floating hint about Pro
                router.showToast(t('only_pro_feature'), 'info');
            }
        };

        el.querySelector('#btn-save-profile').onclick = () => {
            const newName = nameInput.value.trim();
            const newHeight = parseFloat(el.querySelector('#profile-height').value);

            if (!newName) { router.showToast('Ingresa un nombre'); return; }
            if (!newHeight || newHeight < 0.5 || newHeight > 2.5) { router.showToast('Altura no válida (0.5m - 2.5m)'); return; }

            // Generate final avatar for this name
            profile.avatar = getProfessionalAvatar(newName, colorIndex);

            window.DosisStore.updateProfile({
                name: newName,
                avatar: profile.avatar,
                height: newHeight
            });
            router.showToast('Perfil actualizado correctamente');
            router.navigateTo('dashboard');
        };
    };

    render();
    return el;
};
