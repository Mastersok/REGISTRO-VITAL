/**
 * Bristol Stool Scale Form
 */
window.Pages.BristolForm = (router) => {
    let selectedType = null;
    let notes = '';
    let initialized = false;

    const editingId = window.editingReadingId;
    if (editingId && !initialized) {
        const reading = window.DosisStore.getReadingById(editingId);
        if (reading && reading.type === 'bristol') {
            selectedType = reading.values.value;
            notes = reading.values.notes || '';
            initialized = true;
        }
    }
    const el = document.createElement('div');
    el.className = 'p-6 pb-48 animate-up min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300';

    const types = [
        { id: 1, label: 'Tipo 1', desc: 'Troceada, dura (Estreñimiento)', icon: '💩' },
        { id: 2, label: 'Tipo 2', desc: 'Forma de salchicha, compuesta de fragmentos', icon: '💩' },
        { id: 3, label: 'Tipo 3', desc: 'Forma de salchicha con grietas', icon: '💩' },
        { id: 4, label: 'Tipo 4', desc: 'Fina, suave y lisa (Ideal)', icon: '✨' },
        { id: 5, label: 'Tipo 5', desc: 'Trozos de masa blanda con bordes cortados', icon: '💧' },
        { id: 6, label: 'Tipo 6', desc: 'Fragmentos blandos y esponjosos', icon: '💧' },
        { id: 7, label: 'Tipo 7', desc: 'Acuosa, sin trozos sólidos', icon: '🌊' }
    ];

    const t = (key) => window.DosisStore.t(key);

    const render = () => {
        const currentNotes = el.querySelector('#notes')?.value || notes;
        notes = currentNotes;

        el.innerHTML = `
            <header class="flex items-center gap-4 mb-8">
                <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                    <span class="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">
                    ${editingId ? t('edit') + ' ' + t('bristol_short') : t('bristol_scale')}
                </h2>
            </header>

            <div class="grid grid-cols-1 gap-3 mb-8">
                ${types.map(t => `
                    <button id="type-${t.id}" class="p-6 rounded-[2rem] border-2 transition-all text-left flex items-center gap-6 
                        ${selectedType === t.id ? 'bg-amber-500 border-amber-600 shadow-lg scale-[1.02]' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}">
                        <span class="text-4xl shrink-0">${t.icon}</span>
                        <div>
                            <p class="font-black ${selectedType === t.id ? 'text-white' : 'text-gray-800 dark:text-slate-100'}">${t.label}</p>
                            <p class="text-[10px] font-bold ${selectedType === t.id ? 'text-white/80' : 'text-gray-400 dark:text-slate-500'} uppercase tracking-wider">${t.desc}</p>
                        </div>
                    </button>
                `).join('')}
            </div>

            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-4 mb-32">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('notes')}</label>
                <textarea id="notes" placeholder="${t('notes_placeholder')}" 
                    class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl p-5 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-amber-500 outline-none transition-all resize-none">${notes}</textarea>
            </div>

            <footer class="fixed bottom-6 left-6 right-6 z-50">
                <button id="btn-save" class="w-full h-20 active:scale-95 transition-all flex items-center justify-center gap-4 ${selectedType ? 'bg-amber-600 text-white shadow-2xl opacity-100' : 'bg-gray-200 text-gray-400 opacity-30 pointer-events-none'} text-xl font-black rounded-full">
                    <span class="material-symbols-outlined !text-3xl">${editingId ? 'save' : 'done_all'}</span>
                    ${editingId ? t('save') : t('confirm')}
                </button>
            </footer>
        `;

        el.querySelector('#btn-back').onclick = () => {
            window.editingReadingId = null;
            router.navigateTo(editingId ? 'history' : 'dashboard');
        };

        types.forEach(t => {
            el.querySelector(`#type-${t.id}`).onclick = () => {
                selectedType = t.id;
                render();
            };
        });

        if (selectedType) {
            el.querySelector('#btn-save').onclick = () => {
                const finalNotes = el.querySelector('#notes').value.trim();
                const values = { value: selectedType, notes: finalNotes };

                if (editingId) {
                    window.DosisStore.updateReading(editingId, values);
                    window.editingReadingId = null;
                    router.showToast('Registro actualizado');
                    router.navigateTo('history');
                } else {
                    window.DosisStore.addReading('bristol', values);
                    router.showToast('Registro de salud intestinal guardado');
                    router.navigateTo('dashboard');
                }
            };
        }
    };

    render();
    return el;
};
