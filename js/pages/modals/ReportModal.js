/**
 * Report Filters Modal
 * Allows selection of Date Range and Data Types
 */
window.Pages = window.Pages || {};

window.Pages.ReportModal = (onConfirm, onCancel) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-up bg-black/50 backdrop-blur-sm';

    const t = (key) => window.DosisStore.t(key);

    el.innerHTML = `
        <div class="bg-white dark:bg-[#1a242d] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <!-- Header -->
            <div class="mb-6">
                <h3 class="text-2xl font-black italic tracking-tighter mb-2">${t('export_data')}</h3>
                <p class="text-sm text-gray-500 font-bold">${t('config_report')}</p>
            </div>

            <!-- Date Range -->
            <div class="mb-6 space-y-3">
                <p class="text-xs font-black uppercase text-primary tracking-widest">${t('time_range')}</p>
                <div class="grid grid-cols-2 gap-2">
                    <label>
                        <input type="radio" name="range" value="7" class="peer hidden" checked>
                        <div class="h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold peer-checked:bg-primary peer-checked:text-white transition-all cursor-pointer">
                            7 ${t('days')}
                        </div>
                    </label>
                    <label>
                        <input type="radio" name="range" value="30" class="peer hidden">
                        <div class="h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold peer-checked:bg-primary peer-checked:text-white transition-all cursor-pointer">
                            30 ${t('days')}
                        </div>
                    </label>
                    <label>
                        <input type="radio" name="range" value="all" class="peer hidden">
                        <div class="h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold peer-checked:bg-primary peer-checked:text-white transition-all cursor-pointer">
                            ${t('all')}
                        </div>
                    </label>
                    <label>
                        <input type="radio" name="range" value="custom" class="peer hidden" id="radio-custom">
                        <div class="h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold peer-checked:bg-primary peer-checked:text-white transition-all cursor-pointer">
                            ${t('custom') || 'Personalizado'}
                        </div>
                    </label>
                </div>

                <!-- Custom Date Inputs -->
                <div id="custom-dates" class="hidden grid grid-cols-2 gap-2 mt-2 animate-up">
                    <div class="space-y-1">
                        <label class="text-[9px] font-black text-gray-400 uppercase ml-2">${t('start_date') || 'Inicio'}</label>
                        <input type="date" id="date-start" class="w-full h-10 bg-gray-100 dark:bg-white/5 rounded-xl px-3 text-xs font-bold outline-none text-gray-800 dark:text-slate-200">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[9px] font-black text-gray-400 uppercase ml-2">${t('end_date') || 'Fin'}</label>
                        <input type="date" id="date-end" class="w-full h-10 bg-gray-100 dark:bg-white/5 rounded-xl px-3 text-xs font-bold outline-none text-gray-800 dark:text-slate-200">
                    </div>
                </div>
            </div>

            <!-- Categories -->
            <div class="mb-8 space-y-3">
                <p class="text-xs font-black uppercase text-primary tracking-widest">${t('include')}</p>
                <div class="grid grid-cols-2 gap-3" id="cat-grid">
                    <!-- Injected via JS -->
                </div>
            </div>

            <!-- Actions -->
            <button id="btn-export" class="w-full h-16 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3">
                <span class="material-symbols-outlined">picture_as_pdf</span>
                ${t('generate_pdf')}
            </button>
            <button id="btn-cancel" class="w-full h-12 text-gray-400 font-bold text-sm tracking-wide">
                ${t('cancel').toUpperCase()}
            </button>
        </div>
    `;

    // Populate Categories
    const categories = [
        { id: 'pressure', label: t('pressure_short') },
        { id: 'glucose', label: t('glucose') },
        { id: 'oxygen_temp', label: t('bio_health_short') },
        { id: 'weight', label: t('weight_short') },
        { id: 'pain', label: t('pain_short') },
        { id: 'bristol', label: t('bristol_short') }
    ];

    const grid = el.querySelector('#cat-grid');
    categories.forEach(cat => {
        grid.innerHTML += `
            <label class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 cursor-pointer">
                <input type="checkbox" name="cats" value="${cat.id}" checked class="size-5 accent-primary rounded-md">
                <span class="text-sm font-bold">${cat.label}</span>
            </label>
        `;
    });

    // Toggle custom dates
    el.querySelectorAll('input[name="range"]').forEach(radio => {
        radio.onchange = (e) => {
            const customDiv = el.querySelector('#custom-dates');
            if (e.target.value === 'custom') {
                customDiv.classList.remove('hidden');
            } else {
                customDiv.classList.add('hidden');
            }
        };
    });

    // Events
    el.querySelector('#btn-cancel').onclick = () => {
        el.remove();
        onCancel();
    };

    el.querySelector('#btn-export').onclick = () => {
        const range = el.querySelector('input[name="range"]:checked').value;
        const selectedCats = Array.from(el.querySelectorAll('input[name="cats"]:checked')).map(cb => cb.value);

        if (selectedCats.length === 0) {
            alert(t('error_select_category') || "Selecciona al menos una categoría");
            return;
        }

        let customRange = null;
        if (range === 'custom') {
            const start = el.querySelector('#date-start').value;
            const end = el.querySelector('#date-end').value;
            if (!start || !end) {
                alert(t('error_select_dates') || "Selecciona ambas fechas");
                return;
            }
            customRange = { start, end };
        }

        onConfirm({ range, categories: selectedCats, customRange });
        el.remove();
    };

    // Close on backdrop
    el.onclick = (e) => {
        if (e.target === el) {
            el.remove();
            onCancel();
        }
    };

    return el;
};
