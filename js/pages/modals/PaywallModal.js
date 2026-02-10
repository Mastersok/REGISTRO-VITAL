/**
 * Paywall Modal - Premium Upsell
 * High-end design to convert users to Pro
 */
window.Pages = window.Pages || {};

window.Pages.PaywallModal = (onCancel) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in';

    const t = (key) => window.DosisStore.t(key);

    el.innerHTML = `
        <div class="bg-white dark:bg-[#1a242d] w-full max-w-sm rounded-[3rem] shadow-2xl relative overflow-hidden animate-up">
            <!-- Header Image/Pattern -->
            <div class="h-40 bg-primary relative flex items-center justify-center overflow-hidden">
                <!-- Abstract patterns -->
                <div class="absolute inset-0 opacity-20">
                    <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
                    <div class="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-16 translate-y-16"></div>
                </div>
                <span class="material-symbols-outlined !text-7xl text-white relative z-10 drop-shadow-2xl">verified</span>
                
                <button id="btn-close-paywall" class="absolute top-6 right-6 size-10 bg-black/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

                <!-- Content -->
            <div class="p-8">
                <div class="text-center mb-6">
                    <h3 class="text-3xl font-black italic tracking-tighter dark:text-white leading-tight">${t('premium_upgrade')}</h3>
                    <p class="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-2 mb-3 bg-primary/5 py-1 px-4 rounded-full inline-block">${t('premium_subtitle')}</p>
                    <p class="text-xs font-bold text-gray-400 dark:text-slate-400 italic">${t('premium_emotional_phrase')}</p>
                </div>

                <!-- Benefits List -->
                <div class="grid grid-cols-1 gap-4 mb-8">
                    <div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div class="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                            <span class="material-symbols-outlined text-xl">history</span>
                        </div>
                        <p class="text-xs font-black text-gray-700 dark:text-slate-200 uppercase tracking-tight leading-tight">${t('premium_benefit_unlimited_history')}</p>
                    </div>
                    
                    <div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div class="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <span class="material-symbols-outlined text-xl">picture_as_pdf</span>
                        </div>
                        <p class="text-xs font-black text-gray-700 dark:text-slate-200 uppercase tracking-tight leading-tight">${t('premium_benefit_reports')}</p>
                    </div>

                    <div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div class="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                            <span class="material-symbols-outlined text-xl">camera_alt</span>
                        </div>
                        <p class="text-xs font-black text-gray-700 dark:text-slate-200 uppercase tracking-tight leading-tight">${t('premium_benefit_photos')}</p>
                    </div>

                    <div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div class="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                            <span class="material-symbols-outlined text-xl">favorite</span>
                        </div>
                        <p class="text-xs font-black text-gray-700 dark:text-slate-200 uppercase tracking-tight leading-tight">${t('premium_benefit_peace')}</p>
                    </div>

                    <div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div class="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <span class="material-symbols-outlined text-xl">shield</span>
                        </div>
                        <p class="text-xs font-black text-gray-700 dark:text-slate-200 uppercase tracking-tight leading-tight">${t('premium_benefit_security')}</p>
                    </div>
                </div>

                <!-- Pricing & Action -->
                <div class="space-y-4">
                    <button id="btn-buy-pro" class="w-full h-16 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all flex flex-col items-center justify-center">
                        <span>${t('buy_pro')}</span>
                        <span class="text-[10px] opacity-70 font-bold uppercase tracking-widest">${t('one_time_payment')}</span>
                    </button>
                    
                    <div class="flex items-center justify-between px-4">
                        <button class="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 tracking-widest">${t('restore_purchase')}</button>
                        <p class="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 tracking-widest">v2.1 PRO</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Events
    const closeModal = () => {
        el.remove();
        if (onCancel) onCancel();
    };

    el.querySelector('#btn-close-paywall').onclick = closeModal;

    el.querySelector('#btn-buy-pro').onclick = () => {
        // Here we simulate the purchase
        const success = window.DosisStore.togglePremium();
        if (success) {
            alert(t('premium_active'));
            closeModal();
            // Optional: force reload or notify observers
            location.reload();
        }
    };

    // Close on backdrop
    el.onclick = (e) => {
        if (e.target === el) closeModal();
    };

    return el;
};
