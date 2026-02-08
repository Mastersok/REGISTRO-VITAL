/**
 * Interactive Calendar Modal
 * Allows filtering history by date with visual day indicators.
 */
window.Pages = window.Pages || {};

window.Pages.CalendarModal = (currentDate = new Date(), onSelect, onReset) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-up bg-black/50 backdrop-blur-sm';

    // Internal State
    let viewDate = new Date(currentDate || new Date());
    let selectedDate = currentDate;

    // Get all readings to mark days with data
    const readings = window.DosisStore.getReadings();
    const datesWithData = new Set(
        readings.map(r => {
            const d = new Date(r.timestamp);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    // Global helper for inline onclick (re-defined per instance)
    window.CalendarSelect = (isoDate) => {
        el.remove();
        if (onSelect) onSelect(new Date(isoDate));
    };

    window.CalendarClose = () => {
        el.remove();
    };

    window.CalendarReset = () => {
        el.remove();
        if (onReset) onReset();
    };

    window.CalendarPrevMonth = () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        render();
    };

    window.CalendarNextMonth = () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        render();
    };

    const t = (key) => window.DosisStore.t(key);

    const render = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        // Month Header
        const monthName = viewDate.toLocaleDateString(window.DosisStore.state.settings.language === 'en' ? 'en-US' : 'es-ES', { month: 'long', year: 'numeric' });

        // Calendar Grid Logic
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        let startDayParams = firstDay.getDay() - 1; // Mon=0
        if (startDayParams === -1) startDayParams = 6; // Sunday fix

        const totalDays = lastDay.getDate();

        let daysHtml = '';

        // Empty slots
        for (let i = 0; i < startDayParams; i++) {
            daysHtml += `<div class="h-10 w-10"></div>`;
        }

        // Days
        for (let d = 1; d <= totalDays; d++) {
            const thisDate = new Date(year, month, d);
            // Compare using simple strings to avoid time issues
            const dateKey = `${year}-${month}-${d}`;
            const isToday = new Date().toDateString() === thisDate.toDateString();

            let isSelected = false;
            if (selectedDate) {
                const s = new Date(selectedDate);
                if (s.getFullYear() === year && s.getMonth() === month && s.getDate() === d) isSelected = true;
            }

            const hasData = datesWithData.has(dateKey);

            let classes = "h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold transition-all relative ";

            if (isSelected) {
                classes += "bg-primary text-white shadow-lg shadow-primary/40 scale-110";
            } else if (hasData) {
                classes += "bg-green-50 text-green-700 font-black border border-green-200";
            } else if (isToday) {
                classes += "text-primary border border-primary/30";
            } else {
                classes += "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10";
            }

            // Data Dot (if not selected to avoid clutter)
            const dot = (hasData && !isSelected) ?
                `<span class="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-green-500"></span>`
                : '';

            daysHtml += `
                <button onclick="window.CalendarSelect('${thisDate.toISOString()}')" class="${classes}">
                    ${d}
                    ${dot}
                </button>
            `;
        }

        const weekdays = window.DosisStore.state.settings.language === 'en'
            ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
            : ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

        el.innerHTML = `
            <div class="bg-white dark:bg-[#1a242d] w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                    <button onclick="window.CalendarPrevMonth()" class="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h3 class="text-lg font-black capitalize text-gray-900 dark:text-white tracking-tight">${monthName}</h3>
                    <button onclick="window.CalendarNextMonth()" class="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 active:scale-95 transition-all">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <!-- Weekdays -->
                <div class="grid grid-cols-7 mb-2 text-center">
                    ${weekdays.map(d => `<span class="text-xs font-bold text-gray-400 opacity-50">${d}</span>`).join('')}
                </div>

                <!-- Days Grid -->
                <div class="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center mb-6">
                    ${daysHtml}
                </div>

                <!-- Actions -->
                <div class="flex gap-3">
                    <button onclick="window.CalendarReset()" class="flex-1 h-12 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-black tracking-widest rounded-xl active:scale-95 transition-all">
                        ${t('show_all').toUpperCase()}
                    </button>
                    <button onclick="window.CalendarClose()" class="h-12 w-16 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-xl flex items-center justify-center active:scale-95 transition-all">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>
        `;
    };

    // Close on backdrop
    el.onclick = (e) => {
        if (e.target === el) el.remove();
    };

    render();
    return el;
};
