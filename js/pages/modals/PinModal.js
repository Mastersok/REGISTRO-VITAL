/**
 * PIN Modal - Gating Access & Settings
 */
window.Modals = window.Modals || {};

window.Modals.PinModal = (router, onSuccess, isLockScreen = false) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#101922] transition-colors duration-300';

    const t = (key) => window.DosisStore.t(key);
    const settings = window.DosisStore.state.settings;
    let inputPin = '';

    const updateDots = () => {
        const dots = el.querySelectorAll('.pin-dot');
        dots.forEach((dot, i) => {
            if (i < inputPin.length) dot.classList.add('bg-primary', 'scale-125');
            else dot.classList.remove('bg-primary', 'scale-125');
        });
    };

    const handleKey = (num) => {
        if (inputPin.length < 4) {
            inputPin += num;
            updateDots();
            if (inputPin.length === 4) {
                setTimeout(() => {
                    if (window.DosisStore.verifyPIN(inputPin)) {
                        el.remove();
                        if (onSuccess) onSuccess();
                    } else {
                        inputPin = '';
                        updateDots();
                        router.showToast(t('incorrect_pin') || 'PIN Incorrecto', 'error');
                        // Mini shake animation
                        el.querySelector('.pin-dots').animate([
                            { transform: 'translateX(-10px)' },
                            { transform: 'translateX(10px)' },
                            { transform: 'translateX(0)' }
                        ], { duration: 200, iterations: 2 });
                    }
                }, 200);
            }
        }
    };

    el.innerHTML = `
        <div class="w-full max-w-sm px-8 flex flex-col items-center animate-up">
            <div class="size-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8">
                <span class="material-symbols-outlined text-primary !text-4xl">lock</span>
            </div>
            
            <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 mb-2">${t('enter_pin') || 'Ingresa tu PIN'}</h2>
            <p class="text-sm text-gray-400 dark:text-slate-500 mb-10 font-bold uppercase tracking-widest">${isLockScreen ? t('app_locked') : t('verify_identity')}</p>

            <div class="pin-dots flex gap-6 mb-12">
                <div class="pin-dot size-4 rounded-full border-2 border-primary/30 transition-all duration-300"></div>
                <div class="pin-dot size-4 rounded-full border-2 border-primary/30 transition-all duration-300"></div>
                <div class="pin-dot size-4 rounded-full border-2 border-primary/30 transition-all duration-300"></div>
                <div class="pin-dot size-4 rounded-full border-2 border-primary/30 transition-all duration-300"></div>
            </div>

            <div class="grid grid-cols-3 gap-6 w-full mb-8">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
                    <button class="num-key size-20 rounded-full bg-gray-50 dark:bg-slate-800/50 text-2xl font-black text-gray-800 dark:text-slate-50 active:scale-90 active:bg-primary active:text-white transition-all">${n}</button>
                `).join('')}
                <div class="size-20"></div>
                <button class="num-key size-20 rounded-full bg-gray-50 dark:bg-slate-800/50 text-2xl font-black text-gray-800 dark:text-slate-50 active:scale-90 active:bg-primary active:text-white transition-all">0</button>
                <button id="btn-delete" class="size-20 rounded-full flex items-center justify-center text-gray-400 active:scale-90 transition-all">
                    <span class="material-symbols-outlined !text-3xl">backspace</span>
                </button>
            </div>

            ${settings.securityQuestion ? `
                <button id="btn-recover" class="text-xs font-black text-primary uppercase tracking-widest active:opacity-50 transition-all h-12 flex items-center justify-center">
                    ${t('forgot_pin') || '¿Olvidaste tu PIN?'}
                </button>
            ` : ''}
        </div>
    `;

    el.querySelectorAll('.num-key').forEach(btn => {
        btn.onclick = () => handleKey(btn.innerText);
    });

    el.querySelector('#btn-delete').onclick = () => {
        inputPin = inputPin.slice(0, -1);
        updateDots();
    };

    if (el.querySelector('#btn-recover')) {
        el.querySelector('#btn-recover').onclick = () => {
            const recoveryModal = window.Modals.PinRecovery(router, () => {
                el.remove();
                if (onSuccess) onSuccess();
            });
            document.body.appendChild(recoveryModal);
        };
    }

    return el;
};
