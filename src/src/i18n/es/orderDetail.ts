export const orderDetail: Record<string, string> = {
  // Order table headers
  "orderTable.tracking": "Nº Tracking",
  "orderTable.locker": "Locker",
  "orderTable.email": "Email",
  "orderTable.door": "Puerta",
  "orderTable.status": "Estatus",
  "orderTable.receivedDate": "Fecha recibido",
  "orderTable.withdrawnDate": "Fecha retirado",
  "orderTable.generateQR": "Generar QR",
  "orderTable.delivered": "Entregado",
  "orderTable.inTransit": "En Tránsito",
  "orderTable.processing": "Procesando",
  "orderTable.expired": "Expirado",
  "orderTable.scheduled": "Agendado",
  "orderTable.offeringType": "Tipo de transacción",

  // Order metrics
  "orderMetrics.delivered": "Entregados",
  "orderMetrics.collected": "Recogidos",
  "orderMetrics.expired": "Expirados",
  "orderMetrics.scheduled": "Agendados",

  // Order status
  "order.status.completed": "Completado",
  "order.status.expired": "Expirado",
  "order.status.inLocker": "En locker",
  "order.status.scheduled": "Agendado",

  // Order Details
  "orderDetail.orders": "Paquetes",
  "orderDetail.order": "Paquete",
  "orderDetail.timeInLocker": "Tiempo en Locker",
  "orderDetail.lockerSize": "Tamaño Locker",
  "orderDetail.door": "Puerta",
  "orderDetail.serviceType": "Tipo de Servicio",
  "orderDetail.clientAndOrder": "Cliente y Orden",
  "orderDetail.generateQR": "Generar QR",
  "orderDetail.trackingNumber": "No. de seguimiento",
  "orderDetail.clientName": "Nombre del cliente",
  "orderDetail.email": "Correo electrónico",
  "orderDetail.phone": "Teléfono",
  "orderDetail.notifications": "Notificaciones",
  "orderDetail.registrationDate": "Fecha de registro",
  "orderDetail.collectionDate": "Fecha de recolección",
  "orderDetail.expirationDate": "Fecha de expiración",
  "orderDetail.orderHistory": "Histórico de la orden",
  "orderDetail.transactionHistory": "Historial de la transacción",
  "orderDetail.rating": "Calificación",
  "orderDetail.deliveryEvidence": "Evidencia de entrega",
  "orderDetail.dropoffPhoto": "Foto de entrega (drop-off)",
  "orderDetail.pickupPhoto": "Foto de recogida (pickup)",
  "orderDetail.evidenceVideo": "Video de evidencia",
  "orderDetail.videoUnavailable": "Video no disponible",
  "orderDetail.qrCode": "Código QR",
  "orderDetail.qrNotAvaiable":
    "El código QR solo está disponible para órdenes expiradas o en locker",
  "orderDetail.qrNotAvailable": "No se puede generar QR",
  "orderDetail.scanToAccess": "Escanea para acceder a los detalles",
  "orderDetail.download": "Descargar",
  "orderDetail.print": "Imprimir",
  "orderDetail.channel": "Canal",
  "orderDetail.status": "Estatus",
  "orderDetail.type": "Tipo",
  "orderDetail.sendDate": "Fecha de envío",
  "orderDetail.schedule": "Agendado",
  "orderDetail.weekdays": "Horario (L-V)",
  "orderDetail.weekends": "Horario (S-D)",
  "orderDetail.description": "Descripción",
  "orderDetail.locker": "Locker",
  "orderDetail.maxSize": "Tamaño máx.",
  "orderDetail.directions": "Cómo llegar",
  "orderDetail.completed": "Completada",
  "orderDetail.expired": "Expirada",
  "orderDetail.delivered": "Entregada",
  "orderDetail.returned": "Retornada",
  "orderDetail.inTransit": "En tránsito",
  "orderDetail.canceledPicked": "Cancelado recolectado",
  "orderDetail.inLocker": "En locker",
  "orderDetail.processing": "Procesando",
  "orderDetail.qrDownloaded": "QR descargado",
  "orderDetail.received": "Recibido",
  "orderDetail.noNotifications": "Aún no se han enviado notificaciones",

  // Timeline / Audit titles
  "orderDetail.title.SCHEDULE": "Agendado",
  "orderDetail.SCHEDULE": "Paquete Agendado en el locker",

  "orderDetail.title.ASSIGNED": "Asignado",
  "orderDetail.ASSIGNED": "Paquete asignado a un compartimento",

  "orderDetail.title.IN_LOCKER": "En locker",
  "orderDetail.IN_LOCKER": "Paquete ingresado al locker",

  "orderDetail.title.EXPIRED": "Expirado",
  "orderDetail.EXPIRED": "Paquete expirado en locker",

  "orderDetail.title.PICKUP_PACKAGE": "Recolectado",
  "orderDetail.PICKUP_PACKAGE": "Paquete recolectado en locker",

  "orderDetail.title.REVIEWED": "Paquete revisado",
  "orderDetail.REVIEWED": "Paquete revisado",

  "orderDetail.title.CANCELED_UNUSED": "Cancelado sin uso",
  "orderDetail.CANCELED_UNUSED": "Paquete cancelado sin uso",

  "orderDetail.title.PACKAGE_DELIVERY_FAILED": "Intento de entrega",
  "orderDetail.PACKAGE_DELIVERY_FAILED":
    "Se intentó entregar el paquete en el locker, pero la operación falló. Esto puede deberse a que el compartimiento no estaba disponible, ocurrió un error en el sistema o el locker presentó una falla.",

  "orderDetail.title.REFUND": "Reembolso procesado",
  "orderDetail.REFUND": "El pago ha sido reembolsado correctamente.",
  "orderDetail.title.RETURNED": "Reembolso procesado",
  "orderDetail.RETURNED": "El pago ha sido reembolsado correctamente.",

  "orderDetail.title.PACKAGE_CANCELLED_BY_CARRIER":
    "Paquete cancelado por el transportista",
  "orderDetail.PACKAGE_CANCELLED_BY_CARRIER":
    "El transportista canceló el envío antes de la entrega.",

  // Order Evidence
  "orderEvidence.title": "Evidencia de entrega",
  "orderEvidence.dropoffPhoto": "Foto de entrega (drop-off)",
  "orderEvidence.pickupPhoto": "Foto de recogida (pickup)",
  "orderEvidence.videoSurveillance": "Video Vigilancia",
  "orderEvidence.deliveryVideos": "Videos de Entrega",
  "orderEvidence.pickupVideos": "Videos de Recogida",
  "orderEvidence.clip": "Clip",
  "orderEvidence.viewEvidence": "Ver evidencia",
  "orderEvidence.noRecords": "Sin registros",
  "orderEvidence.loadingStream": "Cargando stream...",
  "orderEvidence.sensor": "Sensor",
  "orderEvidence.door": "Puerta",
  "orderEvidence.time": "Hora",
  "orderEvidence.noVideo": "No hay video disponible",
  "orderEvidence.recordingsDescription":
    "Videos asociados directamente al paquete, agrupados por locker y operación.",
  "orderEvidence.recording": "video",
  "orderEvidence.recordings": "videos",
  "orderEvidence.refresh": "Actualizar",
  "orderEvidence.loadingVideos": "Cargando videos...",
  "orderEvidence.loadError": "No se pudieron cargar los videos",
  "orderEvidence.retry": "Reintentar",
  "orderEvidence.missingPackageId":
    "No se pudo identificar el paquete para consultar sus videos.",
  "orderEvidence.noPackageVideos":
    "Este paquete todavía no tiene videos disponibles.",
  "orderEvidence.onlyFinishedVideos":
    "Solo se muestran eventos que ya terminaron de grabarse.",
  "orderEvidence.locker": "Locker",
  "orderEvidence.origin": "Origen / depósito",
  "orderEvidence.destination": "Destino / retiro",
  "orderEvidence.camera": "Cámara",
  "orderEvidence.event": "Evento",
  "orderEvidence.downloadVideo": "Descargar video",
  "orderEvidence.videoPlaybackError":
    "No fue posible reproducir el video. Verifica que la sesión siga activa o intenta descargarlo.",
};