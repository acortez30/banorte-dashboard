import type {
  PackageValidation,
  VisionPackageApiItem,
  VisionPackagesApiResponse,
} from "@/types/package-validation";

import {
  mapVisionPackage,
} from "@/mappers/package-validation.mapper";

/* ========================================= */
/* MOCK IMAGE                                */
/* ========================================= */

interface CreateMockLabelImageParams {
  tracking?: string;
  recipient?: string;
  carrier?: string;
  side?: string;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createMockLabelImage({
  tracking = "NO IDENTIFICADO",
  recipient = "NO IDENTIFICADO",
  carrier = "PAQUETERÍA",
  side = "Etiqueta del paquete",
}: CreateMockLabelImageParams) {
  const safeTracking = escapeSvgText(tracking);
  const safeRecipient = escapeSvgText(recipient);
  const safeCarrier = escapeSvgText(carrier);
  const safeSide = escapeSvgText(side);

  const barcode = Array.from(
    { length: 58 },
    (_, index) => {
      const x = 130 + index * 16;
      const width =
        index % 5 === 0
          ? 10
          : index % 3 === 0
            ? 7
            : 4;

      return `
        <rect
          x="${x}"
          y="530"
          width="${width}"
          height="75"
          fill="#ffffff"
        />
      `;
    },
  ).join("");

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1200"
      height="800"
      viewBox="0 0 1200 800"
    >
      <rect
        width="1200"
        height="800"
        fill="#f8fafc"
      />

      <rect
        x="70"
        y="60"
        width="1060"
        height="680"
        rx="24"
        fill="#ffffff"
        stroke="#cbd5e1"
        stroke-width="4"
      />

      <text
        x="110"
        y="135"
        font-family="Arial, sans-serif"
        font-size="34"
        font-weight="700"
        fill="#0f172a"
      >
        ${safeCarrier}
      </text>

      <text
        x="110"
        y="190"
        font-family="Arial, sans-serif"
        font-size="24"
        fill="#475569"
      >
        ${safeSide}
      </text>

      <line
        x1="110"
        y1="225"
        x2="1090"
        y2="225"
        stroke="#cbd5e1"
        stroke-width="3"
      />

      <text
        x="110"
        y="290"
        font-family="Arial, sans-serif"
        font-size="22"
        font-weight="700"
        fill="#0f172a"
      >
        Tracking
      </text>

      <text
        x="110"
        y="335"
        font-family="Arial, sans-serif"
        font-size="30"
        fill="#1e293b"
      >
        ${safeTracking}
      </text>

      <text
        x="110"
        y="405"
        font-family="Arial, sans-serif"
        font-size="22"
        font-weight="700"
        fill="#0f172a"
      >
        Destinatario
      </text>

      <text
        x="110"
        y="450"
        font-family="Arial, sans-serif"
        font-size="30"
        fill="#1e293b"
      >
        ${safeRecipient}
      </text>

      <rect
        x="110"
        y="510"
        width="980"
        height="115"
        rx="8"
        fill="#0f172a"
      />

      ${barcode}

      <text
        x="110"
        y="690"
        font-family="Arial, sans-serif"
        font-size="20"
        fill="#64748b"
      >
        Evidencia fotográfica simulada
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    svg,
  )}`;
}

/* ========================================= */
/* MOCK DEL BACKEND                          */
/* ========================================= */

export const VISION_PACKAGES_API_MOCK: VisionPackageApiItem[] = [
  /*
   * Paquete sin asignar:
   * el análisis no encontró una coincidencia suficiente.
   */
  {
    id_package: 69,
    id_service: 210,
    id_package_code: 88,

    tracking_number: null,
    registration_date:
      "2026-07-20T18:04:11.000Z",

    id_locker: 1,
    id_propierty: 1,
    id_locker_dimension: 34,

    door_number: 12,
    column_name: "A",
    compartment_name: "MEDIANO",
    compartment_size: "M",

    position: "A-12",

    current_user: {
      id_user: 6,
      first_name: "LOCKER",
      surname: "VIVIPOST",
      is_default_user: true,
    },

    id_package_detect_recipient: 17,
    analyzed: 1,

    assignment_status: "UNASSIGNED",
    needs_review: false,

    /*
     * El backend lo envía, pero no debe mostrarse
     * en la tabla ni en el detalle.
     */
    score: 10.7,

    image_issue: null,

    extracted: {
      carrier: "PAQUETEXPRESS",
      tracking: "576-758865/25-01",
      recipient: "MARIA LOPEZ",
      phone: "5512345678",
      address: "IZTACCIHUATL 505 INT 99",
      unit: "99",
      sender: "syscom.mx",
    },

    candidates: [
      {
        id_user: 412,
        score: 10.7,
      },
      {
        id_user: 331,
        score: 4.2,
      },
    ],

    images: [
      createMockLabelImage({
        carrier: "PAQUETEXPRESS",
        tracking: "576-758865/25-01",
        recipient: "MARIA LOPEZ",
        side: "Etiqueta frontal",
      }),
      createMockLabelImage({
        carrier: "PAQUETEXPRESS",
        tracking: "576-758865/25-01",
        recipient: "MARIA LOPEZ",
        side: "Etiqueta secundaria",
      }),
    ],
  },

  /*
   * Paquete que ya fue asignado por Vision,
   * pero requiere confirmación del operador.
   */
  {
    id_package: 71,
    id_service: 214,
    id_package_code: 91,

    tracking_number: "DHL-MX-75940213",
    registration_date:
      "2026-07-20T18:22:03.000Z",

    id_locker: 1,
    id_propierty: 1,
    id_locker_dimension: 31,

    door_number: 8,
    column_name: "B",
    compartment_name: "CHICO",
    compartment_size: "S",

    position: "B-8",

    current_user: {
      id_user: 412,
      first_name: "JUAN",
      surname: "PEREZ",
      is_default_user: false,
    },

    id_package_detect_recipient: 18,
    analyzed: 1,

    assignment_status: "REVIEW",
    needs_review: true,

    score: 89.5,

    image_issue: null,

    extracted: {
      carrier: "DHL",
      tracking: "DHL-MX-75940213",
      recipient: "JUAN PEREZ",
      phone: "8114256789",
      address:
        "AV. UNIVERSIDAD 1250 DEPTO 302",
      unit: "302",
      sender: "AMAZON MEXICO",
    },

    candidates: [
      {
        id_user: 412,
        score: 89.5,
      },
      {
        id_user: 408,
        score: 84.1,
      },
      {
        id_user: 419,
        score: 80.4,
      },
    ],

    images: [
      createMockLabelImage({
        carrier: "DHL",
        tracking: "DHL-MX-75940213",
        recipient: "JUAN PEREZ",
        side: "Etiqueta principal",
      }),
    ],
  },

  /*
   * Paquete en el que Vision no identificó tracking,
   * destinatario ni paquetería.
   */
  {
    id_package: 72,
    id_service: 216,
    id_package_code: 93,

    tracking_number: null,
    registration_date:
      "2026-07-20T18:40:00.000Z",

    id_locker: 2,
    id_propierty: 2,
    id_locker_dimension: 36,

    door_number: 14,
    column_name: "C",
    compartment_name: "GRANDE",
    compartment_size: "L",

    position: "C-14",

    current_user: {
      id_user: 6,
      first_name: "LOCKER",
      surname: "VIVIPOST",
      is_default_user: true,
    },

    id_package_detect_recipient: 19,
    analyzed: 1,

    assignment_status: "UNASSIGNED",
    needs_review: false,

    score: 0,

    image_issue: null,

    extracted: {
      carrier: null,
      tracking: null,
      recipient: null,
      phone: null,
      address: null,
      unit: null,
      sender: "Amazon México",
    },

    candidates: [],

    images: [],
  },

  /*
   * Paquete con URL de imagen inválida.
   * Sirve para probar el fallback del visor.
   */
  {
    id_package: 73,
    id_service: 218,
    id_package_code: 95,

    tracking_number: null,
    registration_date:
      "2026-07-20T19:10:00.000Z",

    id_locker: 3,
    id_propierty: 3,
    id_locker_dimension: 38,

    door_number: 9,
    column_name: "A",
    compartment_name: "EXTRA GRANDE",
    compartment_size: "XL",

    position: "A-9",

    current_user: {
      id_user: 6,
      first_name: "LOCKER",
      surname: "VIVIPOST",
      is_default_user: true,
    },

    id_package_detect_recipient: 20,
    analyzed: 1,

    assignment_status: "IMAGE_ISSUE",
    needs_review: false,

    score: null,

    image_issue:
      "La imagen está borrosa o no contiene una etiqueta legible.",

    extracted: {
      carrier: null,
      tracking: null,
      recipient: null,
      phone: null,
      address: null,
      unit: null,
      sender: null,
    },

    candidates: [],

    images: [
      "https://example.invalid/package-evidence.jpg",
    ],
  },

  /*
   * Ejemplo de paquete autoasignado.
   * Normalmente no debe mostrarse en la bandeja activa.
   */
  {
    id_package: 74,
    id_service: 220,
    id_package_code: 97,

    tracking_number: "FDX-825004112",
    registration_date:
      "2026-07-20T19:22:00.000Z",

    id_locker: 4,
    id_propierty: 4,
    id_locker_dimension: 34,

    door_number: 4,
    column_name: "D",
    compartment_name: "MEDIANO",
    compartment_size: "M",

    position: "D-4",

    current_user: {
      id_user: 515,
      first_name: "MARIA",
      surname: "GONZALEZ",
      is_default_user: false,
    },

    id_package_detect_recipient: 21,
    analyzed: 1,

    assignment_status: "ASSIGNED",
    needs_review: false,

    score: 99.2,

    image_issue: null,

    extracted: {
      carrier: "FEDEX",
      tracking: "FDX-825004112",
      recipient: "MARIA GONZALEZ",
      phone: "8189001020",
      address: "AV. ACAPULCO 445 DEPTO 21",
      unit: "21",
      sender: "MERCADO LIBRE",
    },

    candidates: [
      {
        id_user: 515,
        score: 99.2,
      },
    ],

    images: [
      createMockLabelImage({
        carrier: "FEDEX",
        tracking: "FDX-825004112",
        recipient: "MARIA GONZALEZ",
        side: "Etiqueta principal",
      }),
    ],
  },
];

/* ========================================= */
/* RESPUESTA COMPLETA SIMULADA               */
/* ========================================= */

export const VISION_PACKAGES_RESPONSE_MOCK: VisionPackagesApiResponse =
  {
    mensaje_return: "Operacion exitosa",
    return_result: VISION_PACKAGES_API_MOCK,
  };

/* ========================================= */
/* MODELO NORMALIZADO PARA LA UI             */
/* ========================================= */

/**
 * Bandeja activa.
 *
 * ASSIGNED se excluye porque ya fue resuelto
 * automáticamente y no requiere intervención.
 */
export const PACKAGE_VALIDATIONS_MOCK: PackageValidation[] =
  VISION_PACKAGES_API_MOCK
    .filter(
      (item) =>
        item.assignment_status !== "ASSIGNED",
    )
    .map(mapVisionPackage)
    .sort(
      (a, b) =>
        new Date(b.registrationDate).getTime() -
        new Date(a.registrationDate).getTime(),
    );

/* ========================================= */
/* HELPERS                                   */
/* ========================================= */

export function getMockPackageValidationById(
  id: string | number | undefined,
): PackageValidation | undefined {
  if (id == null) {
    return undefined;
  }

  const normalizedId = String(id);

  return PACKAGE_VALIDATIONS_MOCK.find(
    (item) =>
      item.id === normalizedId ||
      String(item.idPackage) === normalizedId,
  );
}

export function getMockVisionPackageApiItemById(
  id: string | number | undefined,
): VisionPackageApiItem | undefined {
  if (id == null) {
    return undefined;
  }

  const idPackage = Number(id);

  if (!Number.isFinite(idPackage)) {
    return undefined;
  }

  return VISION_PACKAGES_API_MOCK.find(
    (item) => item.id_package === idPackage,
  );
}