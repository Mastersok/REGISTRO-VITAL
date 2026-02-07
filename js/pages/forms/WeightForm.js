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

    el.innerHTML = `
        <header class="flex items-center gap-4 mb-8">
            <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">
                ${editingId ? 'Editar Peso' : 'Peso e IMC'}
            </h2>
        </header>

        <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-8">
            <div class="space-y-4">
                <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 text-center">Peso Actual (kg)</p>
                <input type="number" id="weight" step="0.1" placeholder="70.5" value="${existingReading ? existingReading.values.weight : ''}"
                    class="w-full h-32 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-6xl font-black text-gray-800 dark:text-slate-50 focus:border-green-500 outline-none transition-all tabular-nums">
            </div>

            <div id="imc-display" class="hidden animate-up">
                <div class="p-6 bg-green-500/10 dark:bg-green-500/20 rounded-3xl border-2 border-green-500/20 flex items-center justify-between">
                    <div>
                        <p class="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Tu IMC estimado</p>
                        <p id="imc-val" class="text-3xl font-black text-green-700 dark:text-green-300">--</p>
                    </div>
                    <div id="imc-desc" class="px-4 py-2 bg-green-500 text-white rounded-xl font-black text-xs uppercase">Normal</div>
                </div>
            </div>

            <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">Notas u Observaciones (Opcional)</label>
                <textarea id="notes" placeholder="Ej: Medición en ayunas, por la mañana..." 
                    class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl p-5 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-green-500 outline-none transition-all resize-none">${existingReading ? existingReading.values.notes || '' : ''}</textarea>
            </div>

            <button id="btn-save" class="w-full h-24 bg-green-500 text-white text-xl font-black rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4">
                <span class="material-symbols-outlined !text-3xl">${editingId ? 'save' : 'check_circle'}</span>
                ${editingId ? 'GUARDAR CAMBIOS' : 'REGISTRAR ESTADO'}
            </button>
        </div>
    `;

    const weightInput = el.querySelector('#weight');
    const imcDisplay = el.querySelector('#imc-display');
    const imcValEl = el.querySelector('#imc-val');

    const updateIMC = () => {
        const weight = parseFloat(weightInput.value);
        if (weight > 20) {
            const height = 1.70; // Hardcoded for POC
            const imc = (weight / (height * height)).toFixed(1);
            imcValEl.innerText = imc;
            imcDisplay.classList.remove('hidden');
        } else {
            imcDisplay.classList.add('hidden');
        }
    };

    weightInput.oninput = updateIMC;
    if (existingReading) updateIMC();

    el.querySelector('#btn-back').onclick = () => {
        window.editingReadingId = null;
        router.navigateTo(editingId ? 'history' : 'dashboard');
    };
    el.querySelector('#btn-save').onclick = () => {
        const weight = parseFloat(weightInput.value);
        const notes = el.querySelector('#notes').value.trim();
        if (!weight) { router.showToast('Ingresa tu peso'); return; }

        const height = 1.70;
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

    return el;
};
