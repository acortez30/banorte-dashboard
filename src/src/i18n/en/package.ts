export const packages: Record<string, string> = {
  "package.trackingHistory": "Tracking History",
  "package.audit.1": "A new compartment was added to the package.",

  "package.audit.8": "The package {tracking} was picked up on {date}.",

  "package.audit.14": "An employee picked up the package.",

  "package.audit.25":
    "The customer registered the package at the origin locker.",

  "package.audit.35": "The package was delivered to the destination locker.",

  "package.audit.36": "The package was delivered to the destination locker.",

  "package.audit.37":
    "The customer did not pick up the package within the allowed time and the package expired.",

  "package.audit.41": "The carrier picked up the expired package.",

  "package.audit.66": "The package was cancelled by the carrier.",

   // Expired package extension
  "packageExtension.actions": "Actions",
  "packageExtension.action": "Extend 3 days",
  "packageExtension.title": "Extend expiration date",
  "packageExtension.description": "Confirm whether you want to give the resident 3 additional days to pick up this package.",
  "packageExtension.package": "Package",
  "packageExtension.expirationChange": "Expiration date change",
  "packageExtension.currentExpiration": "Current expiration",
  "packageExtension.newExpiration": "New expiration",
  "packageExtension.dateUnavailable": "Date unavailable",
  "packageExtension.backendWillCalculate": "Will be calculated by backend",
  "packageExtension.warningTitle": "This action extends the pickup window",
  "packageExtension.warningDescription": "After confirmation, the package will have 3 additional days before expiring again. This action is available only to House Account users.",
  "packageExtension.previewNote": "UI preview: persistence will be connected when the backend service becomes available.",
  "packageExtension.cancel": "Cancel",
  "packageExtension.confirm": "Extend 3 days",
  "packageExtension.previewToast": "Preview: the extension flow is ready to connect to the backend service.",

};
