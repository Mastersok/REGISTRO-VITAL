/**
 * Pressure Form Component
 */
window.Pages.PressureForm = (router) => {
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
                ${editingId ? 'Editar Presión' : 'Presión Arterial'}
            </h2>
        </header>

        <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-8">
            <div class="flex items-center gap-4 p-4 bg-red-500/10 rounded-2xl">
                <span class="material-symbols-outlined text-red-500 !text-3xl">favorite</span>
                <p class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Guía AHA: Normal < 120/80</p>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">Sistólica (MAX)</label>
                    <input type="number" id="systolic" placeholder="120" value="${existingReading ? existingReading.values.systolic : ''}"
                        class="w-full h-20 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-3xl font-black text-gray-800 dark:text-slate-50 focus:border-red-500 outline-none transition-all">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">Diastólica (MIN)</label>
                    <input type="number" id="diastolic" placeholder="80" value="${existingReading ? existingReading.values.diastolic : ''}"
                        class="w-full h-20 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-3xl font-black text-gray-800 dark:text-slate-50 focus:border-red-500 outline-none transition-all">
                </div>
            </div>

            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">Pulso (LPM)</label>
                <input type="number" id="pulse" placeholder="70" value="${existingReading ? existingReading.values.pulse : ''}"
                    class="w-full h-20 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-3xl font-black text-gray-800 dark:text-slate-50 focus:border-red-500 outline-none transition-all">
            </div>

            <div class="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">Notas u Observaciones (Opcional)</label>
                <textarea id="notes" placeholder="Ej: Medición después de hacer ejercicio..." 
                    class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl p-5 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-red-500 outline-none transition-all resize-none">${existingReading ? existingReading.values.notes || '' : ''}</textarea>
            </div>

            <button id="btn-save" class="w-full h-24 bg-red-500 text-white text-xl font-black rounded-full shadow-2xl shadow-red-500/40 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4">
                <span class="material-symbols-outlined !text-3xl">${editingId ? 'save' : 'check_circle'}</span>
                ${editingId ? 'GUARDAR CAMBIOS' : 'REGISTRAR ESTADO'}
            </button>
        </div>
    `;

    // Numeric blindage
    el.querySelectorAll('input').forEach(input => {
        input.oninput = (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); };
    });

    el.querySelector('#btn-back').onclick = () => {
        window.editingReadingId = null;
        router.navigateTo(editingId ? 'history' : 'dashboard');
    };

    el.querySelector('#btn-save').onclick = () => {
        const sys = parseInt(el.querySelector('#systolic').value);
        const dia = parseInt(el.querySelector('#diastolic').value);
        const pulse = parseInt(el.querySelector('#pulse').value);
        const notes = el.querySelector('#notes').value.trim();

        if (!sys || !dia || !pulse) {
            router.showToast('Por favor, completa todos los campos.');
            return;
        }

        if (editingId) {
            window.DosisStore.updateReading(editingId, { systolic: sys, diastolic: dia, pulse, notes });
            window.editingReadingId = null;
            router.showToast('Registro actualizado');
            router.navigateTo('history');
        } else {
            window.DosisStore.addReading('pressure', { systolic: sys, diastolic: dia, pulse, notes });
            router.showToast('Presión guardada correctamente');
            router.navigateTo('dashboard');
        }
    };

    return el;
};
