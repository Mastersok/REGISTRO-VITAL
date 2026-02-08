/**
 * Oxygen & Temp Form
 */
window.Pages.OxygenForm = (router) => {
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
                ${editingId ? t('edit') + ' ' + t('bio_health_short') : t('bio_health')}
            </h2>
        </header>

        <div class="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700 space-y-8">
            <div class="space-y-4 text-center">
                <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500">${t('oxygen_spo2')}</p>
                <input type="number" id="spo2" placeholder="98" value="${existingReading ? existingReading.values.spo2 || '' : ''}"
                    class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-5xl font-black text-gray-800 dark:text-slate-50 focus:border-blue-500 outline-none transition-all">
            </div>

            <div class="space-y-4 text-center">
                <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500">${t('body_temp')}</p>
                <input type="number" id="temp" step="0.1" placeholder="36.5" value="${existingReading ? existingReading.values.temp || '' : ''}"
                    class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl text-center text-5xl font-black text-gray-800 dark:text-slate-50 focus:border-blue-500 outline-none transition-all">
            </div>

            <div id="bio-eval" class="grid grid-cols-2 gap-4">
                <div id="spo2-badge" class="p-4 bg-blue-500/10 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-transparent transition-all">
                    <p class="text-[10px] font-black uppercase opacity-60">SpO2</p>
                    <p class="status-msg text-xs font-black uppercase tracking-tighter">OMS: >95%</p>
                </div>
                <div id="temp-badge" class="p-4 bg-orange-500/10 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-transparent transition-all">
                    <p class="text-[10px] font-black uppercase opacity-60">Temp</p>
                    <p class="status-msg text-xs font-black uppercase tracking-tighter">Normal: 36-37°</p>
                </div>
            </div>

            <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 ml-2">${t('notes')}</label>
                <textarea id="notes" placeholder="${t('notes_placeholder')}" 
                    class="w-full h-24 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-3xl p-5 text-sm font-bold text-gray-700 dark:text-slate-300 focus:border-blue-500 outline-none transition-all resize-none">${existingReading ? existingReading.values.notes || '' : ''}</textarea>
            </div>

            <button id="btn-save" class="w-full h-24 bg-blue-500 text-white text-xl font-black rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4">
                <span class="material-symbols-outlined !text-3xl">${editingId ? 'save' : 'check_circle'}</span>
                ${editingId ? t('save') : t('register')}
            </button>
        </div>
    `;

    const spo2Input = el.querySelector('#spo2');
    const tempInput = el.querySelector('#temp');

    const updateEvaluation = () => {
        const spo2 = spo2Input.value ? parseInt(spo2Input.value) : null;
        const temp = tempInput.value ? parseFloat(tempInput.value) : null;

        const evalResult = window.DosisStore.evaluateReading('oxygen_temp', { spo2, temp });

        // Update SpO2 badge
        const sBadge = el.querySelector('#spo2-badge');
        const sMsg = sBadge.querySelector('.status-msg');
        if (spo2) {
            sBadge.className = 'p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all';
            if (spo2 < 90) { sBadge.classList.add('bg-red-500', 'text-white', 'border-red-600'); sMsg.innerText = 'Bajo'; }
            else if (spo2 < 95) { sBadge.classList.add('bg-amber-500', 'text-white', 'border-amber-600'); sMsg.innerText = 'Alerta'; }
            else { sBadge.classList.add('bg-green-500', 'text-white', 'border-green-600'); sMsg.innerText = 'Óptimo'; }
        } else {
            sBadge.className = 'p-4 bg-blue-500/10 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-transparent text-blue-700 dark:text-blue-300';
            sMsg.innerText = 'OMS: >95%';
        }

        // Update Temp badge
        const tBadge = el.querySelector('#temp-badge');
        const tMsg = tBadge.querySelector('.status-msg');
        if (temp) {
            tBadge.className = 'p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all';
            if (temp > 38.0 || temp < 35.5) { tBadge.classList.add('bg-red-500', 'text-white', 'border-red-600'); tMsg.innerText = 'Alerta'; }
            else if (temp >= 37.3) { tBadge.classList.add('bg-amber-500', 'text-white', 'border-amber-600'); tMsg.innerText = 'Elevada'; }
            else { tBadge.classList.add('bg-green-500', 'text-white', 'border-green-600'); tMsg.innerText = 'Normal'; }
        } else {
            tBadge.className = 'p-4 bg-orange-500/10 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 border-transparent text-orange-700 dark:text-orange-300';
            tMsg.innerText = 'Normal: 36-37°';
        }
    };

    spo2Input.oninput = updateEvaluation;
    tempInput.oninput = updateEvaluation;
    if (existingReading) updateEvaluation();

    el.querySelector('#btn-back').onclick = () => {
        window.editingReadingId = null;
        router.navigateTo(editingId ? 'history' : 'dashboard');
    };

    el.querySelector('#btn-save').onclick = () => {
        const spo2Val = el.querySelector('#spo2').value;
        const tempVal = el.querySelector('#temp').value;
        const notes = el.querySelector('#notes').value.trim();

        if (!spo2Val && !tempVal) {
            router.showToast('Ingresa al menos un valor (Oxígeno o Temp)');
            return;
        }

        const data = {
            spo2: spo2Val ? parseInt(spo2Val) : null,
            temp: tempVal ? parseFloat(tempVal) : null,
            notes: notes
        };

        if (editingId) {
            window.DosisStore.updateReading(editingId, data);
            window.editingReadingId = null;
            router.showToast('Registro actualizado');
            router.navigateTo('history');
        } else {
            window.DosisStore.addReading('oxygen_temp', data);
            router.showToast('Salud Biográfica registrada');
            router.navigateTo('dashboard');
        }
    };

    return el;
};
