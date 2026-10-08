export interface OfferingOperationConfig {
  id_offering: number;
  offering: string;
  offering_description: string;
  id_offering_operation: number;
  operation_name: string;
  operation_description: string;
}

export const OFFERING_OPERATION_MAP: Record<number, OfferingOperationConfig> = {
  1: {
    id_offering: 1,
    offering: "Enviar un paquete",
    offering_description:
      "Servicio de envíos donde un usuario puede despachar paquetes a distintos destinos utilizando la red logística de Droppi.",
    id_offering_operation: 1,
    operation_name: "Locker a Locker",
    operation_description:
      "El remitente deposita el paquete en una taquilla y el destinatario lo recoge en otra taquilla.",
  },
  2: {
    id_offering: 1,
    offering: "Enviar un paquete",
    offering_description:
      "Servicio de envíos donde un usuario puede despachar paquetes a distintos destinos utilizando la red logística de Droppi.",
    id_offering_operation: 2,
    operation_name: "Locker a Dirección",
    operation_description:
      "El remitente deja el paquete en una taquilla y se entrega directamente en el domicilio del destinatario.",
  },
  3: {
    id_offering: 1,
    offering: "Enviar un paquete",
    offering_description:
      "Servicio de envíos donde un usuario puede despachar paquetes a distintos destinos utilizando la red logística de Droppi.",
    id_offering_operation: 3,
    operation_name: "OXXO a Dirección",
    operation_description:
      "El usuario entrega el paquete en una sucursal OXXO y se distribuye hasta la dirección final.",
  },
  5: {
    id_offering: 2,
    offering: "Intercambio Seguro",
    offering_description:
      "Servicio diseñado para facilitar compras y ventas entre particulares con protección durante la transacción.",
    id_offering_operation: 5,
    operation_name: "Intercambio Seguro",
    operation_description:
      "El pago permanece retenido hasta que el comprador confirma la recepción satisfactoria del producto o servicio.",
  },
  6: {
    id_offering: 2,
    offering: "Intercambio Seguro",
    offering_description:
      "Servicio diseñado para facilitar compras y ventas entre particulares con protección durante la transacción.",
    id_offering_operation: 6,
    operation_name: "Entrega Rápida",
    operation_description:
      "Permite concretar la entrega entre usuarios sin custodia del pago ni validaciones adicionales.",
  },
  7: {
    id_offering: 3,
    offering: "Devoluciones Fáciles",
    offering_description:
      "Servicio para facilitar devoluciones de compras realizadas en tiendas físicas o comercio electrónico.",
    id_offering_operation: 7,
    operation_name: "Devolución Tienda Socio",
    operation_description:
      "El usuario entrega el paquete en un punto autorizado de la red y la devolución es rastreada hasta su destino.",
  },
  8: {
    id_offering: 3,
    offering: "Devoluciones Fáciles",
    offering_description:
      "Servicio para facilitar devoluciones de compras realizadas en tiendas físicas o comercio electrónico.",
    id_offering_operation: 8,
    operation_name: "Servicio de Entrega de Devoluciones",
    operation_description:
      "El usuario utiliza una etiqueta digital proporcionada por el comercio para procesar la devolución.",
  },
  9: {
    id_offering: 4,
    offering: "Recibir",
    offering_description:
      "Servicio orientado a reservar espacio para recibir productos, pedidos o entregas.",
    id_offering_operation: 9,
    operation_name: "Entrega de alimentos y comestibles",
    operation_description:
      "Recepción temporal de pedidos provenientes de supermercados, restaurantes o comercios de alimentos.",
  },
  10: {
    id_offering: 4,
    offering: "Recibir",
    offering_description:
      "Servicio orientado a reservar espacio para recibir productos, pedidos o entregas.",
    id_offering_operation: 10,
    operation_name: "Recibe un Paquete",
    operation_description:
      "Reserva una taquilla para recibir paquetes de mensajería, comercio electrónico o entregas personales.",
  },
  11: {
    id_offering: 5,
    offering: "Almacenamiento",
    offering_description:
      "Servicio que permite rentar una taquilla como espacio temporal para guardar objetos personales.",
    id_offering_operation: 11,
    operation_name: "Almacenamiento",
    operation_description:
      "El usuario reserva una taquilla por un período determinado para almacenar pertenencias de forma segura y con acceso controlado.",
  },
  12: {
    id_offering: 6,
    offering: "Dejar Paquete",
    offering_description:
      "Servicio que permite dejar un paquete en una taquilla para que otra persona lo recoja posteriormente.",
    id_offering_operation: 12,
    operation_name: "Entrega un Paquete",
    operation_description:
      "Ideal para regalos, ventas entre particulares, intercambio de documentos o entregas coordinadas sin coincidir físicamente.",
  },
  13: {
    id_offering: 7,
    offering: "Droppi Shop",
    offering_description:
      "Plataforma de comercio electrónico integrada al ecosistema Droppi.",
    id_offering_operation: 13,
    operation_name: "Droppi Shop",
    operation_description:
      "Permite comprar productos, gestionar pedidos y utilizar la infraestructura logística de Droppi para la entrega.",
  },
};