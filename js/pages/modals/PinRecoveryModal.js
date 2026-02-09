/**
 * PIN Recovery Modal - Security Question System
 */
window.Modals = window.Modals || {};

window.Modals.PinRecovery = (router, onSuccess) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-up';
    const t = (key) => window.DosisStore.t(key);
    const settings = window.DosisStore.state.settings;

    el.innerHTML = `
        <div class="w-full max-w-md mx-4 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl p-8 animate-slide-down">
            <div class="text-center mb-6">
                <div class="size-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-amber-500 !text-4xl">help</span>
                </div>
                <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 mb-2">${t('recover_pin') || 'Recuperar PIN'}</h2>
                <p class="text-sm text-gray-500 dark:text-slate-400">${t('answer_security_question') || 'Responde tu pregunta de seguridad'}</p>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-slate-400 ml-2">${t('security_question') || 'Pregunta de Seguridad'}</label>
                    <p class="mt-2 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm font-medium text-gray-700 dark:text-slate-300">${settings.securityQuestion}</p>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-slate-400 ml-2">${t('your_answer') || 'Tu Respuesta'}</label>
                    <input type="text" id="answer-input" placeholder="${t('enter_answer') || 'Ingresa tu respuesta'}" 
                        class="w-full mt-2 h-14 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-5 text-sm font-bold text-gray-800 dark:text-slate-50 focus:border-amber-500 outline-none">
                </div>

                <div class="flex gap-3 pt-4">
                    <button id="btn-cancel" class="flex-1 h-14 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-black rounded-full">${t('cancel') || 'Cancelar'}</button>
                    <button id="btn-verify" class="flex-1 h-14 bg-amber-500 text-white font-black rounded-full shadow-lg">${t('verify') || 'Verificar'}</button>
                </div>
            </div>
        </div>
    `;

    el.querySelector('#btn-cancel').onclick = () => el.remove();

    el.querySelector('#btn-verify').onclick = () => {
        const answer = el.querySelector('#answer-input').value.trim().toLowerCase();
        if (answer === settings.securityAnswer.toLowerCase()) {
            el.remove();
            onSuccess();
        } else {
            router.showToast(t('incorrect_answer') || 'Respuesta incorrecta', 'error');
        }
    };

    el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
    return el;
};
