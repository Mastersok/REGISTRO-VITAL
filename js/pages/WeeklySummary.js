/**
 * Weekly Health Summary Component
 * Displays a visual summary of health trends for the past 7 days
 */
window.Pages = window.Pages || {};

window.Pages.WeeklySummary = (router) => {
    const el = document.createElement('div');
    el.className = 'p-6 pb-32 animate-up min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300';

    const t = (key) => window.DosisStore.t(key);
    const store = window.DosisStore;
    const readings = store.getReadings();

    // Calcular fecha de hace 7 días
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filtrar lecturas de la última semana
    const weekReadings = readings.filter(r => new Date(r.timestamp) >= sevenDaysAgo);

    // Analizar por tipo de medición
    const analyzeType = (type) => {
        const typeReadings = weekReadings.filter(r => r.type === type);
        if (typeReadings.length === 0) return null;

        const statuses = typeReadings.map(r => {
            const eval_result = store.evaluateReading(r.type, r.values, r.timing);
            return eval_result.status;
        });

        const normalCount = statuses.filter(s => s === 'normal').length;
        const warningCount = statuses.filter(s => s === 'warning').length;
        const cautionCount = statuses.filter(s => s === 'caution').length;
        const dangerCount = statuses.filter(s => s === 'danger').length;
        const total = statuses.length;

        const normalPercent = Math.round((normalCount / total) * 100);
        const warningPercent = Math.round((warningCount / total) * 100);
        const cautionPercent = Math.round((cautionCount / total) * 100);
        const dangerPercent = Math.round((dangerCount / total) * 100);

        return {
            count: total,
            normalCount,
            warningCount,
            cautionCount,
            dangerCount,
            normalPercent,
            warningPercent,
            cautionPercent,
            dangerPercent,
            overallStatus: dangerCount > 0 ? 'danger' : cautionCount > 0 ? 'caution' : warningCount > 0 ? 'warning' : 'normal'
        };
    };

    const measurements = [
        { id: 'pressure', label: t('pressure_short'), icon: 'favorite', color: 'red' },
        { id: 'glucose', label: t('glucose'), icon: 'bloodtype', color: 'orange' },
        { id: 'oxygen_temp', label: t('bio_health_short'), icon: 'thermostat', color: 'blue' },
        { id: 'weight', label: t('weight_short'), icon: 'monitor_weight', color: 'green' },
        { id: 'pain', label: t('pain_short'), icon: 'sentiment_dissatisfied', color: 'purple' },
        { id: 'bristol', label: t('bristol_short'), icon: 'water_drop', color: 'amber' }
    ];

    const statusColors = {
        normal: 'bg-green-500',
        warning: 'bg-amber-500',
        caution: 'bg-orange-500',
        danger: 'bg-red-500'
    };

    const statusIcons = {
        normal: 'check_circle',
        warning: 'warning',
        caution: 'priority_high',
        danger: 'error'
    };

    el.innerHTML = `
        <header class="flex items-center gap-4 mb-8">
            <button id="btn-back" class="size-12 bg-white dark:bg-slate-800 shadow-premium rounded-xl flex items-center justify-center active:scale-95 transition-all text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
                <h2 class="text-2xl font-black text-gray-800 dark:text-slate-50 uppercase italic tracking-tighter">${t('weekly_summary') || 'RESUMEN SEMANAL'}</h2>
                <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">${t('last_7_days') || 'ÚLTIMOS 7 DÍAS'}</p>
            </div>
        </header>

        ${weekReadings.length === 0 ? `
            <div class="flex flex-col items-center justify-center py-20 opacity-50">
                <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-700 mb-4">insights_off</span>
                <p class="text-lg font-bold text-gray-400 dark:text-slate-600">${t('no_data_this_week') || 'Sin datos esta semana'}</p>
            </div>
        ` : `
            <!-- Overall Summary Card -->
            <div class="bg-gradient-to-br from-primary to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 mb-8">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-1">${t('total_measurements') || 'MEDICIONES TOTALES'}</p>
                        <h3 class="text-6xl font-black">${weekReadings.length}</h3>
                    </div>
                    <span class="material-symbols-outlined !text-6xl opacity-30">insights</span>
                </div>
                <p class="text-blue-100/70 text-sm font-medium">${t('weekly_summary_desc') || 'Análisis de tus registros de los últimos 7 días'}</p>
            </div>

            <!-- Measurement Analysis -->
            <div class="space-y-4">
                ${measurements.map(measurement => {
        const analysis = analyzeType(measurement.id);
        if (!analysis) return '';

        return `
                        <div class="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-premium border border-gray-100 dark:border-slate-700">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="size-12 bg-${measurement.color}-500 rounded-xl flex items-center justify-center text-white shrink-0">
                                    <span class="material-symbols-outlined !text-2xl">${measurement.icon}</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-black text-lg text-gray-800 dark:text-slate-50">${measurement.label}</h4>
                                    <p class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">${analysis.count} ${t('records') || 'registros'}</p>
                                </div>
                                <div class="size-10 ${statusColors[analysis.overallStatus]} rounded-full flex items-center justify-center text-white">
                                    <span class="material-symbols-outlined !text-xl">${statusIcons[analysis.overallStatus]}</span>
                                </div>
                            </div>

                            <!-- Progress Bars -->
                            <div class="space-y-2">
                                ${analysis.normalPercent > 0 ? `
                                    <div class="flex items-center gap-3">
                                        <span class="text-[10px] font-black text-green-600 dark:text-green-400 uppercase w-16">${t('status_normal')}</span>
                                        <div class="flex-1 h-2 bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                            <div class="h-full bg-green-500 rounded-full transition-all" style="width: ${analysis.normalPercent}%"></div>
                                        </div>
                                        <span class="text-xs font-black text-gray-600 dark:text-slate-400 w-10 text-right">${analysis.normalPercent}%</span>
                                    </div>
                                ` : ''}
                                ${analysis.warningPercent > 0 ? `
                                    <div class="flex items-center gap-3">
                                        <span class="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase w-16">${t('status_warning')}</span>
                                        <div class="flex-1 h-2 bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                            <div class="h-full bg-amber-500 rounded-full transition-all" style="width: ${analysis.warningPercent}%"></div>
                                        </div>
                                        <span class="text-xs font-black text-gray-600 dark:text-slate-400 w-10 text-right">${analysis.warningPercent}%</span>
                                    </div>
                                ` : ''}
                                ${analysis.cautionPercent > 0 ? `
                                    <div class="flex items-center gap-3">
                                        <span class="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase w-16">${t('status_caution')}</span>
                                        <div class="flex-1 h-2 bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                            <div class="h-full bg-orange-500 rounded-full transition-all" style="width: ${analysis.cautionPercent}%"></div>
                                        </div>
                                        <span class="text-xs font-black text-gray-600 dark:text-slate-400 w-10 text-right">${analysis.cautionPercent}%</span>
                                    </div>
                                ` : ''}
                                ${analysis.dangerPercent > 0 ? `
                                    <div class="flex items-center gap-3">
                                        <span class="text-[10px] font-black text-red-600 dark:text-red-400 uppercase w-16">${t('status_danger')}</span>
                                        <div class="flex-1 h-2 bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                            <div class="h-full bg-red-500 rounded-full transition-all" style="width: ${analysis.dangerPercent}%"></div>
                                        </div>
                                        <span class="text-xs font-black text-gray-600 dark:text-slate-400 w-10 text-right">${analysis.dangerPercent}%</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        `}
    `;

    el.querySelector('#btn-back').onclick = () => router.navigateTo('dashboard');

    return el;
};
