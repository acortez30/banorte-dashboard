import { Monitor, Tablet } from "lucide-react";
import {
  Outlet,
  PendingAd,
  ContentItem,
  AdSlot,
} from "../types/advertising.types";

/* ========================= */
/* ===== OUTLETS =========== */
/* ========================= */

export const INITIAL_OUTLETS: Outlet[] = [
  {
    id: "side",
    nameKey: "advertising.sideDisplay",
    specKey: "advertising.sideDisplaySpec",
    icon: Monitor,
    slots: [
      {
        id: "s1",
        title: "Promo Verano 2025",
        type: "ad",
        source: "internal",
        duration: 10,
        thumbnail: "",
        status: "approved",
      },
      {
        id: "s2",
        title: "Nuevo Reglamento",
        type: "news",
        source: "internal",
        duration: 8,
        thumbnail: "",
        status: "approved",
      },
      {
        id: "s3",
        title: "Evento Navideño",
        type: "event",
        source: "internal",
        duration: 12,
        thumbnail: "",
        status: "approved",
      },
      null,
      {
        id: "s5",
        title: "Coca-Cola Ad",
        type: "ad",
        source: "external",
        duration: 15,
        thumbnail: "",
        status: "approved",
      },
      null,
    ],
  },
  {
    id: "touch",
    nameKey: "advertising.touchscreen",
    specKey: "advertising.touchscreenSpec",
    icon: Tablet,
    slots: [
      {
        id: "t1",
        title: "Bienvenida",
        type: "community",
        source: "internal",
        duration: 8,
        thumbnail: "",
        status: "approved",
      },
      null,
      null,
      null,
      null,
      null,
    ],
  },
];

/* ========================= */
/* ===== PENDING ADS ======= */
/* ========================= */

export const INITIAL_PENDING: PendingAd[] = [
  {
    id: "p1",
    title: "Samsung Galaxy S25 Ad",
    type: "ad",
    submitter: "Samsung México",
    thumbnail: "",
    duration: 15,
  },
  {
    id: "p2",
    title: "Local Gym Promo",
    type: "ad",
    submitter: "FitLife Gym",
    thumbnail: "",
    duration: 10,
  },
];

/* ========================= */
/* ===== CONTENT LIBRARY === */
/* ========================= */

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: "c1",
    title: "Promo Verano 2025",
    type: "ad",
    source: "internal",
    duration: 10,
    date: "2025-06-15",
    active: true,
  },
  {
    id: "c2",
    title: "Nuevo Reglamento",
    type: "news",
    source: "internal",
    duration: 8,
    date: "2025-06-10",
    active: true,
  },
  {
    id: "c3",
    title: "Evento Navideño",
    type: "event",
    source: "internal",
    duration: 12,
    date: "2025-05-20",
    active: true,
  },
  {
    id: "c4",
    title: "Coca-Cola Ad",
    type: "ad",
    source: "external",
    duration: 15,
    date: "2025-06-01",
    active: true,
  },
  {
    id: "c5",
    title: "Bienvenida",
    type: "community",
    source: "internal",
    duration: 8,
    date: "2025-04-15",
    active: true,
  },
  {
    id: "c6",
    title: "Oferta Black Friday",
    type: "ad",
    source: "external",
    duration: 10,
    date: "2025-03-01",
    active: false,
  },
  {
    id: "c7",
    title: "Aviso Mantenimiento",
    type: "news",
    source: "internal",
    duration: 6,
    date: "2025-02-10",
    active: false,
  },
];

/* ========================= */
/* ===== HELPERS =========== */
/* ========================= */

export const getTypeLabels = (t: (key: string) => string) => ({
  ad: t("advertising.typeAd"),
  news: t("advertising.typeNews"),
  community: t("advertising.typeCommunity"),
  event: t("advertising.typeEvent"),
});

export const getTypeBadgeVariant = () => ({
  ad: "default",
  news: "secondary",
  community: "outline",
  event: "destructive",
} as const);

/* ========================= */
/* ===== MOCK GENERATORS === */
/* ========================= */

// 🔥 opcional: útil para testing / escalabilidad
export const createEmptySlots = (count: number): (AdSlot | null)[] =>
  Array.from({ length: count }, () => null);