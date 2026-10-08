# Droppi Dashboard

Dashboard administrativo para la gestión operativa de Droppi: lockers inteligentes, entregas, órdenes, clientes, propiedades, unidades, tickets, transportistas, analíticas, finanzas, publicidad y configuración del sistema.

Este proyecto está construido con **React**, **Vite**, **TypeScript**, **Tailwind CSS** y **shadcn/ui**. Su objetivo es centralizar la operación diaria de módulos OLC/TMS/Locker desde una interfaz moderna, modular y preparada para escalar.

---

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Módulos principales](#módulos-principales)
- [Arquitectura frontend](#arquitectura-frontend)
- [Convenciones de desarrollo](#convenciones-de-desarrollo)
- [Recomendaciones antes de producción](#recomendaciones-antes-de-producción)
- [Roadmap sugerido](#roadmap-sugerido)

---

## Descripción general

**Droppi Dashboard** es una aplicación web administrativa diseñada para controlar y monitorear procesos relacionados con logística, lockers inteligentes y servicios asociados.

El sistema permite consultar información operativa, visualizar métricas, gestionar entidades principales y dar seguimiento a operaciones críticas como órdenes, entregas, tickets, transportistas, clientes, unidades, propiedades y lockers.

---

## Características principales

- Autenticación de usuarios.
- Layout administrativo con navegación lateral.
- Soporte de idioma mediante contexto de traducciones.
- Gestión de órdenes y detalle de órdenes.
- Gestión y detalle de lockers.
- Builder/wizard para módulos de lockers.
- Gestión de clientes.
- Gestión de empresas.
- Gestión de propiedades y unidades.
- Gestión de usuarios.
- Gestión de tickets generales y tickets OLC.
- Módulo de finanzas.
- Módulo de analíticas con gráficas y KPIs.
- Módulo de publicidad y contenidos.
- Módulo de transportistas/carriers.
- Configuración de cuenta, apariencia, preferencias y propiedad.
- Componentes reutilizables para tablas, filtros, tarjetas, formularios y modales.
- Exportación de información mediante utilidades como XLSX/CSV.
- Integración con mapas mediante Google Maps.
- Preparado para integraciones con Stripe y Supabase.

---

## Stack tecnológico

### Frontend

- **React 18**
- **TypeScript**
- **Vite**
- **React Router DOM**
- **Tailwind CSS**
- **shadcn/ui**
- **Radix UI**
- **Lucide React**
- **Recharts**
- **React Hook Form**
- **Zod**
- **TanStack React Query**
- **Axios**
- **Sonner**
- **date-fns**

### Integraciones y utilidades

- **Google Maps**
- **Stripe**
- **Supabase**
- **XLSX**
- **PapaParse**
- **CryptoJS**

### Herramientas de desarrollo

- **ESLint**
- **TypeScript ESLint**
- **Vite React SWC**
- **PostCSS**
- **Autoprefixer**

---

## Estructura del proyecto

```txt
src/
  api/
    authInterceptor.ts
    axiosClient.ts
    fetchClient.ts
    handleResponse.ts

  assets/
    logos
    images
    service assets

  components/
    advertising/
    analytics/
    builder/
    carriers/
    chat/
    clients/
    dashboard/
    finance/
    layout/
    locker-detail/
    locker-wizard/
    module-builder/
    order-detail/
    Orders/
    property/
    settings/
    ticket-details/
    tickets/
    ui/

  contexts/
    AuthContext.tsx
    LanguageContext.tsx
    ModelContext.tsx

  hooks/
    useAdvertising.ts
    useAnalytics.ts
    useCarriers.tsx
    useConversations.ts
    useFinanceFilters.ts
    useLocalStorageState.ts
    useOfferings.ts
    useOLCTickets.ts
    usePasswordValidation.ts
    useProperties.ts
    useTableFilters.tsx
    useTheme.tsx
    useTickets.ts
    useTransactions.tsx

  i18n/
    en.ts
    es.ts
    index.ts

  pages/
    Login.tsx
    Home.tsx
    Orders
    OrderDetails
    Lockers
    LockerDetails
    Clients
    Company
    Property
    Units
    Users
    Tickets
    TicketsOLC
    Finance
    Analytics
    Advertising
    Settings
    Notifications
    Help

  router/
    PrivateRoute.tsx

  services/
    account.service.ts
    auth.service.ts
    client.service.ts
    company.service.ts
    googleMaps.service.ts
    locker.service.ts
    notification.service.ts
    orders.service.ts
    payments.service.ts
    properties.service.ts
    stripe.service.ts
    transporter.service.ts
    units.service.ts
    users.service.ts

  types/
    advertising.types.ts
    Analytics.types.ts
    finance.types.ts
    Locker.types.ts
    olc-tickets.types.ts
    orderDetail.ts
    ServiceTransaction.types.ts
    settings.types.ts
    ticket.types.ts

  utils/
```

---

## Requisitos previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js 18+** recomendado.
- **npm**.
- Acceso a las variables de entorno necesarias para consumir APIs externas o internas.

> Recomendación: usar `npm` como package manager principal, ya que el proyecto incluye `package-lock.json`.

---

## Instalación

Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entra al directorio del proyecto:

```bash
cd <NOMBRE_DEL_PROYECTO>
```

Instala dependencias:

```bash
npm install
```

Inicia el entorno de desarrollo:

```bash
npm run dev
```

Abre la URL local que indique Vite, normalmente:

```txt
http://localhost:5173
```

---

## Variables de entorno

El proyecto debe usar un archivo `.env` local para configurar endpoints y claves públicas necesarias.

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Ejemplo sugerido de `.env.example`:

```env
# API principal
VITE_API_BASE_URL=http://localhost:3050/api/v1

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Importante: nunca subas `.env` real al repositorio. Solo debe subirse `.env.example`.

---

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Genera el build de producción.

```bash
npm run build:dev
```

Genera un build usando modo de desarrollo.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

```bash
npm run preview
```

Previsualiza localmente el build generado.

---

## Módulos principales

### Autenticación

Incluye flujo de login, recuperación de contraseña, contexto de autenticación y rutas protegidas.

Archivos relacionados:

```txt
src/pages/Login.tsx
src/pages/ForgotPassword.tsx
src/contexts/AuthContext.tsx
src/components/layout/ProtectedRoute.tsx
src/router/PrivateRoute.tsx
src/services/auth.service.ts
```

---

### Dashboard / Home

Pantalla principal para visualizar información general, métricas y acceso a módulos operativos.

```txt
src/pages/Home.tsx
src/components/dashboard/
```

---

### Órdenes

Gestión y visualización de órdenes, métricas, filtros, tablas y detalle completo de cada operación.

```txt
src/pages/OrderDetails.tsx
src/components/Orders/
src/components/order-detail/
src/services/orders.service.ts
src/services/orderDetail.service.ts
```

---

### Lockers

Gestión de lockers, detalle operativo, métricas de uso, ubicación, puertas, utilización en tiempo real y tickets de mantenimiento.

```txt
src/pages/Lockers.tsx
src/pages/LockerDetails.tsx
src/pages/LockerAdd.tsx
src/components/locker-detail/
src/components/locker-wizard/
src/components/module-builder/
src/services/locker.service.ts
src/services/locker-detail.service.ts
```

---

### Clientes

Administración de clientes, tablas, modales de alta/edición/eliminación, carga masiva y detalle.

```txt
src/pages/Clients.tsx
src/pages/ClientDetails.tsx
src/components/clients/
src/services/client.service.ts
src/services/admin-client.service.ts
```

---

### Empresas

Gestión de empresas y detalle de información asociada.

```txt
src/pages/Company.tsx
src/pages/AddCompanyPage.tsx
src/pages/CompanyDetail.tsx
src/services/company.service.ts
```

---

### Propiedades y unidades

Administración de propiedades, residentes, unidades, paquetes y configuración operativa por propiedad.

```txt
src/pages/Property.tsx
src/pages/PropertyDetailPage.tsx
src/pages/AddPropertyPage.tsx
src/pages/Units.tsx
src/pages/UnitDetails.tsx
src/pages/ResidentsPropertyPage.tsx
src/pages/PackagePropertyPage.tsx
src/services/properties.service.ts
src/services/units.service.ts
src/services/units-property.service.ts
```

---

### Usuarios

Administración de usuarios, permisos, módulos y datos relacionados con cuentas internas.

```txt
src/pages/Users.tsx
src/services/users.service.ts
```

---

### Tickets y soporte

Gestión de tickets, detalle, mensajes, respuestas, filtros y tickets OLC.

```txt
src/pages/Tickets.tsx
src/pages/TicketDetails.tsx
src/pages/TicketsOLC.tsx
src/pages/TicketsOLCDetail.tsx
src/components/tickets/
src/components/ticket-details/
src/services/support.service.ts
src/services/olc-tickets.service.ts
```

---

### Finanzas

Visualización de KPIs financieros, tablas, filtros y gráficas.

```txt
src/pages/Finance.tsx
src/components/finance/
src/types/finance.types.ts
```

---

### Analíticas

Métricas operativas, desempeño, anomalías, distribución, funnel, heatmap, SLA y gráficos.

```txt
src/pages/Analytics.tsx
src/components/analytics/
src/hooks/useAnalytics.ts
src/types/Analytics.types.ts
```

---

### Publicidad

Gestión de contenidos publicitarios, slots, biblioteca de contenidos, ads pendientes y selección de outlets.

```txt
src/pages/Advertising.tsx
src/components/advertising/
src/hooks/useAdvertising.ts
src/types/advertising.types.ts
```

---

### Transportistas / Carriers

Administración de transportistas, métricas, formularios y tablas.

```txt
src/pages/Carriers.tsx
src/components/carriers/
src/hooks/useCarriers.tsx
src/services/transporter.service.ts
src/services/courier.service.ts
```

---

### Configuración

Configuración de cuenta, apariencia, contraseña, preferencias y propiedad.

```txt
src/pages/Settings.tsx
src/components/settings/
src/types/settings.types.ts
```

---

## Arquitectura frontend

El proyecto sigue una arquitectura modular orientada a páginas, componentes, servicios y hooks:

- **pages/**: pantallas principales conectadas a rutas.
- **components/**: componentes visuales reutilizables o específicos de módulo.
- **components/ui/**: componentes base del sistema de diseño.
- **services/**: capa de comunicación con APIs.
- **api/**: clientes HTTP, interceptores y helpers de respuesta.
- **contexts/**: estado global de autenticación, idioma y modelo.
- **hooks/**: lógica reutilizable por módulo.
- **types/**: contratos TypeScript.
- **i18n/**: textos e internacionalización.
- **assets/**: recursos visuales.

---

## Convenciones de desarrollo

### Componentes

Usar PascalCase:

```txt
OrderDetails.tsx
FinanceKpis.tsx
CreateTicketDialog.tsx
```

### Hooks

Usar prefijo `use`:

```txt
useTickets.ts
useProperties.ts
useAnalytics.ts
```

### Servicios

Usar sufijo `.service.ts`:

```txt
users.service.ts
locker.service.ts
orders.service.ts
```

### Tipos

Usar sufijo `.types.ts` cuando aplique:

```txt
finance.types.ts
ticket.types.ts
settings.types.ts
```

### Imports

El proyecto usa alias:

```ts
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

---

## Recomendaciones antes de producción

Antes de considerar este proyecto listo para producción, se recomienda completar los siguientes puntos:

### Seguridad

- No subir archivos `.env` reales.
- Crear y mantener `.env.example`.
- Revisar exposición de tokens o claves públicas.
- Validar permisos también en backend.
- Evitar depender únicamente del sidebar para controlar accesos.
- Agregar protección de rutas por permisos/módulos.

### Calidad de código

- Reducir uso de `any`.
- Crear interfaces para respuestas principales del backend.
- Unificar cliente HTTP si existen múltiples clientes activos.
- Estandarizar manejo de errores API.
- Eliminar `console.log` de producción.
- Activar reglas ESLint más estrictas gradualmente.

### TypeScript

Actualmente el proyecto permite configuraciones flexibles. Para endurecerlo gradualmente:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

Se recomienda activar estas reglas de forma progresiva por módulo.

### Testing

Agregar pruebas con:

- **Vitest**
- **React Testing Library**
- **Playwright** o **Cypress**

Casos prioritarios:

- Login.
- Rutas protegidas.
- Sidebar dinámico.
- Tablas genéricas.
- Formularios críticos.
- Servicios API.
- Permisos por módulo.
- Cambio de idioma.

### Producción

- Agregar pipeline CI/CD.
- Ejecutar `npm run lint` antes de merge.
- Ejecutar `npm run build` antes de deploy.
- Agregar Error Boundary.
- Agregar monitoreo de errores con Sentry u otra herramienta.
- Documentar ambiente de staging y producción.

---

## Roadmap sugerido

### Fase 1 — Limpieza técnica

- [ ] Crear `.env.example`.
- [ ] Eliminar `.env` del repositorio.
- [ ] Elegir un solo package manager.
- [ ] Limpiar `console.log`.
- [ ] Unificar cliente HTTP.
- [ ] Revisar configuración de ESLint.
- [ ] Mejorar tipado de módulos críticos.

### Fase 2 — Robustez funcional

- [ ] Implementar paginación real desde backend.
- [ ] Agregar permisos por ruta.
- [ ] Mejorar manejo global de errores.
- [ ] Agregar estados consistentes de loading/error/empty.
- [ ] Validar formularios con Zod o schemas equivalentes.
- [ ] Revisar flujos de autenticación y expiración de sesión.

### Fase 3 — Producción

- [ ] Agregar pruebas unitarias.
- [ ] Agregar pruebas E2E.
- [ ] Configurar CI/CD.
- [ ] Agregar monitoreo de errores.
- [ ] Optimizar build.
- [ ] Documentar despliegue.
- [ ] Crear capturas o demo para GitHub.

---

## Estado del proyecto

Estado actual sugerido:

```txt
MVP avanzado / dashboard funcional en desarrollo
```

El proyecto cuenta con una base visual y modular sólida, pero todavía requiere endurecimiento técnico para considerarse listo para producción empresarial.

---

## Autor

Proyecto desarrollado para Droppi.

---

## Licencia

Este proyecto es privado. Definir licencia según las necesidades del equipo o empresa.
