import { useEffect, useState, useCallback } from "react";
import { courierService } from "@/services/courier.service";
import { propertiesService } from "@/services/properties.service";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

/* ============================= */
/* ===== TIPOS ================= */
/* ============================= */

export interface Carrier {
  id_courier: number;
  id_propierty_courier: number; // 🔥 NECESARIO
  courier_name: string;
  code_to_deliver: string;
  id_status: number;
  name_courier_type?: string;
  alias_courier?: string;
  logo_courier_small?: string | null;
}

type CreateCarrierPayload = {
  to_company?: number;
  to_property?: number;
  data: {
    id_courier_type: number;
    courier_name: string;
    alias_courier: string;
    code: string;
    logo_courier_small?: string | null;
  };
};

type UpdateCarrierPayload = {
  id_propierty_courier: number;
  data: {
    id_status: number;
    id_courier_type: number;
    code: string;
    courier_name: string;
    alias_courier?: string | null;
    logo_courier_small?: string | null;
  };
};

type SettingsResponse = {
  settingsPropierty: {
    request_carrier_code: boolean;
  }[];
};

/* ============================= */
/* ===== HOOK ================== */
/* ============================= */

export const useCarriers = () => {
  const { t } = useLanguage();

  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 SETTINGS
 const [requestCarrierCode, setRequestCarrierCode] = useState<boolean | null>(null);

  /* ============================= */
  /* ===== LOAD CARRIERS ========= */
  /* ============================= */

  const loadCarriers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await courierService.getCouriers();
      setCarriers(res?.result || []);
    } catch (error) {
      console.error(error);
      toast.error(t("carriers.errors.loadCarriers"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  /* ============================= */
  /* ===== LOAD SETTINGS ========= */
  /* ============================= */

const loadRequestCarrierCode = useCallback(
  async (propertyId: number, lang = "es") => {
    try {
      const res: SettingsResponse =
        await propertiesService.getStatusRequestCarrierCode(
          propertyId,
          lang
        );

      const value =
        res?.settingsPropierty?.[0]?.request_carrier_code ?? false;

      setRequestCarrierCode(value);
    } catch (error) {
      console.error(error);
      toast.error(t("carriers.errors.loadSettings"));
    }
  },
  [t]
);

  /* ============================= */
  /* ===== UPDATE SETTINGS ======= */
  /* ============================= */

const updateRequestCarrierCode = async (
  propertyId: number,
  value: boolean,
  lang = "es"
) => {
  const prev = requestCarrierCode;

  // Optimistic UI
  setRequestCarrierCode(value);

  try {
    const body = {
      data: {
        request_carrier_code: value,
      },
    };

    await propertiesService.updateStatusRequestCarrierCode(
      body,
      propertyId,
      lang
    );

    toast.success(t("carriers.success.settingUpdated"));
  } catch (error) {
    // Rollback
    setRequestCarrierCode(prev ?? false);

    console.error(error);
    toast.error(t("carriers.errors.updateSetting"));
  }
};
  /* ============================= */
  /* ===== CRUD ================== */
  /* ============================= */

  const createCarrier = async (payload: CreateCarrierPayload) => {
    try {
      const res = await courierService.postCouriers(payload);

      if (res?.mensaje_return?.ERROR) {
        throw new Error(
          res?.mensaje_return?.ERROR_MENSAGGE || t("carriers.errors.create")
        );
      }

      await loadCarriers();

      return res;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const updateCarrier = async (payload: UpdateCarrierPayload) => {
    try {
      const res = await courierService.updateCouriers(payload);

      if (res?.mensaje_return?.ERROR) {
        throw new Error(
          res?.mensaje_return?.ERROR_MENSAGGE || t("carriers.errors.update")
        );
      }

      await loadCarriers();

      toast.success(t("carriers.success.updated"));

      return res;
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || t("carriers.errors.update"));

      throw error;
    }
  };

  const deleteCarrier = async (id: number) => {
    try {
      const res = await courierService.deleteCouriers({
        id_courier: id,
      });

        setCarriers((prev) =>
    prev.filter((c) => c.id_propierty_courier !== id)
  );

      if (res?.mensaje_return?.ERROR) {
        throw new Error(
          res?.mensaje_return?.ERROR_MENSAGGE || t("carriers.errors.delete")
        );
      }

      setCarriers((prev) =>
        prev.filter((c) => c.id_courier !== id)
      );

      toast.success(t("carriers.success.deleted"));

      return res;
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || t("carriers.errors.delete"));

      throw error;
    }
  };

  /* ============================= */
  /* ===== INIT ================== */
  /* ============================= */

  useEffect(() => {
    loadCarriers();
  }, [loadCarriers]);

  /* ============================= */
  /* ===== RETURN ================ */
  /* ============================= */

  return {
    carriers,
    loading,

    // 🔥 settings
    requestCarrierCode,
    loadRequestCarrierCode,
    updateRequestCarrierCode,

    // CRUD
    loadCarriers,
    createCarrier,
    updateCarrier,
    deleteCarrier,
  };
};