import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";
import type { ApiServicesResponse } from "@/types/ServiceTransaction.types";
import type {
  UpdateVisionAddresseePayload,
  VisionAssignmentStatus,
  VisionPackageDetailResponse,
  VisionPackageResolutionPayload,
  VisionPackagesApiResponse,
} from "@/types/package-validation";

export interface GetVisionPackagesParams {
  status?: VisionAssignmentStatus;
  id_property?: number;
  id_locker?: number;
  language?: "es" | "en";
}

function appendOptionalNumber(
  query: URLSearchParams,
  key: string,
  value: number | undefined
) {
  if (
    value === undefined ||
    value === null ||
    !Number.isFinite(value)
  ) {
    return;
  }

  query.set(key, String(value));
}

class PackageService {
  /* ============================= */
  /* ===== GET METADATA LABEL ==== */
  /* ============================= */

  async getMetadataLabel(
    idPackage: string | number,
    language: "es" | "en" = "es"
  ): Promise<VisionPackageDetailResponse> {
    const response = await fetchClient(
      `/server/package/asignation/${idPackage}?language=${language}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    return handleResponse(
      response
    ) as Promise<VisionPackageDetailResponse>;
  }

  /* ============================= */
  /* ===== GET VISION PACKAGES === */
  /* ============================= */

  async getVisionPackages(
    params: GetVisionPackagesParams = {}
  ): Promise<VisionPackagesApiResponse> {
    const query = new URLSearchParams();

    if (params.status) {
      query.set("status", params.status);
    }

    appendOptionalNumber(
      query,
      "id_property",
      params.id_property
    );

    appendOptionalNumber(
      query,
      "id_locker",
      params.id_locker
    );

    query.set(
      "language",
      params.language ?? "es"
    );

    const response = await fetchClient(
      `/server/package/unassigned?${query.toString()}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    return handleResponse(
      response
    ) as Promise<VisionPackagesApiResponse>;
  }

  /**
   * Alias compatible con el uso anterior.
   */
  async getPackageUnassigned(
    params: GetVisionPackagesParams | string = {}
  ): Promise<VisionPackagesApiResponse> {
    if (typeof params === "string") {
      const idLocker = Number(params);

      return this.getVisionPackages({
        id_locker:
          Number.isFinite(idLocker)
            ? idLocker
            : undefined,
      });
    }

    return this.getVisionPackages(params);
  }

  /* ============================= */
  /* ===== RESOLVE VISION PACKAGE  */
  /* ============================= */

  async resolveVisionPackage(
    idPackage: string | number,
    language: "es" | "en",
    body: VisionPackageResolutionPayload
  ): Promise<unknown> {
    const response = await fetchClient(
      `/server/package/asignation/${idPackage}?language=${language}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  }

  /* ============================= */
  /* ===== UPDATE METADATA LABEL = */
  /* ============================= */

  async putMetadataLabel(
    idPackage: string | number,
    language: string,
    body: VisionPackageResolutionPayload
  ): Promise<unknown> {
    return this.resolveVisionPackage(
      idPackage,
      language === "en" ? "en" : "es",
      body
    );
  }

  async putMetadata(
    idPackage: string | number,
    language: string,
    body: VisionPackageResolutionPayload
  ): Promise<unknown> {
    return this.putMetadataLabel(
      idPackage,
      language,
      body
    );
  }

  /* ============================= */
  /* ===== UPDATE ADDRESSEE ====== */
  /* ============================= */

  /**
   * Reasignación clásica.
   *
   * No usar para resolver un paquete que pertenece al flujo de Vision,
   * porque este endpoint no actualiza package_metadata.
   */
  async updateAddressee(
    body: UpdateVisionAddresseePayload,
    language: "es" | "en" = "es"
  ): Promise<unknown> {
    const response = await fetchClient(
      `/server/package/update-addressee?language=${language}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  }

  /* ============================= */
  /* ===== GET FAILURES ========== */
  /* ============================= */

  async getFailures(idLocker?: string) {
    const query = idLocker
      ? `?id_locker=${idLocker}`
      : "";

    const response = await fetchClient(
      `/server/package/failures${query}`
    );

    return handleResponse(response);
  }

  /* ============================= */
  /* ===== GET SERVICE TRANSACTIONS */
  /* ============================= */

  async getServiceTransactions(params: {
    id_propierty: number;
    date_start: number;
    date_end: number;
    language?: "en" | "es";
  }): Promise<ApiServicesResponse> {
    const query = new URLSearchParams({
      id_propierty: String(
        params.id_propierty
      ),
      date_start: String(params.date_start),
      date_end: String(params.date_end),
      language: params.language ?? "es",
    });

    const response = await fetchClient(
      `/server/package/query-package-offering-operations?${query.toString()}`
    );

    return handleResponse(response);
  }

  /* ============================= */
  /* ===== CANCEL SERVICE ======== */
  /* ============================= */

  async cancelService(idService: number) {
    const response = await fetchClient(
      "/server/package/cancel-service",
      {
        method: "POST",
        body: JSON.stringify({
          id_service: idService,
        }),
      }
    );

    return handleResponse(response);
  }

  /* ============================= */
  /* ===== RESEND NOTIFICATION === */
  /* ============================= */

  async resendNotification(
    idService: number,
    channel: "PUSH" | "EMAIL" | "SMS"
  ) {
    const response = await fetchClient(
      "/server/package/resend-notification",
      {
        method: "POST",
        body: JSON.stringify({
          id_service: idService,
          channel,
        }),
      }
    );

    return handleResponse(response);
  }
}

export const packageService =
  new PackageService();