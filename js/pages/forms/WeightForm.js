/**
 * Weight Form Component
 */
window.Pages.WeightForm = (router) => {
    const editingId = window.editingReadingId;
    let existingReading = null;
    if (editingId) {
        existingReading = window.DosisStore.getReadingById(editingId);
    }
    const el = document.createElement('div');
    el.className = 'p-6 pb-32 animate-up min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300';

    const t = (key) => window.DosisStore.t(key);

    el.innerHTML = `
        <header class="flex items-center gap-4 mb-8">
            <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">
                ${editingId ? t('edit') + ' ' + t('weight_short') : t('weight_imc')}
            </h2>
        </header>

        <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-8">
            <div class="space-y-4">
                <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 text-center">${t('weight_kg')}</p>
                <input type="number" id="weight" step="0.1" placeholder="70.5" value="${existingReading ? existingReading.values.weight : ''}"
                    class="w-full h-32 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-6xl font-black text-gray-800 dark:text-slate-50 focus:border-green-500 outline-none transition-all tabular-nums">
                
                <div class="flex items-center justify-center gap-2 mt-2">
                    <p class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">${t('height_m')}: <span id="current-height-display">0.00</span>m</p>
                    <button id="btn-edit-height" class="text-[10px] font-black text-primary uppercase underline underline-offset-2">${t('change')}</button>
                </div>
            </div>

            <div id="imc-display" class="hidden animate-up">
                <div id="imc-container" class="p-6 rounded-3xl border-2 flex items-center justify-between transition-colors">
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">${t('estimated_imc')}</p>
                        <p id="imc-val" class="text-3xl font-black">--</p>
                    </div>
                    <div id="imc-desc" class="px-4 py-2 text-white rounded-xl font-black text-xs uppercase shadow-sm">--</div>
                </div>
            </div>

            <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                <div class="flex justify-between items-center ml-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">${t('notes')}</label>
                    <span id="char-count" class="text-[9px] font-black text-gray-400 uppercase tracking-widest">0 / 100</span>
                </div>
                <textarea id="notes" maxlength="100" placeholder="${t('notes_placeholder')}" 
                    class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl p-5 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-green-500 outline-none transition-all resize-none">${existingReading ? existingReading.values.notes || '' : ''}</textarea>
            </div>

            <button id="btn-save" class="w-full h-24 bg-green-500 text-white text-xl font-black rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4">
                <span class="material-symbols-outlined !text-3xl">${editingId ? 'save' : 'check_circle'}</span>
                ${editingId ? t('save') : t('register')}
            </button>
        </div>
    `;

    const weightInput = el.querySelector('#weight');
    const imcDisplay = el.querySelector('#imc-display');
    const imcValEl = el.querySelector('#imc-val');

    const updateIMC = () => {
        const weight = parseFloat(weightInput.value);
        const profile = window.DosisStore.getActiveProfile();
        const height = profile.height || 1.70;

        el.querySelector('#current-height-display').innerText = height.toFixed(2);

        if (weight > 20) {
            const imc = (weight / (height * height)).toFixed(1);
            imcValEl.innerText = imc;

            const evaluation = window.DosisStore.evaluateReading('weight', { bmi: imc });
            const container = el.querySelector('#imc-container');
            const desc = el.querySelector('#imc-desc');

            // Perfil de estilos dinámicos
            container.className = 'p-6 rounded-3xl border-2 flex items-center justify-between transition-colors';
            desc.className = 'px-4 py-2 text-white rounded-xl font-black text-xs uppercase shadow-sm';

            if (evaluation.status === 'danger') {
                container.classList.add('bg-red-500/10', 'border-red-500/20', 'text-red-700', 'dark:text-red-300');
                desc.classList.add('bg-red-500');
            } else if (evaluation.status === 'warning') {
                container.classList.add('bg-amber-500/10', 'border-amber-500/20', 'text-amber-700', 'dark:text-amber-300');
                desc.classList.add('bg-amber-500');
            } else {
                container.classList.add('bg-green-500/10', 'border-green-500/20', 'text-green-700', 'dark:text-green-300');
                desc.classList.add('bg-green-500');
            }

            desc.innerText = evaluation.message;
            imcDisplay.classList.remove('hidden');
        } else {
            imcDisplay.classList.add('hidden');
        }
    };

    // Character count for notes
    const notesArea = el.querySelector('#notes');
    const charCount = el.querySelector('#char-count');
    const updateCharCount = () => {
        charCount.innerText = `${notesArea.value.length} / 100`;
    };
    notesArea.oninput = updateCharCount;
    updateCharCount();

    weightInput.oninput = updateIMC;
    if (existingReading) updateIMC();

    el.querySelector('#btn-back').onclick = () => {
        window.editingReadingId = null;
        router.navigateTo(editingId ? 'history' : 'dashboard');
    };
    el.querySelector('#btn-edit-height').onclick = (e) => {
        e.preventDefault();
        router.navigateTo('profile');
    };
    el.querySelector('#btn-save').onclick = () => {
        const weight = parseFloat(weightInput.value);
        const notes = el.querySelector('#notes').value.trim();
        if (!weight) { router.showToast('Ingresa tu peso'); return; }

        const height = window.DosisStore.getActiveProfile().height || 1.70;
        const imc = (weight / (height * height)).toFixed(2);

        if (editingId) {
            window.DosisStore.updateReading(editingId, { weight, bmi: imc, notes });
            window.editingReadingId = null;
            router.showToast('Registro actualizado');
            router.navigateTo('history');
        } else {
            window.DosisStore.addReading('weight', { weight, bmi: imc, notes });
            router.showToast('Peso guardado');
            router.navigateTo('dashboard');
        }
    };

    updateIMC(); // Initialize height display
    return el;
};
