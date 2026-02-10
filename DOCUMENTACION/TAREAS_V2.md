# Lista de Tareas - Dosis Vital Rebuild

Estado actual del desarrollo de la versión 2.0. 😊

## ✅ Fase 1: Cimientos (Completado)
- [x] Arquitectura SPA nativa (ESM-less).
- [x] Gestión de estado global (`Store.js`).
- [x] Enrutador y Navegación fluida.

## ✅ Fase 2: Módulos Clínicos (Completado)
- [x] **Presión Arterial**: Validación AHA + Sanitización Inputs.
- [x] **Glucosa**: Modos Ayunas/Post + Límite 3 dígitos.
- [x] **Oxígeno/Temp**: SpO2 enteros, Temp decimales.
- [x] **Peso/IMC**: Calculadora auto-generada + Diagnóstico.

## ✅ Fase 3: Módulos de Bienestar (Completado)
- [x] **Escala de Dolor**: Slider visual con feedback de emojis.
- [x] **Escala Bristol**: Selector de tipos (1-7) para salud intestinal.
- [x] **Integración Dashboard**: Acceso rápido a todos los módulos.

## ✅ Fase 4: Experiencia de Usuario Pro (Completado)
- [x] **Modo Oscuro**: Implementación nativa con contraste optimizado (Slate 900).
- [x] **Filtros Avanzados**: Sistema de Grid para medidores y filtros por Semáforo.
- [x] **Navegación Unificada**: Barra inferior (Bottom Nav) presente en toda la app.
- [x] **Interacciones**: Swipe-to-edit & Swipe-to-delete (Gestión de registros).

## ✅ Fase 5: Reportes y Visualización (Completado)
- [x] **Tendencias (Insights)**: 6 Gráficas interactivas con `Chart.js`.
- [x] **Perfil Institucional**: Sistema de identidad basado en iniciales.
- [x] **Notas Contextuales**: Campo de observaciones opcional en todos los formularios.
- [x] **Flexibilidad Biométrica**: Registro independiente de Oxígeno o Temperatura.

## ✅ Fase 6: Expansión y Seguridad (Completado)
- [x] **Gestión de Datos**: Exportación e Importación de copias de seguridad (JSON).
- [x] **Configuración Avanzada**: Idioma, Unidades y Seguridad por PIN.
- [x] **Multi-Paciente**: Soporte para gestionar varios perfiles desde un mismo dispositivo.
- [x] **Limpieza Automática**: Borrado de registros vinculados al eliminar perfiles.

## ✅ Fase 7: Bienestar y Recuperación (Completado)
- [x] **Registro de Sueño**: Soporte para Sueño Nocturno y Siestas.
- [x] **Cálculo de Duración**: Algoritmo automático de horas de descanso (trans-medianoche).
- [x] **Indicadores de Calidad**: Escala de sentimiento visual (emojis).
- [x] **Priorización**: Reordenamiento del Dashboard para situar el sueño en primer lugar.
- [x] **Insights de Sueño**: Integración en Resumen Semanal y Reportes PDF.

## 🚧 Fase 8: Monetización y Distribución (Próximamente)
- [ ] **Estructura Freemium**: Implementación del flag `isPremium` y vistas restringidas.
- [ ] **Muro de Pago (Paywall)**: Pantalla de venta destacando beneficios del pago único ($4.99).
- [ ] **Restricción de Historial**: Limitación a 7 días para usuarios gratuitos.
- [ ] **Compartición Nativa**: Integración con "Native Share API" para WhatsApp y Redes.
- [ ] **Nombres Amigables**: Renombrado automático de archivos PDF para fácil identificación.

## 🚀 Fase 9: Ecosistema y Salud Digital (Largo Plazo)
- [ ] **Sincronización Nativa**: Integración con Apple Health y Google Health Connect.
- [ ] **Metas de Salud**: Establecimiento de objetivos y seguimiento de progreso.
- [ ] **Recordatorios Inteligentes**: Notificaciones locales para medicación y mediciones.
- [ ] **Seguridad Biométrica**: FaceID y Huella dactilar para bloqueo de app.
