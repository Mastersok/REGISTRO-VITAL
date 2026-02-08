/**
 * Profiles Management View
 */
window.Pages = window.Pages || {};

window.Pages.ProfilesView = (router) => {
    const el = document.createElement('div');
    el.className = 'flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 animate-up pb-32 transition-colors duration-300';

    const medicalColors = [
        { name: 'Oceano', hex: '#0ea5e9' },
        { name: 'Esmeralda', hex: '#10b981' },
        { name: 'Indigo', hex: '#6366f1' },
        { name: 'Rosa', hex: '#f43f5e' },
        { name: 'Violeta', hex: '#8b5cf6' },
        { name: 'Noche', hex: '#0f172a' }
    ];

    const render = () => {
        const profiles = window.DosisStore.state.profiles;
        const activeId = window.DosisStore.state.activeProfileId;

        el.innerHTML = `
            <header class="p-6 pb-4">
                <div class="flex items-center gap-4">
                    <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">Pacientes</h2>
                </div>
            </header>

            <main class="flex-1 px-6 space-y-6">
                <!-- Profile List -->
                <div class="space-y-4">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Seleccionar Paciente</p>
                    ${profiles.map(p => `
                        <div class="relative group">
                            <button onclick="window.selectProfile('${p.id}')" 
                                class="w-full p-4 rounded-3xl border-2 transition-all flex items-center gap-4 
                                ${p.id === activeId ? 'bg-primary/5 border-primary shadow-md' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}">
                                <div class="size-14 rounded-2xl border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden shrink-0">
                                    <img src="${p.avatar}" class="size-full object-cover">
                                </div>
                                <div class="flex-1 text-left">
                                    <p class="font-black text-lg ${p.id === activeId ? 'text-primary' : 'text-gray-800 dark:text-slate-50'}">${p.name}</p>
                                    <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                                        ${p.id === activeId ? 'Seleccionado actualmente' : 'Toca para cambiar'}
                                    </p>
                                </div>
                                ${p.id === activeId ? '<span class="material-symbols-outlined text-primary">check_circle</span>' : ''}
                            </button>
                            ${profiles.length > 1 ? `
                                <button onclick="window.confirmDeleteProfile(event, '${p.id}', '${p.name}')" 
                                    class="absolute -top-2 -right-2 size-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border-2 border-white dark:border-slate-900 z-10">
                                    <span class="material-symbols-outlined !text-sm">close</span>
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- Add Profile Section -->
                <div class="pt-8 border-t border-gray-200 dark:border-slate-800 space-y-6">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Añadir Nuevo Paciente</p>
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-6">
                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">Nombre Completo</label>
                            <input type="text" id="new-profile-name" placeholder="Ej: María García"
                                class="w-full h-16 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-6 text-xl font-black text-gray-800 dark:text-slate-50 focus:border-primary outline-none transition-all">
                        </div>

                        <div class="space-y-4">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">Color Institucional</label>
                            <div class="flex flex-wrap gap-3 justify-between px-2">
                                ${medicalColors.map((c, i) => `
                                    <button onclick="window.selectNewColor('${c.hex}', ${i})" 
                                        class="size-10 rounded-xl border-4 transition-all active:scale-90 
                                        ${window.selectedNewColorHex === c.hex ? 'border-primary shadow-lg scale-110' : 'border-transparent shadow-sm'}" 
                                        style="background-color: ${c.hex}"></button>
                                `).join('')}
                            </div>
                        </div>

                        <button id="btn-add-profile" class="w-full h-20 bg-primary/10 text-primary text-sm font-black rounded-full flex items-center justify-center gap-4 active:scale-95 transition-all mt-4 border-2 border-primary/20">
                            <span class="material-symbols-outlined !text-2xl">person_add</span>
                            CREAR NUEVO PERFIL
                        </button>
                    </div>
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

        el.querySelector('#btn-back').onclick = () => router.navigateTo('profile');
        el.querySelector('#nav-home').onclick = () => router.navigateTo('dashboard');
        el.querySelector('#nav-history').onclick = () => router.navigateTo('history');
        el.querySelector('#nav-trends').onclick = () => router.navigateTo('trends');
        el.querySelector('#nav-profile').onclick = () => router.navigateTo('profile');

        el.querySelector('#btn-add-profile').onclick = () => {
            const nameInput = el.querySelector('#new-profile-name');
            const name = nameInput.value.trim();
            if (!name) { router.showToast('Ingresa un nombre'); return; }

            const color = window.selectedNewColorHex || medicalColors[0].hex;
            window.DosisStore.addProfile(name, color);

            router.showToast(`Perfil de ${name} creado`);
            nameInput.value = '';
            render();
        };
    };

    window.selectProfile = (id) => {
        window.DosisStore.setActiveProfile(id);
        router.showToast('Cambiando paciente...');
        setTimeout(() => router.navigateTo('dashboard'), 500);
    };

    window.confirmDeleteProfile = (event, id, name) => {
        event.stopPropagation();
        if (confirm(`¿Estás seguro de eliminar el perfil de ${name}? Se perderá el acceso a sus datos.`)) {
            window.DosisStore.deleteProfile(id);
            router.showToast('Perfil eliminado');
            render();
        }
    };

    window.selectedNewColorHex = medicalColors[0].hex;
    window.selectNewColor = (hex) => {
        const nameInput = el.querySelector('#new-profile-name');
        if (nameInput) {
            window.tempNewProfileName = nameInput.value;
        }
        window.selectedNewColorHex = hex;
        render();

        // Restore name after render
        const newNameInput = el.querySelector('#new-profile-name');
        if (newNameInput && window.tempNewProfileName) {
            newNameInput.value = window.tempNewProfileName;
        }
    };

    render();
    return el;
};
