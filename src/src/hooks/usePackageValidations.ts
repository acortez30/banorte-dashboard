import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  extractVisionPackageApiItems,
  mapVisionPackage,
} from "@/mappers/package-validation.mapper";
import { packageService } from "@/services/package.service";

import type {
  PackageValidation,
  VisionAssignmentStatus,
  VisionPackageApiItem,
} from "@/types/package-validation";

interface UsePackageValidationsOptions {
  idProperty?: number;
  idLocker?: number;
  language?: "es" | "en";
  refetchIntervalMs?: number;
}

/**
 * Estados que aparecerán en la tabla.
 *
 * Cada estado se consulta de manera independiente porque
 * el endpoint solamente recibe un status por petición.
 */
const VALIDATION_STATUSES: VisionAssignmentStatus[] = [
  "UNASSIGNED",
  "REVIEW",
  "IMAGE_ISSUE",
  "ASSIGNED",
];

/**
 * En caso de que el backend coloque el mismo paquete
 * en más de una consulta, se conserva el estado más avanzado.
 */
const STATUS_PRIORITY: Record<
  VisionAssignmentStatus,
  number
> = {
  UNASSIGNED: 1,
  IMAGE_ISSUE: 2,
  REVIEW: 3,
  ASSIGNED: 4,
};

function toTimestamp(
  value: string,
): number {
  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function dedupeValidations(
  validations: PackageValidation[],
): PackageValidation[] {
  const validationMap =
    new Map<
      number,
      PackageValidation
    >();

  validations.forEach(
    (validation) => {
      const current =
        validationMap.get(
          validation.idPackage,
        );

      if (!current) {
        validationMap.set(
          validation.idPackage,
          validation,
        );

        return;
      }

      const currentPriority =
        STATUS_PRIORITY[
          current.status
        ];

      const nextPriority =
        STATUS_PRIORITY[
          validation.status
        ];

      if (
        nextPriority >
        currentPriority
      ) {
        validationMap.set(
          validation.idPackage,
          validation,
        );

        return;
      }

      if (
        nextPriority ===
          currentPriority &&
        toTimestamp(
          validation.registrationDate,
        ) >=
          toTimestamp(
            current.registrationDate,
          )
      ) {
        validationMap.set(
          validation.idPackage,
          validation,
        );
      }
    },
  );

  return Array.from(
    validationMap.values(),
  );
}

export function usePackageValidations({
  idProperty,
  idLocker,
  language = "es",
  refetchIntervalMs = 30_000,
}: UsePackageValidationsOptions) {
  const mountedRef =
    useRef(false);

  const fetchingRef =
    useRef(false);

  const [
    validations,
    setValidations,
  ] = useState<
    PackageValidation[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<Error | null>(
    null,
  );

  const fetchValidations =
    useCallback(
      async (
        showInitialLoader = false,
      ) => {
        if (
          fetchingRef.current
        ) {
          return;
        }

        fetchingRef.current =
          true;

        if (showInitialLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        try {
          /**
           * Se realiza una petición por cada estado:
           *
           * /unassigned?status=UNASSIGNED
           * /unassigned?status=REVIEW
           * /unassigned?status=IMAGE_ISSUE
           * /unassigned?status=ASSIGNED
           */
          const responses =
            await Promise.allSettled(
              VALIDATION_STATUSES.map(
                (status) =>
                  packageService.getPackageUnassigned(
                    {
                      status,
                      id_property:
                        idProperty,
                      id_locker:
                        idLocker,
                      language,
                    },
                  ),
              ),
            );

          const successfulResponses =
            responses.filter(
              (
                response,
              ): response is PromiseFulfilledResult<
                Awaited<
                  ReturnType<
                    typeof packageService.getPackageUnassigned
                  >
                >
              > =>
                response.status ===
                "fulfilled",
            );

          if (
            successfulResponses
              .length === 0
          ) {
            const firstFailure =
              responses.find(
                (
                  response,
                ): response is PromiseRejectedResult =>
                  response.status ===
                  "rejected",
              );

            throw firstFailure?.reason instanceof
              Error
              ? firstFailure.reason
              : new Error(
                  "No fue posible cargar los paquetes",
                );
          }

          const failedStatuses =
            responses.flatMap(
              (
                response,
                index,
              ) =>
                response.status ===
                "rejected"
                  ? [
                      VALIDATION_STATUSES[
                        index
                      ],
                    ]
                  : [],
            );

          if (
            failedStatuses.length >
            0
          ) {
            console.warn(
              "Some package validation statuses could not be loaded:",
              failedStatuses,
            );
          }

          const apiItems =
            responses.flatMap(
              (
                response,
                index,
              ): VisionPackageApiItem[] => {
                if (
                  response.status ===
                  "rejected"
                ) {
                  return [];
                }

                const requestedStatus =
                  VALIDATION_STATUSES[
                    index
                  ];

                return extractVisionPackageApiItems(
                  response.value,
                ).map(
                  (item) => ({
                    ...item,

                    /**
                     * Fallback por si el backend no incluye
                     * assignment_status en algún registro.
                     */
                    assignment_status:
                      item.assignment_status ??
                      requestedStatus,
                  }),
                );
              },
            );

          const mapped =
            apiItems.map(
              mapVisionPackage,
            );

          const uniqueValidations =
            dedupeValidations(
              mapped,
            ).sort(
              (
                firstValidation,
                secondValidation,
              ) =>
                toTimestamp(
                  secondValidation.registrationDate,
                ) -
                toTimestamp(
                  firstValidation.registrationDate,
                ),
            );

          if (
            !mountedRef.current
          ) {
            return;
          }

          setValidations(
            uniqueValidations,
          );

          setError(null);
        } catch (
          requestError
        ) {
          console.error(
            "Error loading vision package validations:",
            requestError,
          );

          if (
            !mountedRef.current
          ) {
            return;
          }

          setError(
            requestError instanceof
              Error
              ? requestError
              : new Error(
                  "Unable to load package validations",
                ),
          );

          if (
            showInitialLoader
          ) {
            setValidations([]);
          }
        } finally {
          fetchingRef.current =
            false;

          if (
            mountedRef.current
          ) {
            setLoading(false);
            setRefreshing(false);
          }
        }
      },
      [
        idLocker,
        idProperty,
        language,
      ],
    );

  useEffect(() => {
    mountedRef.current = true;

    void fetchValidations(
      true,
    );

    const intervalId =
      window.setInterval(
        () => {
          void fetchValidations(
            false,
          );
        },
        refetchIntervalMs,
      );

    return () => {
      mountedRef.current =
        false;

      window.clearInterval(
        intervalId,
      );
    };
  }, [
    fetchValidations,
    refetchIntervalMs,
  ]);

  return {
    validations,
    loading,
    refreshing,
    error,
    refetch: () =>
      fetchValidations(false),
  };
}