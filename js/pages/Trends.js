/**
 * Trends Component (Graphs)
 */
window.Pages = window.Pages || {};

window.Pages.TrendsView = (router) => {
    const el = document.createElement('div');
    el.className = 'flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 animate-up pb-40 transition-colors duration-300';

    const render = () => {
        el.innerHTML = `
            <header class="p-6 pb-4 sticky top-0 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-xl z-40 border-b border-gray-100 dark:border-slate-800">
                <div class="flex items-center gap-4">
                    <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">Tendencias</h2>
                </div>
            </header>

            <main class="flex-1 px-6 py-6 space-y-8">
                <!-- 1. Pressure Chart -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                            <span class="material-symbols-outlined">favorite</span>
                        </div>
                        <h3 class="font-black text-gray-800 dark:text-slate-100">Presión Arterial</h3>
                    </div>
                    <div class="relative h-64 w-full"><canvas id="chart-pressure"></canvas></div>
                </div>

                <!-- 2. Glucose Chart -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                            <span class="material-symbols-outlined">water_drop</span>
                        </div>
                        <h3 class="font-black text-gray-800 dark:text-slate-100">Glucosa</h3>
                    </div>
                    <div class="relative h-64 w-full"><canvas id="chart-glucose"></canvas></div>
                </div>

                <!-- 3. Oxygen SpO2 -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                            <span class="material-symbols-outlined">air</span>
                        </div>
                        <h3 class="font-black text-gray-800 dark:text-slate-100">Oxígeno (SpO2)</h3>
                    </div>
                    <div class="relative h-64 w-full"><canvas id="chart-oxygen"></canvas></div>
                </div>

                <!-- 4. Temperature -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                            <span class="material-symbols-outlined">thermostat</span>
                        </div>
                        <h3 class="font-black text-gray-800 dark:text-slate-100">Temperatura</h3>
                    </div>
                    <div class="relative h-64 w-full"><canvas id="chart-temp"></canvas></div>
                </div>

                <!-- 5. Weight Chart -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                            <span class="material-symbols-outlined">scale</span>
                        </div>
                        <h3 class="font-black text-gray-800 dark:text-slate-100">Peso</h3>
                    </div>
                    <div class="relative h-64 w-full"><canvas id="chart-weight"></canvas></div>
                </div>

                <!-- 6. Pain Scale -->
                <div class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-slate-700">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="size-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                            <span class="material-symbols-outlined">mood_bad</span>
                        </div>
                        <h3 class="font-black text-gray-800 dark:text-slate-100">Nivel de Dolor</h3>
                    </div>
                    <div class="relative h-64 w-full"><canvas id="chart-pain"></canvas></div>
                </div>
            </main>

            <!-- Navigation Bar -->
            <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-24 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-8 flex justify-between items-center z-50">
                <button id="nav-home" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                    <span class="material-symbols-outlined !text-3xl">home</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Inicio</span>
                </button>
                <button id="nav-history" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                    <span class="material-symbols-outlined !text-3xl">calendar_month</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Historial</span>
                </button>
                <button class="flex flex-col items-center gap-1 text-primary">
                    <span class="material-symbols-outlined !text-3xl">insights</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Gráficas</span>
                </button>
                <button id="nav-profile" class="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500 transition-colors">
                    <span class="material-symbols-outlined !text-3xl">person</span>
                    <span class="text-[9px] font-black uppercase tracking-widest">Perfil</span>
                </button>
            </nav>
        `;

        el.querySelector('#btn-back').onclick = () => router.navigateTo('dashboard');
        el.querySelector('#nav-home').onclick = () => router.navigateTo('dashboard');
        el.querySelector('#nav-history').onclick = () => router.navigateTo('history');
        el.querySelector('#nav-profile').onclick = () => router.navigateTo('profile');

        setTimeout(initAllCharts, 200);
    };

    const initAllCharts = () => {
        const readings = window.DosisStore.getReadings();
        const isDark = window.DosisStore.state.theme === 'dark';
        const textColor = isDark ? '#94a3b8' : '#64748b';
        const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: textColor, font: { size: 9, weight: 'bold' } }, grid: { display: false } },
                y: { ticks: { color: textColor, font: { size: 9, weight: 'bold' } }, grid: { color: gridColor } }
            },
            elements: { line: { tension: 0.4 }, point: { radius: 3, hoverRadius: 6 } }
        };

        const drawChart = (id, readingsArr, datasetLabel, dataKey, color, isValuesKey = true) => {
            const canvas = el.querySelector(`#${id}`);
            if (!canvas || readingsArr.length === 0) return;

            // Filter readings that HAVE the dataKey
            const filteredData = readingsArr.filter(r => isValuesKey ? (r.values[dataKey] !== null && r.values[dataKey] !== undefined) : (r[dataKey] !== null && r[dataKey] !== undefined));
            if (filteredData.length === 0) return;

            const data = filteredData.slice(-10).reverse(); // Last 10, chronological
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: data.map(r => new Date(r.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' })),
                    datasets: [{
                        label: datasetLabel,
                        data: data.map(r => isValuesKey ? r.values[dataKey] : r[dataKey]),
                        borderColor: color,
                        backgroundColor: color + '20',
                        fill: true
                    }]
                },
                options: baseOptions
            });
        };

        // 1. Pressure (Special case: 2 lines)
        const pData = readings.filter(r => r.type === 'pressure').slice(-10).reverse();
        if (pData.length > 0) {
            new Chart(el.querySelector('#chart-pressure'), {
                type: 'line',
                data: {
                    labels: pData.map(r => new Date(r.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' })),
                    datasets: [
                        { label: 'Sistólica', data: pData.map(r => r.values.systolic), borderColor: '#ef4444', backgroundColor: '#ef444410', fill: true },
                        { label: 'Diastólica', data: pData.map(r => r.values.diastolic), borderColor: '#3b82f6', backgroundColor: '#3b82f610', fill: true }
                    ]
                },
                options: baseOptions
            });
        }

        // 2. Glucose
        drawChart('chart-glucose', readings.filter(r => r.type === 'glucose'), 'Glucosa', 'value', '#f97316');

        // 3. Oxygen (SpO2)
        drawChart('chart-oxygen', readings.filter(r => r.type === 'oxygen_temp'), 'SpO2', 'spo2', '#3b82f6');

        // 4. Temp
        drawChart('chart-temp', readings.filter(r => r.type === 'oxygen_temp'), 'Temp', 'temp', '#06b6d4');

        // 5. Weight
        drawChart('chart-weight', readings.filter(r => r.type === 'weight'), 'Peso', 'weight', '#22c55e');

        // 6. Pain
        drawChart('chart-pain', readings.filter(r => r.type === 'pain'), 'Dolor', 'value', '#a855f7');
    };

    render();
    return el;
};
