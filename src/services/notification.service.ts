import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== NOTIFICATION SERVICE == */
/* ============================= */

export const notificationService = {

  /* ============================= */
  /* ===== GET NOTIFICATIONS ===== */
  /* ============================= */

  async getNotifications(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/logs/log-order?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PACKAGE AUDIT ======== */
  /* ============================= */

  async getAuditPackageNotification() {

    const response = await fetchClient(
      `/server/system/audi-package`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== RESEND PACKAGE ======= */
  /* ============================= */

  async resendNotification(idPackage: number | string) {

    const response = await fetchClient(
      `/server/system/notification/forward/in-locker/${idPackage}`,
      {
        method: "POST",
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== RESEND LOGIN EMAIL === */
  /* ============================= */

  async resendEmailToUserNotLogged(idUser: number | string) {

    const response = await fetchClient(
      `/server/system/notification/send-login-reminder/${idUser}`,
      {
        method: "POST",
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LOCKER SYNCHRONIZE === */
  /* ============================= */

  async getSynchronized(
    params: Record<string, any>,
    idLocker: number | string
  ) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/synchronization/locker/${idLocker}?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== POST SYNCHRONIZE ===== */
  /* ============================= */

  async postSynchronized(body: any) {

    const response = await fetchClient(
      `/server/synchronization/locker`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

};