# Plan de Implementación - Dosis Vital v2.0 (Arquitectura Final)

Este documento describe la arquitectura técnica y el estado final del proyecto "Dosis Vital v2.0". La aplicación ha sido consolidada como una herramienta de grado clínico, privada y de alto rendimiento.

## 🏗️ Arquitectura Técnica "Zero-Config"

La aplicación es una **SPA (Single Page Application)** construida con Vanilla JS, diseñada para funcionar sin dependencias de servidor (protocolo `file://`).

### Componentes Clave
*   **Gestión de Datos (`Store.js`)**: Sistema de persistencia local con soporte para múltiples tipos de mediciones, perfiles de usuario y preferencias de tema.
*   **Motor Visual (`Chart.js`)**: Visualización de tendencias médicas mediante 6 tipos de gráficas interactivas con soporte nativo para Modo Oscuro.
*   **Sistema de Identidad y Multi-Paciente**: Gestión de múltiples perfiles mediante iniciales dinámicas y paletas de colores personalizables.
*   **Notas Contextuales**: Persistencia de observaciones subjetivas vinculadas a cada registro médico.
*   **Biometría Flexible**: Lógica de guardado independiente para mediciones combinadas (Oxígeno/Temperatura).
*   **Exportación Clínica**: Generador de reportes PDF enriquecidos con observaciones del usuario.
*   **Internacionalización (i18n)**: Soporte completo para Español e Inglés en toda la interfaz y reportes.
*   **Seguimiento del Descanso**: Módulo de sueño con cálculo automático de duración, distinción entre siestas/sueño nocturno y registro de interrupciones.

## 🎨 Diseño y Experiencia de Usuario (UX)

1.  **Modo Oscuro de Alto Contraste**: Basado en la paleta `Slate` (Tailwind), optimizado para legibilidad médica.
2.  **Contexto Médico**: Campos de texto opcionales en formularios que permiten al usuario dar referencias adicionales (ej: "medición post-ejercicio").
3.  **Priorización Basada en la Recuperación**: El registro de sueño se posiciona como el primer indicador en la evaluación diaria, reconociendo el descanso como el pilar fundamental de la salud.
4.  **Navegación Intuitiva**: Implementación de una barra inferior (`Bottom Nav`) para acceso global.
5.  **Filtros Inteligentes**: Historial con capacidad de filtrado por categoría de medición y estado de salud (Normal/Atención/Alerta) mediante una rejilla compacta.

## 🛡️ Blindaje y Fiabilidad

*   **Validación Médica**: Implementación de rangos AHA para presión arterial y guías clínicas para glucosa.
*   **Sanitización Estricta**: Control total sobre la entrada de datos, bloqueando caracteres no válidos y asegurando la integridad de los registros.
*   **Integridad de Datos**: Sistema de limpieza automática de registros al eliminar perfiles para evitar datos huérfanos.
*   **Privacidad Absoluta**: Los datos residen exclusivamente en el dispositivo del usuario (`localStorage`).

## 🚀 Hoja de Ruta (Monetización y Crecimiento)

La arquitectura actual permite escalar hacia un producto comercial bajo el modelo **Freemium**:

1.  **Estrategia Premium ($4.99 Pago Único)**: 
    *   Desbloqueo de historial completo (más de 7 días).
    *   Generación ilimitada de reportes PDF profesionales.
    *   Modo Familiar (Multi-perfil ilimitado).
    *   Copia de seguridad y exportación de datos avanzada.
2.  **Compartición Nativa**: Implementación de la Native Share API para enviar reportes directamente vía WhatsApp, Correo o apps de mensajería con nombres de archivo amigables.
3.  **Sincronización de Salud (Integración de Ecosistema)**:
    *   **iOS**: Sincronización con Apple HealthKit.
    *   **Android**: Sincronización con Google Health Connect.
4.  **Seguridad Pro**: Protección de acceso mediante biometría (FaceID/Fingerprint) integrada en el flujo de la aplicación.
