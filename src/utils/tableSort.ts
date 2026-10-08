export type SortDirection = "asc" | "desc";

export type SortValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export function compareSortValues(
  left: SortValue,
  right: SortValue,
) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;

  const normalizedLeft =
    left instanceof Date
      ? left.getTime()
      : typeof left === "boolean"
        ? Number(left)
        : left;

  const normalizedRight =
    right instanceof Date
      ? right.getTime()
      : typeof right === "boolean"
        ? Number(right)
        : right;

  if (
    typeof normalizedLeft === "number" &&
    typeof normalizedRight === "number"
  ) {
    return normalizedLeft - normalizedRight;
  }

  return String(normalizedLeft).localeCompare(
    String(normalizedRight),
    "es-MX",
    {
      numeric: true,
      sensitivity: "base",
    },
  );
}

export function sortRows<T, K extends string>(
  rows: T[],
  key: K,
  direction: SortDirection,
  accessors: Record<K, (row: T) => SortValue>,
) {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...rows].sort((left, right) => {
    const result = compareSortValues(
      accessors[key](left),
      accessors[key](right),
    );

    return result * multiplier;
  });
}
