/**
 * Pain Scale Form
 */
window.Pages.PainForm = (router) => {
    let painLevel = 5;
    let notes = '';

    const editingId = window.editingReadingId;
    if (editingId) {
        const reading = window.DosisStore.getReadingById(editingId);
        if (reading && reading.type === 'pain') {
            painLevel = reading.values.value;
            notes = reading.values.notes || '';
        }
    }

    const el = document.createElement('div');
    el.className = 'p-6 pb-32 animate-up min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300';

    const render = () => {
        const currentNotes = el.querySelector('#notes')?.value || notes;
        notes = currentNotes;

        const emojis = ['😊', '🙂', '😐', '🫤', '☹️', '😧', '😫', '😩', '🥵', '😭', '💀'];
        const colors = ['#22c55e', '#4ade80', '#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a', '#000000'];

        el.innerHTML = `
            <header class="flex items-center gap-4 mb-8">
                <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                    <span class="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">
                    ${editingId ? 'Editar Dolor' : 'Nivel de Dolor'}
                </h2>
            </header>

            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-10 text-center">
                <div class="space-y-4">
                    <div class="text-8xl animate-bounce mb-4 transition-all duration-300 drop-shadow-xl h-24 flex items-center justify-center">
                        ${emojis[painLevel]}
                    </div>
                    <p class="text-6xl font-black text-gray-800 dark:text-slate-50 tabular-nums">${painLevel}</p>
                    <p class="text-xs font-black uppercase tracking-[0.4em] text-gray-400 dark:text-slate-500">Intensidad (0-10)</p>
                </div>

                <div class="px-4">
                    <input type="range" id="pain-range" min="0" max="10" value="${painLevel}" 
                        class="w-full h-4 bg-gray-100 dark:bg-slate-900 rounded-full appearance-none cursor-pointer accent-primary">
                </div>

                <div class="p-6 rounded-3xl transition-colors duration-500" style="background-color: ${colors[painLevel]}20; border: 2px solid ${colors[painLevel]}40">
                    <p class="font-black uppercase tracking-widest text-sm" style="color: ${colors[painLevel]}">
                        ${painLevel === 0 ? 'Sin Dolor' : painLevel < 4 ? 'Leve' : painLevel < 7 ? 'Moderado' : 'Severo'}
                    </p>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 text-left ml-2">Notas u Observaciones (Opcional)</label>
                    <textarea id="notes" placeholder="Ej: Dolor localizado en la espalda baja..." 
                        class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl p-5 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-primary outline-none transition-all resize-none">${notes}</textarea>
                </div>

                <button id="btn-save" class="w-full h-24 bg-primary text-white text-xl font-black rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-95 transition-all">
                    <span class="material-symbols-outlined !text-3xl">${editingId ? 'save' : 'check_circle'}</span>
                    ${editingId ? 'GUARDAR CAMBIOS' : 'REGISTRAR ESTADO'}
                </button>
            </div>
        `;

        el.querySelector('#btn-back').onclick = () => {
            window.editingReadingId = null;
            router.navigateTo(editingId ? 'history' : 'dashboard');
        };

        const slider = el.querySelector('#pain-range');
        slider.oninput = (e) => {
            painLevel = parseInt(e.target.value);
            render();
        };

        el.querySelector('#btn-save').onclick = () => {
            const finalNotes = el.querySelector('#notes').value.trim();
            const values = { value: painLevel, notes: finalNotes };

            if (editingId) {
                window.DosisStore.updateReading(editingId, values);
                window.editingReadingId = null;
                router.showToast('Registro actualizado');
                router.navigateTo('history');
            } else {
                window.DosisStore.addReading('pain', values);
                router.showToast('Estado registrado');
                router.navigateTo('dashboard');
            }
        };
    };

    render();
    return el;
};
