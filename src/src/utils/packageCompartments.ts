export interface PackageCompartmentLike {
  id_locker_dimension?: number | null;
  id_compartment_dimension?: number | null;
  door_number?: string | number | null;
  position?: string | null;
  compartment_name?: string | null;
  compartment_size?: string | null;
}

export function getPackageCompartments(item: any): PackageCompartmentLike[] {
  if (Array.isArray(item?.compartments) && item.compartments.length > 0) {
    return item.compartments;
  }

  const doorNumber = item?.door_number ?? item?.door;

  if (doorNumber === null || doorNumber === undefined || doorNumber === "") {
    return [];
  }

  return [
    {
      id_locker_dimension: item?.id_locker_dimension ?? null,
      id_compartment_dimension: item?.id_compartment_dimension ?? null,
      door_number: doorNumber,
      position: item?.position ?? null,
      compartment_name: item?.compartment_name ?? null,
      compartment_size: item?.compartment_size ?? null,
    },
  ];
}

export function formatPackageCompartments(
  item: any,
  fallback = "---"
): string {
  const compartments = getPackageCompartments(item);

  if (compartments.length === 0) return fallback;

  return compartments
    .map((compartment) => {
      const door = compartment.door_number ?? fallback;
      const position = compartment.position?.trim();
      return position ? `#${door} · ${position}` : `#${door}`;
    })
    .join(", ");
}
