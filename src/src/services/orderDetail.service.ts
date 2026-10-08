import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";


/* ============================= */
/* ===== ORDER DETAIL SERVICE === */
/* ============================= */

class OrderDetailService {

  /* ============================= */
  /* ===== GET PACKAGE DETAIL ==== */
  /* ============================= */

  async getDetailPackage(id_service: string | number, lang: string) {

    const response = await fetchClient(
      `/server/package/details/${id_service}?lang=${lang}`
    );

    return handleResponse(response);
  }

}

/* ============================= */
/* ===== EXPORT INSTANCE ======= */
/* ============================= */

export const orderDetailService = new OrderDetailService();