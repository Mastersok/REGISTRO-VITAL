/**
 * History Component
 */
window.Pages = window.Pages || {};

window.Pages.HistoryView = (router) => {
    // State
    let currentDateFilter = null;
    let selectedCategories = new Set();
    let selectedStatuses = new Set();

    const el = document.createElement('div');
    el.className = 'flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a] animate-up pb-24 transition-colors duration-300';

    const colors = {
        normal: 'bg-green-500 border-green-100 shadow-green-500/20',
        warning: 'bg-amber-500 border-amber-100 shadow-amber-500/20',
        danger: 'bg-red-500 border-red-100 shadow-red-500/20'
    };

    const filterOptions = [
        { id: 'pressure', label: 'Presión', icon: 'favorite' },
        { id: 'glucose', label: 'Glucosa', icon: 'bloodtype' },
        { id: 'oxygen_temp', label: 'Oxígeno', icon: 'thermostat' },
        { id: 'weight', label: 'Peso', icon: 'monitor_weight' },
        { id: 'pain', label: 'Dolor', icon: 'sentiment_dissatisfied' },
        { id: 'bristol', label: 'Nota', icon: 'edit_note' },
        { id: 'other', label: 'Extra', icon: 'more_horiz' }
    ];

    const statusOptions = [
        { id: 'normal', label: 'Normal', icon: 'check_circle' },
        { id: 'warning', label: 'Revisión', icon: 'warning' },
        { id: 'danger', label: 'Alerta', icon: 'emergency' }
    ];

    // Global toggle helpers
    window.toggleCategoryFilter = (id) => {
        if (id === 'all') {
            selectedCategories.clear();
        } else {
            if (selectedCategories.has(id)) selectedCategories.delete(id);
            else selectedCategories.add(id);
        }
        renderFilterBar();
        renderList();
    };

    window.toggleStatusFilter = (id) => {
        if (selectedStatuses.has(id)) selectedStatuses.delete(id);
        else selectedStatuses.add(id);
        renderFilterBar();
        renderList();
    };

    // --- RENDER HELPERS ---
    const renderFilterBar = () => {
        const container = el.querySelector('#filter-bar-content');
        if (!container) return;

        let html = `
            <!-- Types Grid -->
            <div class="grid grid-cols-4 gap-2">
                <button onclick="window.toggleCategoryFilter('all')" 
                    class="flex flex-col items-center justify-center p-2 rounded-2xl transition-all shadow-sm border
                    ${selectedCategories.size === 0 ? 'bg-primary text-white border-transparent' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-400 border-gray-100 dark:border-slate-700'}">
                    <span class="material-symbols-outlined !text-xl mb-1">apps</span>
                    <span class="text-[9px] font-black uppercase tracking-tighter">Todo</span>
                </button>
                ${filterOptions.map(opt => {
            const isActive = selectedCategories.has(opt.id);
            return `
                        <button onclick="window.toggleCategoryFilter('${opt.id}')" 
                            class="flex flex-col items-center justify-center p-2 rounded-2xl transition-all shadow-sm border
                            ${isActive ? 'bg-primary text-white border-transparent' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-400 border-gray-100 dark:border-slate-700'}">
                            <span class="material-symbols-outlined !text-xl mb-1">${opt.icon}</span>
                            <span class="text-[9px] font-black uppercase tracking-tighter">${opt.label}</span>
                        </button>
                    `;
        }).join('')}
            </div>

            <div class="h-px bg-gray-100 dark:bg-slate-800 my-4"></div>

            <!-- Status Row -->
            <div class="flex gap-2 mb-2">
                ${statusOptions.map(opt => {
            const isActive = selectedStatuses.has(opt.id);
            const statusColors = {
                normal: 'bg-green-500 text-white shadow-green-500/30',
                warning: 'bg-amber-500 text-white shadow-amber-500/30',
                danger: 'bg-red-500 text-white shadow-red-500/30'
            };
            return `
                        <button onclick="window.toggleStatusFilter('${opt.id}')" 
                            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border
                            ${isActive ? `${statusColors[opt.id]} border-transparent active:scale-95` : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-400 border-gray-100 dark:border-slate-700'}">
                            <span class="material-symbols-outlined !text-[16px]">${opt.icon}</span>
                            ${opt.label}
                        </button>
                    `;
        }).join('')}
            </div>
        `;
        container.innerHTML = html;
    };

    const updateHeader = () => {
        const dateEl = el.querySelector('#header-date');
        const filterBtn = el.querySelector('#btn-filter');
        const titleEl = el.querySelector('h2');
        if (!dateEl) return;

        if (currentDateFilter) {
            dateEl.innerHTML = `<span class="text-primary font-bold">📅 ${currentDateFilter.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>`;
            filterBtn.classList.remove('bg-white', 'dark:bg-slate-800');
            filterBtn.classList.add('bg-primary', 'text-white');
            titleEl.innerText = 'FILTRADO';
        } else {
            dateEl.innerHTML = `REGISTRO COMPLETO`;
            filterBtn.classList.add('bg-white', 'dark:bg-slate-800', 'text-gray-600', 'dark:text-slate-300');
            filterBtn.classList.remove('bg-primary', 'text-white');
            titleEl.innerText = 'HISTORIAL';
        }
        renderFilterBar();
    };

    const renderList = () => {
        let readings = window.DosisStore.getReadings();

        if (currentDateFilter) {
            readings = readings.filter(r => {
                const rd = new Date(r.timestamp);
                return rd.getDate() === currentDateFilter.getDate() &&
                    rd.getMonth() === currentDateFilter.getMonth() &&
                    rd.getFullYear() === currentDateFilter.getFullYear();
            });
        }
        if (selectedCategories.size > 0) readings = readings.filter(r => selectedCategories.has(r.type));
        if (selectedStatuses.size > 0) {
            readings = readings.filter(r => {
                const evalResult = window.DosisStore.evaluateReading(r.type, r.values, r.timing);
                return selectedStatuses.has(evalResult.status);
            });
        }

        const mainEl = el.querySelector('main');
        if (!mainEl) return;
        mainEl.innerHTML = '';

        const countEl = el.querySelector('#results-count');
        if (countEl) {
            countEl.innerText = `${readings.length} ${readings.length === 1 ? 'reg' : 'regs'}`;
            countEl.classList.toggle('opacity-0', readings.length === 0 && !currentDateFilter && selectedCategories.size === 0 && selectedStatuses.size === 0);
        }

        if (readings.length === 0) {
            const hasFilters = currentDateFilter || selectedCategories.size > 0 || selectedStatuses.size > 0;
            mainEl.innerHTML = `
                <div class="flex flex-col items-center justify-center pt-20 opacity-50 space-y-4 animate-up">
                    <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-700">filter_alt_off</span>
                    <p class="text-xl font-bold text-gray-400 dark:text-slate-600">Sin resultados</p>
                    ${hasFilters ? `<button onclick="window.resetFilter()" class="h-12 px-6 bg-primary/10 text-primary font-black rounded-xl active:scale-95 transition-all text-[10px] uppercase">Limpiar Filtros</button>` : ''}
                </div>
            `;
            updateHeader();
            return;
        }

        let currentDay = '';
        let readingListHtml = '';

        readings.forEach(item => {
            const date = new Date(item.timestamp);
            const dayStr = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            if (dayStr !== currentDay) {
                currentDay = dayStr;
                readingListHtml += `<h3 class="text-[10px] font-black uppercase text-gray-400 dark:text-slate-500 mt-8 mb-4 ml-2 italic tracking-[0.2em]">${dayStr}</h3>`;
            }

            const icons = { pressure: 'favorite', glucose: 'bloodtype', oxygen_temp: 'thermostat', weight: 'monitor_weight', pain: 'sentiment_dissatisfied', bristol: 'water_drop' };
            const typeConfig = {
                pressure: { label: 'Presión Arterial', getVal: v => `${v.systolic}/${v.diastolic}`, unit: 'mmHg', sub: v => `Pulso: ${v.pulse}` },
                glucose: { label: 'Glucosa', getVal: v => v.value, unit: 'mg/dL', sub: v => item.timing },
                oxygen_temp: {
                    label: 'Salud Biológica',
                    getVal: v => v.spo2 ? `${v.spo2}%` : (v.temp ? `${v.temp}°C` : '---'),
                    unit: v => v.spo2 ? 'SpO2' : (v.temp ? 'TEMP' : ''),
                    sub: v => (v.spo2 && v.temp) ? `Temp: ${v.temp}°C` : (v.spo2 ? 'Sin datos de Temp' : 'Sin datos de Oxígeno')
                },
                weight: { label: 'Peso Corporal', getVal: v => v.weight, unit: 'kg', sub: v => `IMC: ${v.bmi}` },
                pain: { label: 'Nivel de Dolor', getVal: v => v.value, unit: '/ 10', sub: v => '' },
                bristol: { label: 'Salud Intestinal', getVal: v => `Tipo ${item.values.value || '?'}`, unit: '', sub: v => '' }
            };

            const config = typeConfig[item.type] || { label: 'Medición', getVal: () => '?', unit: '', sub: () => '' };
            const valDisplay = config.getVal(item.values);
            const evaluation = window.DosisStore.evaluateReading(item.type, item.values, item.timing);
            const semaphore = evaluation.status;

            readingListHtml += `
                <div class="relative mb-4 group touch-pan-y select-none" id="reading-${item.id}">
                    <!-- Actions Background -->
                    <div class="absolute inset-x-0 inset-y-0 flex justify-end">
                        <!-- Edit Button (Shows first from Right) -->
                        <div class="w-20 bg-primary flex items-center justify-center cursor-pointer" onclick="editItem('${item.id}')">
                            <span class="material-symbols-outlined text-white text-2xl font-bold">edit</span>
                        </div>
                        <!-- Delete Button -->
                        <div class="w-20 bg-red-500 rounded-r-[2.5rem] flex items-center justify-center cursor-pointer" onclick="deleteItem('${item.id}')">
                            <span class="material-symbols-outlined text-white text-2xl font-bold">delete</span>
                        </div>
                    </div>
                    <div class="swipe-foreground relative bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-premium flex items-center gap-6 z-10 transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] cursor-grab active:cursor-grabbing"
                         style="transform: translateX(0px)"
                         ontouchstart="window.handleTouchStart(event, '${item.id}')"
                         ontouchmove="window.handleTouchMove(event, '${item.id}')"
                         ontouchend="window.handleTouchEnd(event, '${item.id}')"
                         onmousedown="window.handleMouseStart(event, '${item.id}')"
                         onmousemove="window.handleMouseMove(event, '${item.id}')"
                         onmouseup="window.handleMouseEnd(event, '${item.id}')"
                         onmouseleave="window.handleMouseEnd(event, '${item.id}')">
                        
                        <div class="size-14 rounded-2xl ${colors[semaphore]} flex items-center justify-center text-white shadow-lg shrink-0 pointer-events-none">
                            <span class="material-symbols-outlined !text-2xl">${icons[item.type]}</span>
                        </div>
                        
                        <div class="flex-1 min-w-0 pointer-events-none">
                            <p class="text-[9px] font-black uppercase text-gray-400 dark:text-slate-400 mb-1 tracking-widest">${config.label}</p>
                            <p class="text-2xl font-black tabular-nums tracking-tight leading-none text-gray-800 dark:text-slate-50">
                                ${valDisplay} 
                                <span class="text-[10px] font-bold opacity-30 dark:opacity-40 tracking-normal ml-1">${typeof config.unit === 'function' ? config.unit(item.values) : config.unit}</span>
                            </p>
                            <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mt-3 flex flex-wrap items-center gap-2">
                                <span>${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                ${config.sub(item.values) ? `<span>• ${config.sub(item.values)}</span>` : ''}
                            </p>
                            ${item.values.notes ? `
                                <div class="mt-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50 flex gap-2 items-start">
                                    <span class="material-symbols-outlined !text-sm text-primary">notes</span>
                                    <p class="text-[10px] font-medium text-gray-500 dark:text-slate-400 leading-tight">${item.values.notes}</p>
                                </div>
                            ` : ''}
                        </div>
                        <div class="size-10 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-300 dark:text-slate-700 pointer-events-none">
                             <span class="material-symbols-outlined text-sm">chevron_left</span>
                        </div>
                    </div>
                </div>
            `;
        });

        readingListHtml += `<div class="h-48 w-full"></div>`;
        mainEl.innerHTML = readingListHtml;
        updateHeader();
    };

    // --- SCAFFOLD ---
    el.innerHTML = `
        <header class="p-6 pb-4 sticky top-0 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-xl z-40 transition-all duration-300 border-b border-gray-100 dark:border-slate-800 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                    <span class="material-symbols-outlined">arrow_back</span>
                </button>
                <div class="flex items-center gap-2">
                    <span id="results-count" class="text-[9px] font-black px-2 py-1 bg-primary/10 text-primary rounded-full transition-all duration-500 opacity-0">0 reg</span>
                    <button id="btn-filter" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-700">
                        <span class="material-symbols-outlined">calendar_month</span>
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col mt-2">
                <h2 class="text-3xl font-black italic tracking-tighter transition-all dark:text-white">HISTORIAL</h2>
                <p id="header-date" class="text-[9px] font-black tracking-[0.3em] text-gray-400 dark:text-slate-500 mt-0.5 uppercase transition-all">REGISTRO COMPLETO</p>
            </div>
            <div id="filter-bar-content" class="mt-4 select-none"></div>
        </header>

        <main class="flex-1 px-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[50vh] pt-2"></main>

        <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-8 flex justify-between items-center z-50">
            <button id="nav-home" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                <span class="material-symbols-outlined !text-3xl">home</span>
                <span class="text-[9px] font-black uppercase tracking-widest">Inicio</span>
            </button>
            <button class="flex flex-col items-center gap-1 text-primary">
                <span class="material-symbols-outlined !text-3xl">calendar_month</span>
                <span class="text-[9px] font-black uppercase tracking-widest">Historial</span>
            </button>
            <button id="nav-trends" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                <span class="material-symbols-outlined !text-3xl">insights</span>
                <span class="text-[9px] font-black uppercase tracking-widest">Gráficas</span>
            </button>
            <button id="nav-profile" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                <span class="material-symbols-outlined !text-3xl">person</span>
                <span class="text-[9px] font-black uppercase tracking-widest">Perfil</span>
            </button>
        </nav>

        <footer class="fixed bottom-28 left-6 right-6 z-40">
            <button id="btn-pdf" class="w-full h-20 bg-primary text-white text-lg font-black rounded-3xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-95 transition-all">
                <span class="material-symbols-outlined !text-3xl">picture_as_pdf</span>
                GENERAR REPORTE MÉDICO
            </button>
        </footer>
    `;

    // Events
    el.querySelector('#btn-back').onclick = () => router.navigateTo('dashboard');
    el.querySelector('#nav-home').onclick = () => router.navigateTo('dashboard');
    el.querySelector('#nav-trends').onclick = () => router.navigateTo('trends');
    el.querySelector('#nav-profile').onclick = () => router.navigateTo('profile');
    el.querySelector('#btn-filter').onclick = () => {
        const modal = window.Pages.CalendarModal(currentDateFilter, (date) => { currentDateFilter = date; renderList(); }, () => { currentDateFilter = null; renderList(); });
        document.body.appendChild(modal);
    };
    el.querySelector('#btn-pdf').onclick = () => {
        const modal = window.Pages.ReportModal((options) => { window.PDFGenerator.generateAndDownload(options); }, () => { });
        document.body.appendChild(modal);
    };

    window.resetFilter = () => { currentDateFilter = null; selectedCategories.clear(); selectedStatuses.clear(); renderList(); };

    // Swipes
    let touchStartX = 0; let isDragging = false;
    window.handleTouchStart = (e, id) => { touchStartX = e.touches[0].clientX; checkAutoClose(id); };
    window.handleTouchMove = (e, id) => { applySwipe(e.currentTarget, e.touches[0].clientX); };
    window.handleTouchEnd = (e, id) => { finalizeSwipe(e.currentTarget, e.changedTouches[0].clientX, id); };
    window.handleMouseStart = (e, id) => { isDragging = true; touchStartX = e.clientX; checkAutoClose(id); };
    window.handleMouseMove = (e, id) => { if (!isDragging) return; e.preventDefault(); applySwipe(e.currentTarget, e.clientX); };
    window.handleMouseEnd = (e, id) => { if (!isDragging) return; isDragging = false; finalizeSwipe(e.currentTarget, e.clientX, id); };

    function checkAutoClose(id) { if (window.currentSwipedId && window.currentSwipedId !== id) { const el = document.querySelector(`#reading-${window.currentSwipedId} > .swipe-foreground`); if (el) el.style.transform = 'translateX(0)'; window.currentSwipedId = null; } }
    function applySwipe(el, currentX) { const diff = currentX - touchStartX; if (diff < 0 && diff > -180) el.style.transform = `translateX(${diff}px)`; }
    function finalizeSwipe(el, endX, id) { const diff = endX - touchStartX; if (diff < -80) { el.style.transform = 'translateX(-160px)'; window.currentSwipedId = id; } else { el.style.transform = 'translateX(0)'; if (window.currentSwipedId === id) window.currentSwipedId = null; } }
    window.deleteItem = (id) => { if (confirm('¿Eliminar registro?')) { window.DosisStore.deleteReading(id); renderList(); } else { const el = document.querySelector(`#reading-${id} > .swipe-foreground`); if (el) el.style.transform = 'translateX(0)'; window.currentSwipedId = null; } };
    window.editItem = (id) => {
        const reading = window.DosisStore.getReadingById(id);
        if (!reading) return;
        window.editingReadingId = id;

        const typeToHash = {
            pressure: 'form-pressure',
            glucose: 'form-glucose',
            oxygen_temp: 'form-oxygen',
            weight: 'form-weight',
            pain: 'form-pain',
            bristol: 'form-bristol'
        };

        router.navigateTo(typeToHash[reading.type]);
    };

    setTimeout(renderList, 50);
    return el;
};
