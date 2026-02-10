/**
 * Report Success Modal
 * Shows feedback after PDF generation and adds Native Share option
 */
window.Pages = window.Pages || {};

window.Pages.ReportSuccessModal = (pdfData, onDone) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in bg-black/60 backdrop-blur-sm';

    const t = (key) => window.DosisStore.t(key);

    el.innerHTML = `
        <div class="bg-white dark:bg-[#1a242d] w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative overflow-hidden animate-up">
            <!-- Background Decoration -->
            <div class="absolute -top-12 -right-12 size-40 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div class="flex flex-col items-center text-center">
                <div class="size-20 bg-green-500 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/20">
                    <span class="material-symbols-outlined !text-4xl">check_circle</span>
                </div>
                
                <h3 class="text-2xl font-black italic tracking-tighter mb-2 dark:text-white">${t('report_ready')}</h3>
                <p class="text-sm text-gray-500 font-medium mb-8">${t('report_success')}</p>
                
                <div class="w-full p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 mb-8 flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">description</span>
                    <span class="text-xs font-bold text-gray-600 dark:text-slate-300 truncate flex-1">${pdfData.fileName}</span>
                </div>

                <div class="grid grid-cols-1 w-full gap-3">
                    <button id="btn-share" class="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                        <span class="material-symbols-outlined">share</span>
                        ${t('share').toUpperCase()}
                    </button>
                    ${window.DosisStore.state.settings.doctorPhone && window.DosisStore.state.settings.isPremium ? `
                        <button id="btn-whatsapp" class="w-full h-14 bg-[#25D366] text-white font-black rounded-2xl shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 active:scale-95 transition-all border-b-4 border-black/10">
                            <span class="material-symbols-outlined">chat</span>
                            ${t('send_to_doctor').toUpperCase()}
                        </button>
                    ` : ''}
                    <button id="btn-close" class="w-full h-14 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-400 font-black rounded-2xl active:scale-95 transition-all">
                        ${t('done').toUpperCase()}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Handle Share
    el.querySelector('#btn-share').onclick = async () => {
        if (navigator.share && pdfData.blob) {
            try {
                const file = new File([pdfData.blob], pdfData.fileName, { type: 'application/pdf' });
                await navigator.share({
                    title: 'Dosis Vital Report',
                    text: t('share_text'),
                    files: [file]
                });
            } catch (err) {
                console.log('Share failed or cancelled:', err);
                // Fallback: If sharing fails (common on some browsers/file://), at least we already downloaded it.
            }
        } else {
            alert('Sharing not supported on this browser. The PDF was already downloaded to your device.');
        }
    };

    // Handle WhatsApp
    const btnWa = el.querySelector('#btn-whatsapp');
    if (btnWa) {
        btnWa.onclick = () => {
            const phone = window.DosisStore.state.settings.doctorPhone.replace(/\D/g, '');
            const msg = encodeURIComponent(t('whatsapp_msg'));
            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
        };
    }

    el.querySelector('#btn-close').onclick = () => {
        el.remove();
        onDone();
    };

    return el;
};
