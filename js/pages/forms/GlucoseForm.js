/**
 * Glucose Form Component - Enhanced with Medical Contexts
 */
window.Pages.GlucoseForm = (router) => {
    const editingId = window.editingReadingId;
    let timing = 'fasting'; // Default context
    let initialized = false;
    let initialValue = '';
    let initialNotes = '';

    if (editingId && !initialized) {
        const reading = window.DosisStore.getReadingById(editingId);
        if (reading && reading.type === 'glucose') {
            timing = reading.timing || 'fasting';
            initialValue = reading.values.value;
            initialNotes = reading.values.notes || '';
            initialized = true;
        }
    }

    const el = document.createElement('div');
    el.className = 'p-6 pb-32 animate-up min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300';

    const t = (key) => window.DosisStore.t(key);

    // Contextos médicos con rangos específicos
    const contexts = {
        fasting: { label: t('ctx_fasting'), icon: 'wb_twilight', range: '70-100 mg/dL', min: 70, max: 100 },
        before_meal: { label: t('ctx_before_meal'), icon: 'restaurant', range: '70-130 mg/dL', min: 70, max: 130 },
        after_meal: { label: t('ctx_after_meal'), icon: 'schedule', range: '< 180 mg/dL', min: 0, max: 180 },
        before_sleep: { label: t('ctx_before_sleep'), icon: 'bedtime', range: '100-140 mg/dL', min: 100, max: 140 },
        random: { label: t('ctx_random'), icon: 'shuffle', range: '< 200 mg/dL', min: 0, max: 200 }
    };

    const render = () => {
        const currentContext = contexts[timing];

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
                <!-- Contexto Médico -->
                <div class="space-y-3">
                    <label class="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 text-center">${t('glucose_context')}</label>
                    <div class="grid grid-cols-2 gap-2">
                        ${Object.entries(contexts).map(([key, ctx]) => `
                            <button data-context="${key}" class="context-btn py-3 px-4 rounded-2xl font-black text-[10px] transition-all ${key === 'random' ? 'col-span-2' : ''} ${timing === key ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400'}">
                                <span class="material-symbols-outlined !text-lg block mb-1">${ctx.icon}</span>
                                ${ctx.label}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="space-y-4">
                    <label class="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500 text-center">${t('concentration')}</label>
                    <input type="number" id="glucose-val" placeholder="90" value="${initialValue}"
                        class="w-full h-32 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-6xl font-black text-gray-800 dark:text-slate-50 focus:border-orange-500 outline-none transition-all tabular-nums">
                </div>

                <div id="evaluation-badge" class="flex items-center gap-4 p-5 bg-orange-500/10 rounded-2xl transition-all duration-500">
                    <span class="material-symbols-outlined text-orange-600 dark:text-orange-400 !text-3xl">info</span>
                    <p class="text-[11px] font-bold text-orange-700 dark:text-orange-300 uppercase leading-relaxed tracking-wide">
                        ${t('normal_range')}: ${currentContext.range}
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

        // Event Listeners
        el.querySelector('#btn-back').onclick = () => {
            window.editingReadingId = null;
            router.navigateTo(editingId ? 'history' : 'dashboard');
        };

        // Context buttons
        el.querySelectorAll('.context-btn').forEach(btn => {
            btn.onclick = () => {
                initialValue = el.querySelector('#glucose-val').value;
                initialNotes = el.querySelector('#notes').value;
                timing = btn.dataset.context;
                render();
            };
        });

        const gluInput = el.querySelector('#glucose-val');
        const badgeContainer = el.querySelector('#evaluation-badge');
        const badgeText = badgeContainer.querySelector('p');
        const badgeIcon = badgeContainer.querySelector('span');

        const updateEvaluation = () => {
            const val = parseInt(gluInput.value);
            if (val > 20) {
                const evalResult = window.DosisStore.evaluateReading('glucose', { value: val }, timing);

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
                badgeText.innerText = `${t('status')}: ${evalResult.message}`;
            } else {
                badgeContainer.className = 'flex items-center gap-4 p-5 bg-orange-500/10 rounded-2xl';
                badgeText.className = 'text-[11px] font-bold text-orange-700 dark:text-orange-300 uppercase leading-relaxed tracking-wide';
                badgeIcon.className = 'material-symbols-outlined text-orange-600 dark:text-orange-400 !text-3xl';
                badgeText.innerText = `${t('normal_range')}: ${currentContext.range}`;
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
            if (!val) { router.showToast(t('enter_valid_value') || 'Ingresa un valor válido'); return; }

            if (editingId) {
                window.DosisStore.updateReading(editingId, { value: val, notes }, timing);
                window.editingReadingId = null;
                router.showToast(t('record_updated') || 'Registro actualizado');
                router.navigateTo('history');
            } else {
                window.DosisStore.addReading('glucose', { value: val, timing, notes }, timing);
                router.showToast(t('glucose_registered') || 'Glucosa registrada');
                router.navigateTo('dashboard');
            }
        };
    };

    render();
    return el;
};
