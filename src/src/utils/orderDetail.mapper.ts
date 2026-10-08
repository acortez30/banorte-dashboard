import { resolveOrderStatus } from "@/utils/orderStatus";
import {
  type OrderClient,
  type OrderCompartment,
  type OrderDetail,
  type OrderEvidence,
  type OrderLocker,
  type OrderNotification,
  type OrderOffering,
  type OrderProperty,
  type OrderStatus,
  type OrderTimeline,
} from "@/types/orders.types";

interface OfferingDetails {
  id_service_transaction?: number;
  id_offering_operation?: number;
  operation_name?: string;
  has_cost?: number | boolean;
  id_offering?: number;
  offering_title?: string;
  total_amount_in_cents?: number;
  amount_display?: string;
  id_status_transaction?: number;
}

const DEFAULT_MEDIA_BASE_URL = String(
  import.meta.env.VITE_IMAGE_BASE_URL ||
    "https://img-developer.vivipost.com/lockerhub"
).replace(/\/$/, "");

function normalizeArray<T = any>(value: unknown): T[] {
  if (!value) return [];
  return Array.isArray(value) ? (value as T[]) : [];
}

function safeText(value: unknown, fallback = "---"): string {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function safeNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function safeNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function safeBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function formatDate(date?: string | null): string {
  if (!date) return "---";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "---";
  }

  return parsed.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeTopicName(value: unknown): string {
  return safeText(value, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\wÁÉÍÓÚáéíóúÑñ-]/g, "");
}

function normalizeEvidenceName(value: unknown): string {
  return safeText(value, "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function getMediaBaseFromEvidence(evidence: any[]): string {
  const absoluteUrl = evidence
    .map((item) => safeText(item?.url, ""))
    .find((url) => /^https?:\/\//i.test(url));

  if (!absoluteUrl) return DEFAULT_MEDIA_BASE_URL;

  try {
    const parsed = new URL(absoluteUrl);
    const lockerHubIndex = parsed.pathname.toLowerCase().indexOf("/lockerhub/");

    if (lockerHubIndex >= 0) {
      return `${parsed.origin}${parsed.pathname.slice(0, lockerHubIndex + 10)}`.replace(
        /\/$/,
        ""
      );
    }

    return parsed.origin;
  } catch {
    return DEFAULT_MEDIA_BASE_URL;
  }
}

function resolveMediaUrl(value: unknown, evidence: any[]): string {
  const url = safeText(value, "").trim();
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) return url;

  const baseUrl = getMediaBaseFromEvidence(evidence);
  return `${baseUrl}/${url.replace(/^\/+/, "")}`;
}


export function mapOrderDetail(apiResponse: any): OrderDetail | null {
  const result =
    apiResponse?.result ??
    apiResponse?.return_result ??
    apiResponse?.data ??
    null;

  if (!result || !result.order_details) {
    return null;
  }

  const order = result.order_details ?? {};
  const customer = result.customer_details ?? {};
  const shipment = result.shipment_details ?? {};
  const property = result.property_details ?? {};
  const offering = result.offering_details as OfferingDetails | null;
  const compartments = mapCompartments(
    order?.compartments ?? result?.compartments,
    order,
    shipment
  );

  const registrationRaw =
    order.service_registration_date ?? order.registration_date ?? null;

  const expirationRaw = order.expiration_date ?? null;
  const collectedRaw = order.package_pickup_date ?? null;

  return {
    id_package: safeNullableNumber(
      order.id_package ??
        order.package_id ??
        shipment.id_package ??
        result.package_details?.id_package ??
        result.package?.id_package ??
        result.id_package
    ),
    tracking_number: safeText(order.tracking),
status: resolveOrderStatus(order),
    otp: safeText(order.otp),
    rating: safeNumber(order.rate),
    position: safeText(order.position),
    hash_package: safeText(order.hash_package ?? order.tracking, ""),

    registration_date: formatDate(registrationRaw),
    registration_date_no_format: registrationRaw,

    expiration_date: formatDate(expirationRaw),
    expiration_date_no_format: expirationRaw,

    collected_date: formatDate(collectedRaw),
    collected_date_no_format: collectedRaw,

    client: mapClient(customer),
    property: mapProperty(property),
    locker: mapLocker(order, shipment, compartments),
    timeline: mapTimeline(result.timeline),
    notifications: mapNotifications(order.send_notifications),
    evidence: mapEvidence(result.evidence, result.photo_delivery),
    offering: mapOffering(offering),
  };
}

function mapClient(data: any): OrderClient {
  return {
    name: safeText(data?.full_name),
    email: safeText(data?.email),
    phone: safeText(data?.phone),
  };
}

function mapProperty(data: any): OrderProperty {
  const weekdays = data?.schedules?.weekdays;
  const weekend = data?.schedules?.weekend;

  return {
    name: safeText(data?.name_propierty),
    address: safeText(data?.address),
    description: safeText(data?.description_place),
    scheduled_attention: {
      weekdays:
        weekdays?.from && weekdays?.to
          ? `${weekdays.from} - ${weekdays.to}`
          : "---",
      weekends:
        weekend?.from && weekend?.to
          ? `${weekend.from} - ${weekend.to}`
          : "---",
    },
  };
}

function mapCompartments(
  data: unknown,
  order: any,
  shipment: any
): OrderCompartment[] {
  const compartments = normalizeArray<any>(data).map((item) => ({
    id_locker_dimension: safeNullableNumber(item?.id_locker_dimension),
    id_compartment_dimension: safeNullableNumber(
      item?.id_compartment_dimension
    ),
    door_number: safeText(item?.door_number),
    position: safeText(item?.position),
    compartment_name: safeText(item?.compartment_name),
    compartment_size: safeText(item?.compartment_size),
  }));

  if (compartments.length > 0) return compartments;

  const legacyDoor =
    shipment?.door_number ?? order?.door_number ?? order?.door_assigned;
  const legacyPosition = order?.position ?? shipment?.position;
  const legacyName =
    shipment?.compartment_name ?? order?.compartment_name ?? "---";
  const legacySize =
    shipment?.maximum_dimensions ??
    shipment?.compartment_size ??
    order?.compartment_size ??
    "---";

  if (
    legacyDoor === null ||
    legacyDoor === undefined ||
    legacyDoor === ""
  ) {
    return [];
  }

  return [
    {
      id_locker_dimension: safeNullableNumber(
        shipment?.id_locker_dimension ?? order?.id_locker_dimension
      ),
      id_compartment_dimension: safeNullableNumber(
        shipment?.id_compartment_dimension ?? order?.id_compartment_dimension
      ),
      door_number: safeText(legacyDoor),
      position: safeText(legacyPosition),
      compartment_name: safeText(legacyName),
      compartment_size: safeText(legacySize),
    },
  ];
}

function mapLocker(
  order: any,
  shipment: any,
  compartments: OrderCompartment[]
): OrderLocker {
  const doors = compartments
    .map((item) => item.door_number)
    .filter((value) => value && value !== "---");

  const sizes = Array.from(
    new Set(
      compartments
        .map((item) => item.compartment_size || item.compartment_name)
        .filter((value) => value && value !== "---")
    )
  );

  return {
    id_locker: safeNullableNumber(order?.id_locker),
    name: safeText(
      shipment?.name_locker_destiny ??
        shipment?.locker_name ??
        order?.locker_name
    ),
    door_assigned: doors.length
      ? doors.join(", ")
      : safeText(shipment?.door_number),
    max_length: sizes.length
      ? sizes.join(" · ")
      : safeText(shipment?.maximum_dimensions),
    service_type: safeText(shipment?.courier_name, "LOCKER"),
    compartments,
  };
}

function mapTimeline(data: unknown): OrderTimeline[] {
  const timeline = normalizeArray<any>(data);

  return timeline.map((item, index) => {
    const normalizedTopic = normalizeTopicName(item?.topic_name);

    return {
      id: safeNumber(item?.id_topic_audit, index),
      title: normalizedTopic
        ? `orderDetail.title.${normalizedTopic}`
        : "orderDetail.title.unknown",
      timestamp: formatDate(item?.registration_date),
      description: normalizedTopic
        ? `orderDetail.${normalizedTopic}`
        : "orderDetail.unknown",
      type: "success",
    };
  });
}

function mapNotifications(data: unknown): OrderNotification[] {
  const notifications = normalizeArray<any>(data);

  return notifications.map((notif, index) => ({
    id: safeNumber(notif?.id_notification, index),
    type: safeText(
      notif?.name_notifification ??
        notif?.name_notification ??
        notif?.notification_name
    ),
    method: safeText(notif?.message_type),
    status: notif?.request_data === true ? "Enviado" : "Error",
    send_date: formatDate(notif?.send_date),
  }));
}

function mapEvidence(
  data: unknown,
  photoDeliveryData: unknown
): OrderEvidence {
  const evidence = normalizeArray<any>(data);

  const findEvidence = (...names: string[]) => {
    const normalizedNames = names.map(normalizeEvidenceName);
    return evidence.find((item) =>
      normalizedNames.includes(
        normalizeEvidenceName(
          item?.name_evidence ?? item?.nombre ?? item?.type_evidence
        )
      )
    );
  };

  const dropoff = findEvidence("drop_off", "dropoff", "delivery");
  const pickup = findEvidence("pickup", "pick_up");
  const video = findEvidence("video");

  const deliveryPhotos = normalizeArray<any>(photoDeliveryData)
    .map((item) =>
      resolveMediaUrl(
        typeof item === "string" ? item : item?.url ?? item?.path ?? item?.name,
        evidence
      )
    )
    .filter(Boolean);

  return {
    dropoff_photo: resolveMediaUrl(dropoff?.url, evidence),
    dropoff_timestamp: formatDate(dropoff?.registration_date),

    pickup_photo: resolveMediaUrl(pickup?.url, evidence),
    pickup_timestamp: formatDate(pickup?.registration_date),

    video_url: resolveMediaUrl(video?.url, evidence),
    video_timestamp: formatDate(video?.registration_date),
    delivery_photos: deliveryPhotos,
  };
}

function mapOffering(
  offering?: OfferingDetails | null
): OrderOffering | undefined {
  if (!offering) return undefined;

  return {
    id: safeNumber(offering.id_service_transaction),
    id_offering: offering.id_offering ?? null,
    id_offering_operation: offering.id_offering_operation ?? null,
    operation: safeText(offering.operation_name),
    title: safeText(offering.offering_title),
    amount: safeText(offering.amount_display),
    status_id: safeNumber(offering.id_status_transaction),
    has_cost: safeBoolean(offering.has_cost),
  };
}
