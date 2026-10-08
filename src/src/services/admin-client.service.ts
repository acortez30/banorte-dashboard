// src/services/admin-client.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== ADMIN CLIENT SERVICE == */
/* ============================= */

export const adminClientService = {

  /* ============================= */
  /* ===== SECTORS ============== */
  /* ============================= */

  async getSectors(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/company/query-sectors?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PROPERTIES =========== */
  /* ============================= */

  async getProperty(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/company/query-propierty-unit?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UNITS ================ */
  /* ============================= */

  async getUnit(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/company/query-unit?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== REGISTER CONSUMER ==== */
  /* ============================= */

  async registerConsumerAccount(body: any) {

    const response = await fetchClient(
      `/server/auth/register-consumer-account`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== USER LOGS ============ */
  /* ============================= */

  async getUserLogs(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/user/log-user?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== FORGOT PASSWORD ====== */
  /* ============================= */

  async forgotPassword(body: any) {

    const response = await fetchClient(
      `/server/user/forgot-password-user`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UPDATE USER ========== */
  /* ============================= */

  async updateUserData(body: any) {

    const response = await fetchClient(
      `/server/user/update-data-user`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== REBOOT LOCKER ======== */
  /* ============================= */

  async rebootUnit(body: any) {

    const response = await fetchClient(
      `/server/locker/reboot-unit`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PACKAGE LOG ========== */
  /* ============================= */

  async logPackageUser(body: any) {

    const response = await fetchClient(
      `/server/package/log-package-user`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== METRICS YEAR ========= */
  /* ============================= */

  async getMetricsByYear(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/package/query-data-package-classifieds?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== METRICS DAY ========== */
  /* ============================= */

  async getMetricsByDay(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/package/query-data-package-day-week?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LOCKER RESOURCES ===== */
  /* ============================= */

  async queryResourcesLocker(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/locker/query-resources-locker?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LOCKER GRID ========== */
  /* ============================= */

  async getLockersGrid(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/locker/query-door-locker-grid?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LOCKER AUDIT ========= */
  /* ============================= */

  async auditLocker(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/system/audit-locker?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== ORDERS =============== */
  /* ============================= */

  async getOrders(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/package/query-package-company?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CREATE ORDER ========= */
  /* ============================= */

  async createOrder(body: any) {

    const response = await fetchClient(
      `/server/package/schedule-package`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== VALIDATE TRACKING ==== */
  /* ============================= */

  async validateTracking(body: any) {

    const response = await fetchClient(
      `/server/package/validate-tracking`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

};