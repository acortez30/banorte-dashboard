export const orders: Record<string, string> = {
  // =====================================================
  // Orders
  // =====================================================
  "orders.title": "Packages",
  "orders.subtitle": "Manage and track all packages",
  "orders.metrics": "Package metrics",
  "orders.totalUsage": "Total usage",
  "orders.avgUsagePerHour": "Average usage per hour",
  "orders.peakHour": "Peak usage time",
  "orders.searchPlaceholder": "Search packages...",
  "orders.noResults":
    "No packages were found with the selected filters",

  "orders.metrics.totalDeliveries": "Total deliveries",
  "orders.metrics.avgPerHour": "Average per hour",
  "orders.metrics.peakHour": "Peak hour",

  "orders.exportFilename": "packages",

  // =====================================================
  // Orders tabs
  // =====================================================
  "orders.tabs.packages": "Packages",
  "orders.tabs.pendingValidation": "Packages to validate",


  // =====================================================
  // Package status tabs
  // =====================================================
  "orders.statusTabs.all": "All",
  "orders.statusTabs.inProgress": "In progress",
  "orders.statusTabs.expired": "Expired",
  "orders.statusTabs.scheduled": "Scheduled",
  "orders.statusTabs.completed": "Completed",
  "orders.statusTabs.canceled": "Canceled",
  "orders.statusTabs.failure": "Failures",
  // =====================================================
  // Package validation list
  // =====================================================
  "orders.validation.title": "Packages to validate",
  "orders.validation.subtitle":
    "Review packages that could not be assigned automatically or require confirmation.",

  "orders.validation.searchPlaceholder":
    "Search by tracking, recipient, locker, or package...",

  "orders.validation.review": "Review",
  "orders.validation.retry": "Retry",

  "orders.validation.empty":
    "No packages are pending validation.",

  "orders.validation.results": "Results",

  "orders.validation.loadError":
    "Unable to load packages requiring validation",

  "orders.validation.lockerNumber": "Locker #{id}",
  "orders.validation.doorUnknown": "Door not identified",

  // =====================================================
  // Missing detected values
  // =====================================================
  "orders.validation.missing.tracking":
    "Tracking not identified",

  "orders.validation.missing.recipient":
    "Recipient not identified",

  "orders.validation.missing.carrier":
    "Carrier not identified",

  // =====================================================
  // Package validation statuses
  // =====================================================
  "orders.validation.status.all": "All statuses",

  "orders.validation.status.UNASSIGNED":
    "Unassigned",

  "orders.validation.status.REVIEW":
    "Needs confirmation",

  "orders.validation.status.ASSIGNED":
    "Assigned",

  "orders.validation.status.IMAGE_ISSUE":
    "Image issue",

  // =====================================================
  // Package validation table
  // =====================================================
  "orders.validation.table.tracking": "Tracking",
  "orders.validation.table.recipient": "Recipient",
  "orders.validation.table.carrier": "Carrier",
  "orders.validation.table.locker": "Locker",
  "orders.validation.table.receivedAt": "Received at",
  "orders.validation.table.status": "Status",
  "orders.validation.table.actions": "Actions",

  // =====================================================
  // Package validation details
  // =====================================================
  "orders.validation.details.title":
    "Validate package",

  "orders.validation.details.back":
    "Back to packages to validate",

  "orders.validation.details.loading":
    "Loading package information...",

  "orders.validation.details.notFound":
    "Package not found",

  "orders.validation.details.notFoundDescription":
    "The requested package does not exist or is no longer available.",

  "orders.validation.details.invalidResponse":
    "The server returned an invalid response.",

  "orders.validation.details.loadError":
    "Unable to load the package information.",

  "orders.validation.details.saveError":
    "Unable to save the package validation.",

  "orders.validation.details.cachedDataWarning":
    "The information could not be refreshed. The latest available data is being displayed.",

  "orders.validation.details.packageNumber":
    "Package #{id}",

  // =====================================================
  // Validation status banners
  // =====================================================
  "orders.validation.details.banner.UNASSIGNED.title":
    "Unassigned package",

  "orders.validation.details.banner.UNASSIGNED.description":
    "The system could not find a recipient with a sufficient match. Select the correct user manually.",

  "orders.validation.details.banner.REVIEW.title":
    "Assignment requires confirmation",

  "orders.validation.details.banner.REVIEW.description":
    "The system assigned this package to a user, but the assignment requires operator confirmation.",

  "orders.validation.details.banner.IMAGE_ISSUE.title":
    "Image issue",

  "orders.validation.details.banner.IMAGE_ISSUE.description":
    "The image could not be analyzed correctly. Review the evidence and enter the available information manually.",

  "orders.validation.details.banner.ASSIGNED.title":
    "Package assigned",

  "orders.validation.details.banner.ASSIGNED.description":
    "The package already has an assigned recipient. Verify that the information is correct before continuing.",

  // =====================================================
  // Package image
  // =====================================================
  "orders.validation.details.packageImage":
    "Package image",

  "orders.validation.details.packageImageAlt":
    "Package photographic evidence",

  "orders.validation.details.imageCounter":
    "Image {current} of {total}",

  "orders.validation.details.imageUnavailable":
    "Image unavailable",

  "orders.validation.details.imageUnavailableDescription":
    "No package image was received or the file could not be loaded.",

  "orders.validation.details.imageActions.rotate":
    "Rotate image",

  "orders.validation.details.imageActions.download":
    "Download image",

  "orders.validation.details.imageActions.fullscreen":
    "View image in fullscreen",

  // =====================================================
  // Assignment information
  // =====================================================
  "orders.validation.details.assignmentInformation":
    "Assignment information",

  "orders.validation.details.currentAssignment":
    "Current assignment",

  "orders.validation.details.defaultUser":
    "Default locker user",

  "orders.validation.details.assignedUser":
    "Currently assigned user",

  "orders.validation.details.recipientSelection":
    "Select recipient",

  "orders.validation.details.selectRecipient":
    "Select a recipient",

  "orders.validation.details.loadingRecipients":
    "Loading recipients...",

  "orders.validation.details.selectRecipientError":
    "Select a valid recipient before continuing.",

  "orders.validation.details.suggested":
    "Suggested",

  "orders.validation.details.suggestedCandidates":
    "Suggested recipients",

  "orders.validation.details.userNumber":
    "User #{id}",

  // =====================================================
  // Package metadata
  // =====================================================
  "orders.validation.details.packageMetadata":
    "Data detected on the label",

  "orders.validation.details.fieldNotDetected":
    "This value was not detected. Enter it manually.",

  // Fields
  "orders.validation.details.fields.carrier":
    "Carrier",

  "orders.validation.details.fields.tracking":
    "Tracking",

  "orders.validation.details.fields.recipient":
    "Recipient",

  "orders.validation.details.fields.phone":
    "Phone",

  "orders.validation.details.fields.sender":
    "Sender",

  "orders.validation.details.fields.unit":
    "Unit or apartment",

  "orders.validation.details.fields.address":
    "Address",

  // Placeholders
  "orders.validation.details.placeholders.carrier":
    "Enter the carrier",

  "orders.validation.details.placeholders.tracking":
    "Enter the tracking number",

  "orders.validation.details.placeholders.recipient":
    "Enter the recipient name",

  "orders.validation.details.placeholders.phone":
    "Enter the phone number",

  "orders.validation.details.placeholders.sender":
    "Enter the sender",

  "orders.validation.details.placeholders.unit":
    "Enter the unit or apartment",

  "orders.validation.details.placeholders.address":
    "Enter the delivery address",

  // =====================================================
  // Location information
  // =====================================================
  "orders.validation.details.locationInformation":
    "Location information",

  "orders.validation.details.propertyId":
    "Property ID",

  "orders.validation.details.lockerId":
    "Locker ID",

  "orders.validation.details.door":
    "Door",

  "orders.validation.details.column":
    "Column",

  "orders.validation.details.position":
    "Position",

  "orders.validation.details.dimensionId":
    "Dimension ID",

  // =====================================================
  // Package information
  // =====================================================
  "orders.validation.details.packageInformation":
    "Package information",

  "orders.validation.details.packageId":
    "Package ID",

  "orders.validation.details.serviceId":
    "Service ID",

  "orders.validation.details.packageCodeId":
    "Package code ID",

  "orders.validation.details.detectRecipientId":
    "Recipient detection ID",

  "orders.validation.details.registrationDate":
    "Registration date",

  // =====================================================
  // Validation actions
  // =====================================================
  "orders.validation.details.cancel":
    "Cancel",

  "orders.validation.details.confirmAssignment":
    "Confirm assignment",

  "orders.validation.details.assignAndValidate":
    "Assign and validate",

  "orders.validation.details.validatedMessage":
    "The package was assigned and validated successfully.",

  // =====================================================
  // Order table
  // =====================================================
  "orderTable.tracking": "Tracking No.",
  "orderTable.locker": "Locker",
  "orderTable.email": "Email",
  "orderTable.door": "Door",
  "orderTable.status": "Status",
  "orderTable.receivedDate": "Received date",
  "orderTable.withdrawnDate": "Picked up date",
  "orderTable.generateQR": "Generate QR",
  "orderTable.delivered": "Delivered",
  "orderTable.inTransit": "In transit",
  "orderTable.processing": "Processing",
  "orderTable.expired": "Expired",
  "orderTable.scheduled": "Scheduled",
  "orderTable.offeringType": "Transaction type",

  // =====================================================
  // Order metrics
  // =====================================================
  "orderMetrics.delivered": "Delivered",
  "orderMetrics.collected": "Collected",
  "orderMetrics.expired": "Expired",
  "orderMetrics.scheduled": "Scheduled",

  // =====================================================
  // Order statuses
  // =====================================================
  "order.status.completed": "Completed",
  "order.status.expired": "Expired",
  "order.status.inLocker": "In locker",
  "order.status.scheduled": "Scheduled",
  "order.status.returned": "Returned",
  "order.status.canceled": "Canceled",
  "order.status.canceledPicked": "Canceled and picked up",
  "orders.validation.details.banner.undefined.title":"",
  "orders.validation.details.banner.undefined.description":"",


  "orders.query.title": "Sort and priority",
  "orders.query.sort.status": "Sort by Status",
  "orders.query.sort.default": "Sort by Default",
  "orders.query.sort.registrationDate": "Registration date",
  "orders.query.sort.pickupDate": "Pickup Date",

  "orders.query.direction.asc":"Ascending",
  "orders.query.direction.desc":"Descending",
  "orders.query.direction.newest":"Newest first",
  "orders.query.direction.oldest":"Oldest first",
  "orders.query.direction.lifecycleForward":"Start → end",
  "orders.query.direction.lifecycleBackward":"End → start",
  "orders.query.filter.status":"Filter by status",

  "orders.query.priority.none":"No priority",
  "orders.query.priority.inProgress":"In progress",
  "orders.query.priority.failure":"Failure",
  "orders.query.priority.scheduled":"Scheduled",
  "orders.query.priority.inLocker":"In locker",
  "orders.query.priority.completed":"Completed",
  "orders.query.priority.expired":"Expired",
  "orders.query.priority.returned":"Returned",
  "orders.query.priority.canceled":"Canceled",
  "orders.query.priority.canceledPicked":"Canceled and picked up",
  "orders.query.priority.pendingSurchargePayment":"Pending surcharge payment",
  "orders.query.priority.pendingValidate":"Pending validation",
  "orders.query.priority.pendingPayment":"Pending payment",
  "orders.query.priority.inTransit":"In transit",
  "orders.query.priority.expiredInLocker":"Expired in locker",
  "orders.query.priority.expiredCollected":"Expired and collected",
  "orders.query.reset":"Reset sorting",
    "orders.metrics.peakHourTooltip":"Hour of the day with the highest number of deliveries registered in the selected period.",
  "orders.metrics.avgPerHourTooltip":"Average of deliveries registered per hour in the selected period.",
  "orders.metrics.totalDeliveriesTooltip":"Total number of deliveries registered in the selected period.",
  "orders.query.description":
  "Sort orders or bring the ones requiring more attention to the top.",

"orders.query.activeFilter": "active setting",
"orders.query.activeFilters": "active settings",

"orders.query.sortHelp":
  "Choose the criteria used to sort the list.",

"orders.query.directionHelp":
  "Choose the direction in which results are displayed.",

"orders.query.selectSortFirst":
  "Select a sorting criteria first.",

"orders.query.directionDisabled":
  "Direction becomes available after selecting a sorting criteria.",

"orders.query.priorityHelp":
  "Orders with this status will appear first without hiding the others.",

"orders.query.sortBy": "Sort by",
"orders.query.direction": "Direction",
"orders.query.priority": "Show first",

"orders.query.priorityTooltip":
  "This is not a filter: it moves packages with the selected status to the top while keeping all other packages visible.",

  "orders.statusTabs.filterLabel": "Filter by status",
  "orders.statusTabs.filterHelp": "Choose which package group you want to view.",
  "orders.statusTabs.active": "Active",

  "orders.toolbar.title": "Filters and organization",
  "orders.toolbar.description":
    "Search, filter and organize the list from one place.",
  "orders.toolbar.activeSingle": "active",
  "orders.toolbar.activePlural": "active",
  "orders.toolbar.clearAll": "Clear all",
  "orders.toolbar.search": "Search",
  "orders.toolbar.searchTrackingPlaceholder": "Search tracking number...",
  "orders.toolbar.searchEmailPlaceholder": "Search email...",
  "orders.toolbar.searchByTracking": "Tracking",
  "orders.toolbar.searchByEmail": "Email",
  "orders.packagePanel.title": "Filters and organization",
  "orders.packagePanel.description":
    "Search, filter and organize packages from one place.",
  "orders.packagePanel.status": "Status",
  "orders.packagePanel.statusHelp": "Choose the group you want to view.",
  "orders.toolbar.applied": "Applied",

  "orders.filters.title": "Filters",
  "orders.filters.description": "Narrow the results before sorting or prioritizing the list.",
  "orders.filters.active": "active",
  "orders.filters.search": "Search",
  "orders.filters.searchPlaceholder": "Search package...",
  "orders.filters.clearSearch": "Clear search",
  "orders.filters.service": "Transaction type",
  "orders.filters.allServices": "All transactions",
  "orders.filters.dateRange": "Date range",
  "orders.filters.clear": "Clear filters",
  "orders.filters.applied": "Applied filters",

};