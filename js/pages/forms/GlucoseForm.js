/**
 * Glucose Form Component
 */
window.Pages.GlucoseForm = (router) => {
    const editingId = window.editingReadingId;
    let timing = 'AYUNAS';
    let initialized = false;
    let initialValue = '';
    let initialNotes = '';

    if (editingId && !initialized) {
        const reading = window.DosisStore.getReadingById(editingId);
        if (reading && reading.type === 'glucose') {
            timing = reading.timing || 'AYUNAS';
            initialValue = reading.values.value;
            initialNotes = reading.values.notes || '';
            initialized = true;
        }
    }

    const el = document.createElement('div');
    el.className = 'p-6 pb-32 animate-up min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300';

    const t = (key) => window.DosisStore.t(key);

    const render = () => {
        el.innerHTML = `
            <header class="flex items-center gap-4 mb-8">
                <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                    <span class="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">
                    ${editingId ? t('edit') + ' ' + t('glucose') : t('glucose')}
                </h2>
            </header>

            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-8">
                <div class="flex p-1.5 bg-gray-100 dark:bg-slate-900 rounded-3xl">
                    <button id="tab-fasting" class="flex-1 py-4 rounded-2xl font-black text-sm transition-all ${timing === 'AYUNAS' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 dark:text-slate-500'}">${t('fasting').toUpperCase()}</button>
                    <button id="tab-post" class="flex-1 py-4 rounded-2xl font-black text-sm transition-all ${timing === 'POST-PRANDIAL' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 dark:text-slate-500'}">POST-PRANDIAL</button>
                </div>

                <div class="space-y-4">
                    <label class="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 text-center">${t('concentration')}</label>
                    <input type="number" id="glucose-val" placeholder="90" value="${initialValue}"
                        class="w-full h-32 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-6xl font-black text-gray-800 dark:text-slate-50 focus:border-orange-500 outline-none transition-all tabular-nums">
                </div>

                <div class="flex items-center gap-4 p-5 bg-orange-500/10 rounded-2xl transition-all duration-500">
                    <span class="material-symbols-outlined text-orange-600 dark:text-orange-400 !text-3xl">info</span>
                    <p class="text-[11px] font-bold text-orange-700 dark:text-orange-300 uppercase leading-relaxed tracking-wide">
                        ${timing === 'AYUNAS' ? 'Normal: 70 - 100 mg/dL' : 'Normal: 90 - 140 mg/dL'}
                    </p>
                </div>

                <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('notes')}</label>
                    <textarea id="notes" placeholder="${t('notes_placeholder')}" 
                        class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl p-5 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-orange-500 outline-none transition-all resize-none">${initialNotes}</textarea>
                </div>

                <button id="btn-save" class="w-full h-24 bg-orange-500 text-white text-xl font-black rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4">
                    <span class="material-symbols-outlined !text-3xl">${editingId ? 'save' : 'check_circle'}</span>
                    ${editingId ? t('save') : t('register')}
                </button>
            </div>
        `;

        el.querySelector('#btn-back').onclick = () => {
            window.editingReadingId = null;
            router.navigateTo(editingId ? 'history' : 'dashboard');
        };
        el.querySelector('#tab-fasting').onclick = () => {
            initialValue = el.querySelector('#glucose-val').value;
            initialNotes = el.querySelector('#notes').value;
            timing = 'AYUNAS';
            render();
        };
        el.querySelector('#tab-post').onclick = () => {
            initialValue = el.querySelector('#glucose-val').value;
            initialNotes = el.querySelector('#notes').value;
            timing = 'POST-PRANDIAL';
            render();
        };

        const gluInput = el.querySelector('#glucose-val');
        const badgeContainer = el.querySelector('.bg-orange-500\\/10');
        const badgeText = badgeContainer.querySelector('p');
        const badgeIcon = badgeContainer.querySelector('span');

        const updateEvaluation = () => {
            const val = parseInt(gluInput.value);
            if (val > 20) {
                const storeTiming = timing === 'AYUNAS' ? 'fasting' : 'postprandial';
                const evalResult = window.DosisStore.evaluateReading('glucose', { value: val }, storeTiming);

                badgeContainer.className = 'flex items-center gap-4 p-5 rounded-2xl transition-all duration-500';
                if (evalResult.status === 'danger') {
                    badgeContainer.classList.add('bg-red-500', 'text-white');
                    badgeText.className = 'text-[11px] font-black uppercase leading-relaxed tracking-wide';
                    badgeIcon.className = 'material-symbols-outlined !text-3xl';
                } else if (evalResult.status === 'warning') {
                    badgeContainer.classList.add('bg-amber-500', 'text-white');
                    badgeText.className = 'text-[11px] font-black uppercase leading-relaxed tracking-wide';
                    badgeIcon.className = 'material-symbols-outlined !text-3xl';
                } else {
                    badgeContainer.classList.add('bg-green-500', 'text-white');
                    badgeText.className = 'text-[11px] font-black uppercase leading-relaxed tracking-wide';
                    badgeIcon.className = 'material-symbols-outlined !text-3xl';
                }
                badgeText.innerText = `Estado: ${evalResult.message}`;
            } else {
                badgeContainer.className = 'flex items-center gap-4 p-5 bg-orange-500/10 rounded-2xl';
                badgeText.className = 'text-[11px] font-bold text-orange-700 dark:text-orange-300 uppercase leading-relaxed tracking-wide';
                badgeText.innerText = timing === 'AYUNAS' ? 'Guía ADA: Normal 70 - 100 mg/dL' : 'Guía ADA: Normal 90 - 140 mg/dL';
            }
        };

        gluInput.oninput = (e) => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 3) val = val.slice(0, 3);
            e.target.value = val;
            updateEvaluation();
        };

        if (initialValue) updateEvaluation();

        el.querySelector('#btn-save').onclick = () => {
            const val = parseInt(el.querySelector('#glucose-val').value);
            const notes = el.querySelector('#notes').value.trim();
            if (!val) { router.showToast('Ingresa un valor válido'); return; }

            if (editingId) {
                window.DosisStore.updateReading(editingId, { value: val, notes }, timing);
                window.editingReadingId = null;
                router.showToast('Registro actualizado');
                router.navigateTo('history');
            } else {
                window.DosisStore.addReading('glucose', { value: val, timing, notes }, timing);
                router.showToast('Glucosa registrada');
                router.navigateTo('dashboard');
            }
        };
    };

    render();
    return el;
};
