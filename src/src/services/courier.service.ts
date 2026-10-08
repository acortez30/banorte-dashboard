// src/services/company.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

function buildQuery(params: any) {
    return new URLSearchParams(params).toString();
}
export const courierService = {
    async getCourierTypes() {

        const response = await fetchClient(
            `/server/couriers/types`,
            {
                method: "GET",
            }
        );
        return handleResponse(response);
    },
async getCouriers(params: any = {}) {
    const query = buildQuery(params);
   
    const response = await fetchClient(
        `/server/couriers${query ? `?${query}` : ""}`,
        {
            method: "GET",
        }
    );

    return handleResponse(response);
},
    async deleteCouriers(carrier: any) {
    const response = await fetchClient(
        `/server/couriers/${carrier.id_courier}`,
        {
        method: "DELETE",
        }
    );

    return handleResponse(response);
    },
    async updateCouriers(body: any) {
        const response = await fetchClient(
            `/server/couriers`,
            {
                method: "PUT",
                body: JSON.stringify(body),
            }
        );
        return handleResponse(response);
    },
async postCouriers(payload: {
    to_company?: number;
    to_property?: number;
    data: {
        id_courier_type: number;
        courier_name: string;
        alias_courier: string;
        code: string;
        logo_courier_small?: string | null;
    };
}) {
    const response = await fetchClient(
        `/server/couriers`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
    return handleResponse(response);
},
    async getPackageCouriers(
        id_courier: string,
        language: string,
        date_start: string,
        date_end: string,
        scheduled: boolean,
        canceled: boolean
    ) {
        const query = buildQuery({
            language,
            date_start,
            date_end,
            scheduled,
            canceled,
        });

        const response = await fetchClient(
            `/server/couriers/packages/${id_courier}?${query}`,
            {
                method: "GET"
            }
        );
        return handleResponse(response);
    },

     async getCourierMetrics() {
        const response = await fetchClient(
            `/server/couriers/metrics`,
            {
                method: "GET",
            }
        );

        return handleResponse(response);
    },
}