/**
 * Sleep Tracking Form
 */
window.Pages.SleepForm = (router) => {
    const editingId = window.editingReadingId;
    let existingReading = null;
    if (editingId) {
        existingReading = window.DosisStore.getReadingById(editingId);
    }

    const t = (key) => window.DosisStore.t(key);
    const el = document.createElement('div');
    el.className = 'p-6 pb-32 animate-up min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300';

    // Default values
    let sleepType = existingReading ? existingReading.values.sleepType : 'night';
    let bedTime = existingReading ? existingReading.values.bedTime : (sleepType === 'night' ? '23:00' : '15:00');
    let wakeTime = existingReading ? existingReading.values.wakeTime : (sleepType === 'night' ? '07:00' : '16:00');
    let interruptions = existingReading ? existingReading.values.interruptions : 0;
    let feeling = existingReading ? existingReading.values.feeling : 3;
    let notes = existingReading ? existingReading.values.notes || '' : '';

    const calculateDuration = (start, end) => {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        let diff = (endH * 60 + endM) - (startH * 60 + startM);
        if (diff < 0) diff += 24 * 60; // Crosses midnight

        return (diff / 60).toFixed(1);
    };

    const render = () => {
        const duration = calculateDuration(bedTime, wakeTime);
        const emojis = ['😫', '😴', '😐', '🙂', '✨'];
        const feelingLabels = [t('feeling_1'), t('feeling_2'), t('feeling_3'), t('feeling_4'), t('feeling_5')];

        el.innerHTML = `
            <header class="flex items-center gap-4 mb-8">
                <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                    <span class="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">
                    ${editingId ? t('edit') + ' ' + t('sleep_short') : t('sleep_tracking')}
                </h2>
            </header>

            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-8">
                <!-- Sleep Type Toggle -->
                <div class="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl">
                    <button id="mode-night" class="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${sleepType === 'night' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}">
                        ${t('night_sleep')}
                    </button>
                    <button id="mode-nap" class="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${sleepType === 'nap' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400'}">
                        ${t('nap')}
                    </button>
                </div>

                <!-- Times -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">${t('bed_time')}</label>
                        <input type="time" id="bed-time" value="${bedTime}" class="w-full h-16 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl text-center font-black text-gray-800 dark:text-white focus:border-primary outline-none">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">${t('wake_time')}</label>
                        <input type="time" id="wake-time" value="${wakeTime}" class="w-full h-16 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl text-center font-black text-gray-800 dark:text-white focus:border-primary outline-none">
                    </div>
                </div>

                <!-- Duration Display -->
                <div class="p-6 rounded-3xl bg-blue-500/5 border-2 border-blue-500/10 flex items-center justify-between">
                    <div>
                        <p class="text-[9px] font-black uppercase tracking-widest text-blue-500/60 mb-1">${t('duration')}</p>
                        <p class="text-3xl font-black text-blue-600 dark:text-blue-400">${duration} <span class="text-sm opacity-50 font-bold">${t('hours_short')}</span></p>
                    </div>
                    <span class="material-symbols-outlined !text-4xl text-blue-500/20">bedtime</span>
                </div>

                <!-- Interruptions -->
                <div class="space-y-3">
                    <label class="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">${t('interruptions')}</label>
                    <div class="flex items-center justify-between bg-gray-50 dark:bg-slate-900 p-2 rounded-2xl border-2 border-gray-100 dark:border-slate-700">
                        <button id="int-minus" class="size-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-500 active:scale-90 transition-all">
                            <span class="material-symbols-outlined">remove</span>
                        </button>
                        <p class="text-xl font-black text-gray-800 dark:text-white">${interruptions} <span class="text-[10px] opacity-40 uppercase">${t('times')}</span></p>
                        <button id="int-plus" class="size-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-500 active:scale-90 transition-all">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </div>

                <!-- Feeling -->
                <div class="space-y-3">
                    <label class="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">${t('sleep_quality')}</label>
                    <div class="flex justify-between items-center px-2">
                        ${emojis.map((emoji, i) => `
                            <button class="feeling-btn size-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${feeling === (i + 1) ? 'bg-primary/20 scale-110 border-2 border-primary/50' : 'opacity-40 grayscale'}" data-val="${i + 1}">
                                ${emoji}
                            </button>
                        `).join('')}
                    </div>
                    <p class="text-center text-[10px] font-black text-primary uppercase tracking-widest mt-2">${feelingLabels[feeling - 1]}</p>
                </div>

                <!-- Notes -->
                <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div class="flex justify-between items-center ml-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-gray-400">${t('notes')}</label>
                        <span id="char-count" class="text-[8px] font-black text-gray-400 uppercase">0 / 100</span>
                    </div>
                    <textarea id="notes" maxlength="100" placeholder="${t('notes_placeholder')}" 
                        class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-primary outline-none transition-all resize-none">${notes}</textarea>
                </div>

                <button id="btn-save" class="w-full h-20 bg-primary text-white text-lg font-black rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4">
                    <span class="material-symbols-outlined !text-2xl">${editingId ? 'save' : 'check_circle'}</span>
                    ${editingId ? t('save') : t('register')}
                </button>
            </div>
        `;

        setupEvents();
    };

    const setupEvents = () => {
        el.querySelector('#btn-back').onclick = () => {
            window.editingReadingId = null;
            router.navigateTo(editingId ? 'history' : 'dashboard');
        };

        el.querySelector('#mode-night').onclick = () => { sleepType = 'night'; render(); };
        el.querySelector('#mode-nap').onclick = () => { sleepType = 'nap'; render(); };

        el.querySelector('#bed-time').onchange = (e) => { bedTime = e.target.value; render(); };
        el.querySelector('#wake-time').onchange = (e) => { wakeTime = e.target.value; render(); };

        el.querySelector('#int-minus').onclick = () => { if (interruptions > 0) { interruptions--; render(); } };
        el.querySelector('#int-plus').onclick = () => { interruptions++; render(); };

        el.querySelectorAll('.feeling-btn').forEach(btn => {
            btn.onclick = () => { feeling = parseInt(btn.dataset.val); render(); };
        });

        const notesArea = el.querySelector('#notes');
        const charCount = el.querySelector('#char-count');
        const updateCharCount = () => {
            charCount.innerText = `${notesArea.value.length} / 100`;
            notes = notesArea.value;
        };
        notesArea.oninput = updateCharCount;
        updateCharCount();

        el.querySelector('#btn-save').onclick = () => {
            const data = {
                sleepType,
                bedTime,
                wakeTime,
                duration: calculateDuration(bedTime, wakeTime),
                interruptions,
                feeling,
                notes: notes.trim()
            };

            if (editingId) {
                window.DosisStore.updateReading(editingId, data);
                window.editingReadingId = null;
                router.showToast(t('record_updated'));
                router.navigateTo('history');
            } else {
                window.DosisStore.addReading('sleep', data);
                router.showToast(t('sleep_registered') || 'Sueño registrado');
                router.navigateTo('dashboard');
            }
        };
    };

    render();
    return el;
};
