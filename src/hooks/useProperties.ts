// hooks/useProperties.ts
import { useState, useEffect, useCallback } from "react";
import { companyService } from "@/services/company.service";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface Property {
  id_propierty: number;
  id_company: number;
  id_type_urbanization?: number;
  name_urbanization?: string;
  name_propierty: string;
  address: string;
  description_place: string;
  code_propierty: string;
  latitud: string;
  longitud: string;
  registration_date: string;
  update_date: string;
  id_status?: number;
}

export interface PropertyCompany {
  id_company: number;
  company_name: string;
  address: string;
  map_lat_center_point: string;
  map_length_center_point: string;
  company_type?: string;
  phone_number?: string;
}

export interface PropertyKPIs {
  total: number;
  active: number;
  totalLockers: number;
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useProperties(idCompany?: number | null) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [company, setCompany] = useState<PropertyCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!idCompany) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Ambos endpoints en paralelo
      // GET /server/company/${idCompany}           → data.companies[0]
      // GET /server/company/${idCompany}/propierty → data.properties
      const [companyData, propertiesData] = await Promise.all([
        companyService.getCompanyId(idCompany),
        companyService.getProperties(idCompany),
      ]);

      setCompany(companyData.companies?.[0] ?? null);
      setProperties(propertiesData.properties ?? []);

    } catch (err) {
      console.error("useProperties error:", err);
      setError("Error cargando propiedades");
    } finally {
      setLoading(false);
    }
  }, [idCompany]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpis: PropertyKPIs = {
    total: properties.length,
    // id_status === 1 → activa (según tu response)
    active: properties.filter((p) => p.id_status === 1).length,
    // total_lockers no viene en este endpoint, queda en 0 hasta que lo agregues
    totalLockers: 0,
  };

  return {
    properties,
    company,
    loading,
    error,
    kpis,
    refetch: fetchData,
  };
}
