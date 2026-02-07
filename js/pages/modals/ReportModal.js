/**
 * Report Filters Modal
 * Allows selection of Date Range and Data Types
 */
window.Pages = window.Pages || {};

window.Pages.ReportModal = (onConfirm, onCancel) => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-up bg-black/50 backdrop-blur-sm';

    el.innerHTML = `
        <div class="bg-white dark:bg-[#1a242d] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <!-- Header -->
            <div class="mb-6">
                <h3 class="text-2xl font-black italic tracking-tighter mb-2">Exportar Datos</h3>
                <p class="text-sm text-gray-500 font-bold">Configura tu reporte médico</p>
            </div>

            <!-- Date Range -->
            <div class="mb-6 space-y-3">
                <p class="text-xs font-black uppercase text-primary tracking-widest">Rango de Tiempo</p>
                <div class="grid grid-cols-3 gap-2">
                    <label>
                        <input type="radio" name="range" value="7" class="peer hidden" checked>
                        <div class="h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold peer-checked:bg-primary peer-checked:text-white transition-all cursor-pointer">
                            7 Días
                        </div>
                    </label>
                    <label>
                        <input type="radio" name="range" value="30" class="peer hidden">
                        <div class="h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold peer-checked:bg-primary peer-checked:text-white transition-all cursor-pointer">
                            30 Días
                        </div>
                    </label>
                    <label>
                        <input type="radio" name="range" value="all" class="peer hidden">
                        <div class="h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold peer-checked:bg-primary peer-checked:text-white transition-all cursor-pointer">
                            Todo
                        </div>
                    </label>
                </div>
            </div>

            <!-- Categories -->
            <div class="mb-8 space-y-3">
                <p class="text-xs font-black uppercase text-primary tracking-widest">Incluir</p>
                <div class="grid grid-cols-2 gap-3" id="cat-grid">
                    <!-- Injected via JS -->
                </div>
            </div>

            <!-- Actions -->
            <button id="btn-export" class="w-full h-16 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3">
                <span class="material-symbols-outlined">picture_as_pdf</span>
                GENERAR PDF
            </button>
            <button id="btn-cancel" class="w-full h-12 text-gray-400 font-bold text-sm tracking-wide">
                CANCELAR
            </button>
        </div>
    `;

    // Populate Categories
    const categories = [
        { id: 'pressure', label: 'Presión' },
        { id: 'glucose', label: 'Glucosa' },
        { id: 'oxygen_temp', label: 'Oxígeno' },
        { id: 'weight', label: 'Peso' },
        { id: 'pain', label: 'Dolor' },
        { id: 'bristol', label: 'Digestivo' }
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

    // Events
    el.querySelector('#btn-cancel').onclick = () => {
        el.remove();
        onCancel();
    };

    el.querySelector('#btn-export').onclick = () => {
        const range = el.querySelector('input[name="range"]:checked').value;
        const selectedCats = Array.from(el.querySelectorAll('input[name="cats"]:checked')).map(cb => cb.value);

        if (selectedCats.length === 0) {
            alert("Selecciona al menos una categoría");
            return;
        }

        onConfirm({ range, categories: selectedCats });
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
