export const orders: Record<string, string> = {
  // =====================================================
  // Orders
  // =====================================================
  "orders.title": "Paquetes",
  "orders.subtitle": "Gestiona y rastrea todos los paquetes",
  "orders.metrics": "Métricas de paquetes",
  "orders.totalUsage": "Uso total",
  "orders.avgUsagePerHour": "Uso medio por hora",
  "orders.peakHour": "Horario de mayor uso",
  "orders.searchPlaceholder": "Buscar paquetes...",
  "orders.noResults":
    "No se encontraron paquetes con los filtros seleccionados",

  "orders.metrics.totalDeliveries": "Entregas totales",
  "orders.metrics.avgPerHour": "Promedio por hora",
  "orders.metrics.peakHour": "Hora pico",

  "orders.exportFilename": "paquetes",

  // =====================================================
  // Orders tabs
  // =====================================================
  "orders.tabs.packages": "Paquetes",
  "orders.tabs.pendingValidation": "Paquetes por verificar",


  // =====================================================
  // Package status tabs
  // =====================================================
  "orders.statusTabs.all": "Todas",
  "orders.statusTabs.inProgress": "En proceso",
  "orders.statusTabs.expired": "Expiradas",
  "orders.statusTabs.scheduled": "Agendadas",
  "orders.statusTabs.completed": "Completadas",
  "orders.statusTabs.canceled": "Canceladas",
  "orders.statusTabs.failure": "Fallas",
  // =====================================================
  // Package validation list
  // =====================================================
  "orders.validation.title": "Paquetes por verificar",
  "orders.validation.subtitle":
    "Revisa los paquetes que no pudieron asignarse automáticamente o que requieren confirmación.",

  "orders.validation.searchPlaceholder":
    "Buscar por tracking, destinatario, locker o paquete...",

  "orders.validation.review": "Revisar",
  "orders.validation.retry": "Reintentar",

  "orders.validation.empty":
    "No se encontraron paquetes pendientes de verificación.",

  "orders.validation.results": "Resultados",

  "orders.validation.loadError":
    "No fue posible cargar los paquetes por verificar",

  "orders.validation.lockerNumber": "Locker #{id}",
  "orders.validation.doorUnknown": "Puerta no identificada",

  // =====================================================
  // Missing detected values
  // =====================================================
  "orders.validation.missing.tracking":
    "Tracking no identificado",

  "orders.validation.missing.recipient":
    "Destinatario no identificado",

  "orders.validation.missing.carrier":
    "Paquetería no identificada",

  // =====================================================
  // Package validation statuses
  // =====================================================
  "orders.validation.status.all": "Todos los estados",

  "orders.validation.status.UNASSIGNED":
    "Sin asignar",

  "orders.validation.status.REVIEW":
    "Por confirmar",

  "orders.validation.status.ASSIGNED":
    "Asignado",

  "orders.validation.status.IMAGE_ISSUE":
    "Problema con la imagen",

  // =====================================================
  // Package validation table
  // =====================================================
  "orders.validation.table.tracking": "Tracking",
  "orders.validation.table.recipient": "Destinatario",
  "orders.validation.table.carrier": "Paquetería",
  "orders.validation.table.locker": "Locker",
  "orders.validation.table.receivedAt": "Fecha de recepción",
  "orders.validation.table.status": "Estatus",
  "orders.validation.table.actions": "Acciones",

  // =====================================================
  // Package validation details
  // =====================================================
  "orders.validation.details.title":
    "Validar paquete",

  "orders.validation.details.back":
    "Volver a paquetes por verificar",

  "orders.validation.details.loading":
    "Cargando información del paquete...",

  "orders.validation.details.notFound":
    "Paquete no encontrado",

  "orders.validation.details.notFoundDescription":
    "El paquete solicitado no existe o ya no está disponible.",

  "orders.validation.details.invalidResponse":
    "El servidor devolvió una respuesta no válida.",

  "orders.validation.details.loadError":
    "No fue posible cargar la información del paquete.",

  "orders.validation.details.saveError":
    "No fue posible guardar la validación del paquete.",

  "orders.validation.details.cachedDataWarning":
    "No fue posible actualizar la información. Se muestran los últimos datos disponibles.",

  "orders.validation.details.packageNumber":
    "Paquete #{id}",

  // =====================================================
  // Validation status banners
  // =====================================================
  "orders.validation.details.banner.UNASSIGNED.title":
    "Paquete sin asignar",

  "orders.validation.details.banner.UNASSIGNED.description":
    "El sistema no encontró un destinatario con suficiente coincidencia. Selecciona manualmente al usuario correcto.",

  "orders.validation.details.banner.REVIEW.title":
    "Asignación por confirmar",

  "orders.validation.details.banner.REVIEW.description":
    "El sistema asignó este paquete a un usuario, pero la asignación requiere confirmación del operador.",

  "orders.validation.details.banner.IMAGE_ISSUE.title":
    "Problema con la imagen",

  "orders.validation.details.banner.IMAGE_ISSUE.description":
    "La imagen no pudo analizarse correctamente. Revisa la evidencia y captura manualmente la información disponible.",

  "orders.validation.details.banner.ASSIGNED.title":
    "Paquete asignado",

  "orders.validation.details.banner.ASSIGNED.description":
    "El paquete ya tiene un destinatario asignado. Verifica que la información sea correcta antes de continuar.",

  // =====================================================
  // Package image
  // =====================================================
  "orders.validation.details.packageImage":
    "Imagen del paquete",

  "orders.validation.details.packageImageAlt":
    "Evidencia fotográfica del paquete",

  "orders.validation.details.imageCounter":
    "Imagen {current} de {total}",

  "orders.validation.details.imageUnavailable":
    "Imagen no disponible",

  "orders.validation.details.imageUnavailableDescription":
    "No se recibió una imagen del paquete o no fue posible cargar el archivo.",

  "orders.validation.details.imageActions.rotate":
    "Girar imagen",

  "orders.validation.details.imageActions.download":
    "Descargar imagen",

  "orders.validation.details.imageActions.fullscreen":
    "Ver imagen en pantalla completa",

  // =====================================================
  // Assignment information
  // =====================================================
  "orders.validation.details.assignmentInformation":
    "Información de asignación",

  "orders.validation.details.currentAssignment":
    "Asignación actual",

  "orders.validation.details.defaultUser":
    "Usuario predeterminado del locker",

  "orders.validation.details.assignedUser":
    "Usuario asignado actualmente",

  "orders.validation.details.recipientSelection":
    "Seleccionar destinatario",

  "orders.validation.details.selectRecipient":
    "Selecciona un destinatario",

  "orders.validation.details.loadingRecipients":
    "Cargando destinatarios...",

  "orders.validation.details.selectRecipientError":
    "Selecciona un destinatario válido antes de continuar.",

  "orders.validation.details.suggested":
    "Sugerido",

  "orders.validation.details.suggestedCandidates":
    "Destinatarios sugeridos",

  "orders.validation.details.userNumber":
    "Usuario #{id}",

  // =====================================================
  // Package metadata
  // =====================================================
  "orders.validation.details.packageMetadata":
    "Datos detectados en la etiqueta",

  "orders.validation.details.fieldNotDetected":
    "Este dato no fue detectado. Captúralo manualmente.",

  // Fields
  "orders.validation.details.fields.carrier":
    "Paquetería",

  "orders.validation.details.fields.tracking":
    "Tracking",

  "orders.validation.details.fields.recipient":
    "Destinatario",

  "orders.validation.details.fields.phone":
    "Teléfono",

  "orders.validation.details.fields.sender":
    "Remitente",

  "orders.validation.details.fields.unit":
    "Unidad o departamento",

  "orders.validation.details.fields.address":
    "Dirección",

  // Placeholders
  "orders.validation.details.placeholders.carrier":
    "Captura la paquetería",

  "orders.validation.details.placeholders.tracking":
    "Captura el número de tracking",

  "orders.validation.details.placeholders.recipient":
    "Captura el nombre del destinatario",

  "orders.validation.details.placeholders.phone":
    "Captura el teléfono",

  "orders.validation.details.placeholders.sender":
    "Captura el remitente",

  "orders.validation.details.placeholders.unit":
    "Captura la unidad o departamento",

  "orders.validation.details.placeholders.address":
    "Captura la dirección de entrega",

  // =====================================================
  // Location information
  // =====================================================
  "orders.validation.details.locationInformation":
    "Información de ubicación",

  "orders.validation.details.propertyId":
    "ID de propiedad",

  "orders.validation.details.lockerId":
    "ID de locker",

  "orders.validation.details.door":
    "Puerta",

  "orders.validation.details.column":
    "Columna",

  "orders.validation.details.position":
    "Posición",

  "orders.validation.details.dimensionId":
    "ID de dimensión",

  // =====================================================
  // Package information
  // =====================================================
  "orders.validation.details.packageInformation":
    "Información del paquete",

  "orders.validation.details.packageId":
    "ID de paquete",

  "orders.validation.details.serviceId":
    "ID de servicio",

  "orders.validation.details.packageCodeId":
    "ID de código de paquete",

  "orders.validation.details.detectRecipientId":
    "ID de detección de destinatario",

  "orders.validation.details.registrationDate":
    "Fecha de registro",

  // =====================================================
  // Validation actions
  // =====================================================
  "orders.validation.details.cancel":
    "Cancelar",

  "orders.validation.details.confirmAssignment":
    "Confirmar asignación",

  "orders.validation.details.assignAndValidate":
    "Asignar y validar",

  "orders.validation.details.validatedMessage":
    "El paquete fue asignado y validado correctamente.",

  // =====================================================
  // Order table
  // =====================================================
  "orderTable.tracking": "N.º de tracking",
  "orderTable.locker": "Locker",
  "orderTable.email": "Correo electrónico",
  "orderTable.door": "Puerta",
  "orderTable.status": "Estatus",
  "orderTable.receivedDate": "Fecha de recepción",
  "orderTable.withdrawnDate": "Fecha de retiro",
  "orderTable.generateQR": "Generar QR",
  "orderTable.delivered": "Entregado",
  "orderTable.inTransit": "En tránsito",
  "orderTable.processing": "Procesando",
  "orderTable.expired": "Expirado",
  "orderTable.scheduled": "Agendado",
  "orderTable.offeringType": "Tipo de transacción",

  // =====================================================
  // Order metrics
  // =====================================================
  "orderMetrics.delivered": "Entregados",
  "orderMetrics.collected": "Recogidos",
  "orderMetrics.expired": "Expirados",
  "orderMetrics.scheduled": "Agendados",

  // =====================================================
  // Order statuses
  // =====================================================
  "order.status.completed": "Completado",
  "order.status.expired": "Expirado",
  "order.status.inLocker": "En locker",
  "order.status.scheduled": "Agendado",
  "order.status.returned": "Devuelto",
  "order.status.canceled": "Cancelado",
  "order.status.canceledPicked": "Cancelado y retirado",

  "orders.query.title": "Orden y prioridad",
  "orders.query.sort.status": "Ordenar por estatus",
  "orders.query.sort.default": "Ordenar predeterminado",
  "orders.query.sort.registrationDate": "Fecha de registro",
  "orders.query.sort.pickupDate": "Fecha de retiro",

  "orders.query.direction.asc":"Ascendente",
  "orders.query.direction.desc":"Descendente",
  "orders.query.direction.newest":"Más recientes primero",
  "orders.query.direction.oldest":"Más antiguos primero",
  "orders.query.direction.lifecycleForward":"Inicio → fin",
  "orders.query.direction.lifecycleBackward":"Fin → inicio",
  "orders.query.filter.status":"Filtrar por estatus",

  "orders.query.priority.none":"Sin prioridad",
  "orders.query.priority.inProgress":"En proceso",
  "orders.query.priority.failure":"Falla",
  "orders.query.priority.scheduled":"Agendado",
  "orders.query.priority.inLocker":"En locker",
  "orders.query.priority.completed":"Completado",
  "orders.query.priority.expired":"Expirado",
  "orders.query.priority.returned":"Devuelto",
  "orders.query.priority.canceled":"Cancelado",
  "orders.query.priority.canceledPicked":"Cancelado y retirado",
  "orders.query.priority.pendingSurchargePayment":"Pago de recargo pendiente",
  "orders.query.priority.pendingValidate":"Pendiente de validar",
  "orders.query.priority.pendingPayment":"Pendiente de pago",
  "orders.query.priority.inTransit":"En tránsito",
  "orders.query.priority.expiredInLocker":"Expirado en locker",
  "orders.query.priority.expiredCollected":"Expirado y recogido",
  "orders.query.reset":"Restablecer orden",
 

    "orders.metrics.peakHourTooltip":"Hora con el mayor número de entregas registradas en el período seleccionado.",
  "orders.metrics.avgPerHourTooltip":"Promedio de entregas registradas por hora en el período seleccionado.",
  "orders.metrics.totalDeliveriesTooltip":"Número total de entregas registradas en el período seleccionado.",
  "orders.query.description":"Organiza el listado y coloca primero los paquetes que requieren atención, sin ocultar los demás.",

"orders.query.activeFilter": "Ajuste activo",
"orders.query.activeFilters": "Ajustes activos",

"orders.query.sortHelp":"Elige los criterios utilizados para ordenar la lista.",

"orders.query.directionHelp":
  "Elige la dirección en la que se muestran los resultados.",

"orders.query.selectSortFirst":"Elige los criterios utilizados para ordenar la lista.",

"orders.query.directionDisabled":"La dirección se vuelve disponible después de seleccionar un criterio de ordenamiento.",

"orders.query.priorityHelp":"Los paquetes con este estatus aparecerán primero sin ocultar los demás.",

"orders.query.priorityTooltip":"No es un filtro: coloca primero los paquetes del estado seleccionado y mantiene visibles todos los demás.",
"orders.query.sortBy":"Ordenar por",
"orders.query.direction":"Dirección",
"orders.query.priority":"Mostrar primero",
"orders.query.resetFilters":"Restablecer filtros",


  "orders.statusTabs.filterLabel": "Filtrar por estatus",
  "orders.statusTabs.filterHelp": "Selecciona qué grupo de paquetes quieres consultar.",
  "orders.statusTabs.active": "Activo",

  "orders.toolbar.title": "Filtros y organización",
  "orders.toolbar.description":
    "Busca, filtra y organiza el listado desde un solo lugar.",
  "orders.toolbar.activeSingle": "activo",
  "orders.toolbar.activePlural": "activos",
  "orders.toolbar.clearAll": "Limpiar todo",
  "orders.toolbar.search": "Buscar",
  "orders.toolbar.searchTrackingPlaceholder": "Buscar número de tracking...",
  "orders.toolbar.searchEmailPlaceholder": "Buscar correo...",
  "orders.toolbar.searchByTracking": "Tracking",
  "orders.toolbar.searchByEmail": "Correo",
  "orders.packagePanel.title": "Filtros y organización",
  "orders.packagePanel.description":
    "Busca, filtra y organiza los paquetes desde un solo lugar.",
  "orders.packagePanel.status": "Estatus",
  "orders.packagePanel.statusHelp": "Selecciona el grupo que quieres consultar.",
  "orders.toolbar.applied": "Aplicados",

  "orders.filters.title": "Filtros",
  "orders.filters.description": "Acota los resultados antes de ordenar o priorizar el listado.",
  "orders.filters.active": "activos",
  "orders.filters.search": "Buscar",
  "orders.filters.searchPlaceholder": "Buscar paquete...",
  "orders.filters.clearSearch": "Limpiar búsqueda",
  "orders.filters.service": "Tipo de transacción",
  "orders.filters.allServices": "Todas las transacciones",
  "orders.filters.dateRange": "Rango de fechas",
  "orders.filters.clear": "Limpiar filtros",
  "orders.filters.applied": "Filtros aplicados",

};