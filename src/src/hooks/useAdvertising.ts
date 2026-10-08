import { useState, useMemo } from "react";
import {
  INITIAL_OUTLETS,
  INITIAL_PENDING,
  INITIAL_CONTENT,
} from "@/data/advertising.data";

import {
  AdSlot,
  PendingAd,
  ContentItem,
  ContentType,
  Source,
  ContentFilter,
} from "@/types/advertising.types";

/* ========================= */
/* ===== HOOK ============== */
/* ========================= */

export function useAdvertising() {
  /* ========================= */
  /* ===== STATE ============= */
  /* ========================= */

  const [outlets, setOutlets] = useState(INITIAL_OUTLETS);
  const [pendingAds, setPendingAds] = useState<PendingAd[]>(INITIAL_PENDING);
  const [contentLibrary, setContentLibrary] =
    useState<ContentItem[]>(INITIAL_CONTENT);

  const [selectedOutlet, setSelectedOutlet] = useState(0);

  const [contentFilter, setContentFilter] =
    useState<ContentFilter>("all");

  /* ========================= */
  /* ===== DERIVED =========== */
  /* ========================= */

  const currentOutlet = outlets[selectedOutlet];

  const activeSlotsCount = useMemo(
    () => currentOutlet.slots.filter(Boolean).length,
    [currentOutlet]
  );

  const filteredContent = useMemo(() => {
    if (contentFilter === "all") return contentLibrary;
    return contentLibrary.filter((c) => c.type === contentFilter);
  }, [contentLibrary, contentFilter]);

  /* ========================= */
  /* ===== SLOT ACTIONS ====== */
  /* ========================= */

  const moveSlot = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx > currentOutlet.slots.length - 1) return;

    setOutlets((prev) => {
      const next = [...prev];
      const outlet = {
        ...next[selectedOutlet],
        slots: [...next[selectedOutlet].slots],
      };

      [outlet.slots[idx], outlet.slots[targetIdx]] = [
        outlet.slots[targetIdx],
        outlet.slots[idx],
      ];

      next[selectedOutlet] = outlet;
      return next;
    });
  };

  const deleteSlot = (idx: number) => {
    setOutlets((prev) => {
      const next = [...prev];
      const outlet = {
        ...next[selectedOutlet],
        slots: [...next[selectedOutlet].slots],
      };

      outlet.slots[idx] = null;

      next[selectedOutlet] = outlet;
      return next;
    });
  };

  const addToSlot = (idx: number, slot: AdSlot) => {
    setOutlets((prev) => {
      const next = [...prev];
      const outlet = {
        ...next[selectedOutlet],
        slots: [...next[selectedOutlet].slots],
      };

      outlet.slots[idx] = slot;

      next[selectedOutlet] = outlet;
      return next;
    });
  };

  /* ========================= */
  /* ===== APPROVAL FLOW ===== */
  /* ========================= */

  const approveAd = (ad: PendingAd) => {
    setPendingAds((prev) => prev.filter((a) => a.id !== ad.id));

    setOutlets((prev) => {
      const next = [...prev];
      const outlet = {
        ...next[selectedOutlet],
        slots: [...next[selectedOutlet].slots],
      };

      const emptyIdx = outlet.slots.findIndex((s) => s === null);

      if (emptyIdx !== -1) {
        outlet.slots[emptyIdx] = {
          id: ad.id,
          title: ad.title,
          type: ad.type,
          source: "external",
          duration: ad.duration,
          thumbnail: ad.thumbnail,
          status: "approved",
        };
      }

      next[selectedOutlet] = outlet;
      return next;
    });
  };

  const rejectAd = (id: string) => {
    setPendingAds((prev) => prev.filter((a) => a.id !== id));
  };

  /* ========================= */
  /* ===== CONTENT LIBRARY === */
  /* ========================= */

  const addContent = (
    title: string,
    type: ContentType,
    source: Source,
    duration: number
  ) => {
    const newItem: ContentItem = {
      id: `lib-${Date.now()}`,
      title,
      type,
      source,
      duration,
      date: new Date().toISOString().split("T")[0],
      active: true,
    };

    setContentLibrary((prev) => [newItem, ...prev]);
  };

  const toggleContentActive = (id: string) => {
    setContentLibrary((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const deleteContent = (id: string) => {
    setContentLibrary((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  /* ========================= */
  /* ===== RETURN ============ */
  /* ========================= */

  return {
    // state
    outlets,
    pendingAds,
    contentLibrary,
    selectedOutlet,
    contentFilter,

    // setters
    setSelectedOutlet,
    setContentFilter,

    // derived
    currentOutlet,
    activeSlotsCount,
    filteredContent,

    // slot actions
    moveSlot,
    deleteSlot,
    addToSlot,

    // approval
    approveAd,
    rejectAd,

    // content
    addContent,
    toggleContentActive,
    deleteContent,
  };
}