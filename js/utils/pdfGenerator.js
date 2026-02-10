/**
 * PDF Generator Utility
 * Uses jsPDF and AutoTable to generate professional medical reports
 */

window.PDFGenerator = {
    generateAndDownload: async (options = { range: 'all', categories: [] }) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const profile = window.DosisStore.getActiveProfile();
        let readings = window.DosisStore.getReadings();

        // --- Filtering Logic ---
        if (options.categories && options.categories.length > 0) {
            readings = readings.filter(r => options.categories.includes(r.type));
        }
        if (options.range === 'custom' && options.customRange) {
            const start = new Date(options.customRange.start);
            start.setHours(0, 0, 0, 0);
            const end = new Date(options.customRange.end);
            end.setHours(23, 59, 59, 999);
            readings = readings.filter(r => {
                const rt = new Date(r.timestamp);
                return rt >= start && rt <= end;
            });
        } else if (options.range !== 'all') {
            const days = parseInt(options.range);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            readings = readings.filter(r => new Date(r.timestamp) >= cutoff);
        }

        if (readings.length === 0) {
            alert("No hay registros que coincidan con los filtros.");
            return;
        }

        // --- Stats Logic ---
        const stats = {};
        readings.forEach(r => {
            if (!stats[r.type]) stats[r.type] = { count: 0, sum: 0, min: 999999, max: -999999 };
            const s = stats[r.type];
            let val = 0;

            // Normalize values for stats
            if (r.type === 'pressure') val = r.values.systolic;
            else if (r.type === 'oxygen_temp') val = r.values.spo2; // Stats focus on Oxygen mainly
            else if (r.type === 'weight') val = r.values.weight;
            else if (r.type === 'glucose' || r.type === 'pain' || r.type === 'bristol') val = r.values.value;
            else if (r.type === 'sleep') val = parseFloat(r.values.duration);

            if (val !== 0 && val !== null && val !== undefined) {
                s.count++;
                s.sum += val;
                if (val < s.min) s.min = val;
                if (val > s.max) s.max = val;
            }
        });

        // --- DESIGN CONSTANTS ---
        const primaryColor = [19, 127, 236]; // Blue
        const darkText = [30, 41, 59];       // Slate 800
        const lightText = [100, 116, 139];   // Slate 500
        const accentLine = [226, 232, 240];  // Slate 200

        // --- HEADER ---
        // Brand
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(...primaryColor);
        doc.text("Dosis Vital", 15, 20);

        doc.setFontSize(8);
        doc.setTextColor(...lightText);
        doc.text("REGISTRO DE SALUD PERSONAL", 15, 25);

        // Date Right Aligned
        const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.setFontSize(10);
        doc.setTextColor(...darkText);
        doc.text(dateStr.toUpperCase(), 195, 20, { align: "right" });
        doc.text("REPORTE CONFIDENCIAL", 195, 25, { align: "right" });

        // Divider
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(15, 30, 195, 30);

        // --- PATIENT INFO BLOCK ---
        doc.setFillColor(248, 250, 252); // Very light gray bg
        doc.rect(15, 35, 180, 25, 'F');

        doc.setFontSize(9);
        doc.setTextColor(...lightText);
        doc.text("PACIENTE", 20, 42);
        doc.text("GENERADO EL", 100, 42);

        doc.setFontSize(12);
        doc.setTextColor(...darkText);
        doc.text(profile.name.toUpperCase(), 20, 50);
        doc.text(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 100, 50);

        let yPos = 70;

        // --- SUMMARY TABLE ---
        doc.setFontSize(14);
        doc.setTextColor(...darkText);
        doc.text("Resumen Ejecutivo", 15, yPos);
        yPos += 8;

        const summaryRows = Object.keys(stats).map(type => {
            const s = stats[type];
            if (s.count === 0) return null;

            let label = type.toUpperCase();
            let unit = "";
            let avg = (s.sum / s.count).toFixed(1);

            switch (type) {
                case 'pressure': label = "Presión Arterial (Sys)"; unit = "mmHg"; break;
                case 'glucose': label = "Glucosa"; unit = "mg/dL"; break;
                case 'weight': label = "Peso Corporal"; unit = "kg"; break;
                case 'oxygen_temp': label = "Oxígeno (SpO2)"; unit = "%"; avg = (s.sum / s.count).toFixed(0); break;
                case 'pain': label = "Nivel de Dolor"; unit = "/10"; break;
                case 'bristol': label = "Escala Bristol"; unit = ""; avg = (s.sum / s.count).toFixed(1); break;
                case 'sleep': label = "Promedio de Sueño"; unit = "hrs"; break;
            }

            const minStr = s.min === 999999 ? '-' : `${s.min} ${unit}`;
            const maxStr = s.max === -999999 ? '-' : `${s.max} ${unit}`;

            return [label, `${s.count} regs`, minStr, maxStr, `${avg} ${unit}`];
        }).filter(Boolean);

        if (summaryRows.length > 0) {
            doc.autoTable({
                head: [['Métrica', 'Cantidad', 'Mínimo', 'Máximo', 'Promedio']],
                body: summaryRows,
                startY: yPos,
                theme: 'plain',
                headStyles: { fillColor: [255, 255, 255], textColor: lightText, fontStyle: 'bold', fontSize: 8, halign: 'left', lineWidth: { bottom: 0.1 }, lineColor: accentLine },
                bodyStyles: { textColor: darkText, fontSize: 10, cellPadding: 4, lineWidth: { bottom: 0.1 }, lineColor: [241, 245, 249] },
                columnStyles: {
                    0: { fontStyle: 'bold' }, // Metric Name
                    4: { fillColor: [248, 250, 252], fontStyle: 'bold', textColor: primaryColor } // Summary Highlight
                },
                margin: { left: 15, right: 15 }
            });
            yPos = doc.lastAutoTable.finalY + 20; // More space after summary
        }

        // --- DETAILED RECORDS (GROUPED BY TYPE) ---
        doc.setFontSize(14);
        doc.setTextColor(...darkText);
        doc.text("Historial Detallado", 15, yPos);
        yPos += 10;

        // Define order of appearance
        const typeOrder = ['pressure', 'glucose', 'oxygen_temp', 'weight', 'pain', 'bristol', 'sleep'];

        typeOrder.forEach(type => {
            const typeReadings = readings.filter(r => r.type === type);

            if (typeReadings.length > 0) {
                // Section Title Variables
                let sectionTitle = "";
                let col1 = "VALOR";
                let col2 = "NOTAS";

                switch (type) {
                    case 'pressure': sectionTitle = "Presión Arterial"; col1 = "MEDICIÓN (mmHg)"; col2 = "PULSO / COMENTARIOS"; break;
                    case 'glucose': sectionTitle = "Glucosa"; col1 = "NIVEL (mg/dL)"; col2 = "MOMENTO (Ayunas/Post)"; break;
                    case 'oxygen_temp': sectionTitle = "Oxígeno y Temperatura"; col1 = "SpO2 / Temp"; col2 = "DETALLES"; break;
                    case 'weight': sectionTitle = "Control de Peso"; col1 = "PESO (kg)"; col2 = "IMC / ESTADO"; break;
                    case 'pain': sectionTitle = "Registro de Dolor"; col1 = "INTENSIDAD (0-10)"; col2 = "OBSERVACIONES"; break;
                    case 'bristol': sectionTitle = "Salud Intestinal (Bristol)"; col1 = "TIPO (1-7)"; col2 = "DESCRIPCIÓN"; break;
                    case 'sleep': sectionTitle = "Registro de Sueño"; col1 = "DURACIÓN (hrs)"; col2 = "CALIDAD / TIPO"; break;
                }

                // Check for page break space
                if (yPos > 240) {
                    doc.addPage();
                    yPos = 20;
                }

                // Draw Section Header Block
                doc.setFillColor(241, 245, 249); // Slate 100 Background
                doc.rect(15, yPos, 180, 8, 'F'); // Header Bar

                doc.setFillColor(...primaryColor);
                doc.rect(15, yPos, 2, 8, 'F'); // Accent Bar Left

                doc.setFontSize(10);
                doc.setTextColor(...darkText);
                doc.setFont("helvetica", "bold");
                doc.text(sectionTitle.toUpperCase(), 22, yPos + 5.5);

                yPos += 10; // Space below header

                // Prepare Rows
                const rows = typeReadings.map(r => {
                    const d = new Date(r.timestamp);
                    const day = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    let val = "";
                    let notes = "";

                    switch (type) {
                        case 'pressure': val = `${r.values.systolic}/${r.values.diastolic}`; notes = `${r.values.pulse} bpm`; break;
                        case 'glucose': val = `${r.values.value}`; notes = r.timing; break;
                        case 'oxygen_temp':
                            val = r.values.spo2 ? `${r.values.spo2}%` : '---';
                            notes = r.values.temp ? `${r.values.temp}°C` : '---';
                            break;
                        case 'weight': val = `${r.values.weight}`; notes = `IMC: ${r.values.bmi}`; break;
                        case 'pain': val = `${r.values.value}`; notes = "-"; break;
                        case 'bristol': val = `Tipo ${r.values.value}`; notes = "-"; break;
                        case 'sleep':
                            val = `${r.values.duration} hrs`;
                            const feelingLabelsEs = ["Muy Cansado", "Cansado", "Normal", "Descansado", "Excelente"];
                            notes = `${r.values.sleepType === 'nap' ? 'Siesta' : 'Sueño Nocturno'} | Calidad: ${feelingLabelsEs[r.values.feeling - 1]} | Interrup: ${r.values.interruptions}`;
                            break;
                    }

                    // Append user notes if present
                    if (r.values.notes) {
                        notes = notes && notes !== "-" ? `${notes} | OBS: ${r.values.notes}` : `OBS: ${r.values.notes}`;
                    }

                    return [`${day} - ${time}`, val, notes];
                });

                // Render Table
                doc.autoTable({
                    head: [['FECHA', col1, col2]],
                    body: rows,
                    startY: yPos,
                    theme: 'plain',
                    headStyles: {
                        fillColor: [255, 255, 255],
                        textColor: lightText,
                        fontStyle: 'bold',
                        fontSize: 8,
                        halign: 'left',
                        cellPadding: 3,
                        lineWidth: { bottom: 0.5 },
                        lineColor: accentLine
                    },
                    bodyStyles: {
                        textColor: darkText,
                        fontSize: 10,
                        cellPadding: 3,
                        lineWidth: { bottom: 0.1 },
                        lineColor: accentLine
                    },
                    margin: { left: 15, right: 15 },
                    // Handle page breaks specifically for autoTable
                    didDrawPage: (data) => {
                        // Don't reset yPos here, it's handled by finalY
                    }
                });

                yPos = doc.lastAutoTable.finalY + 15; // Space between tables
            }
        });

        // --- FOOTER ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
            doc.text('Generado por Dosis Vital', 15, 285);
        }

        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const nowFinal = new Date();
        const fileName = `Reporte_${profile.name.replace(/\s+/g, '_')}_${monthNames[nowFinal.getMonth()]}_${nowFinal.getFullYear()}.pdf`;

        doc.save(fileName);

        // Return for potential native sharing
        return {
            blob: doc.output('blob'),
            fileName: fileName
        };
    }
};
