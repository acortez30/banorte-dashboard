import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { lockersService } from "@/services/locker.service"
import { systemService } from "@/services/system.service"

import type {
  City,
  LockerEnvironment,
  LockerModel,
  LockerModule,
  LockerPrivacy,
  LockerType,
  RawLockerModule,
  State,
} from "@/types/Locker.types"

import { convertTemplate } from "./locker-create.utils"

interface CatalogState {
  lockerTypes: LockerType[]
  lockerEnvironments: LockerEnvironment[]
  lockerModels: LockerModel[]
  lockerPrivacy: LockerPrivacy[]
  states: State[]
  cities: City[]
  modules: LockerModule[]
  loading: boolean
  loadingCities: boolean
  error: string | null
}

const INITIAL_STATE: CatalogState = {
  lockerTypes: [],
  lockerEnvironments: [],
  lockerModels: [],
  lockerPrivacy: [],
  states: [],
  cities: [],
  modules: [],
  loading: true,
  loadingCities: false,
  error: null,
}

export function useLockerCatalogs() {
  const [state, setState] = useState<CatalogState>(INITIAL_STATE)
  const [reloadKey, setReloadKey] = useState(0)
  const cityRequestId = useRef(0)

  useEffect(() => {
    let cancelled = false

    async function loadCatalogs() {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }))

      try {
        const [
          types,
          environments,
          models,
          privacy,
          statesResponse,
          modulesResponse,
        ] = await Promise.all([
          lockersService.getLockerTypes(),
          lockersService.getLockerEnvironments(),
          lockersService.getLockerModels(),
          lockersService.getLockerPrivacy(),
          systemService.getStates(),
          lockersService.getAllModules(),
        ])

        if (cancelled) return

        const modules = (modulesResponse.modules ?? []).map(
          (module: RawLockerModule) => ({
            id_locker_module: module.id_locker_module,
            name_locker_module: module.name_locker_module,
            description: module.description,
            door_total: module.door_total,
            template: convertTemplate(module.template_module),
          } satisfies LockerModule),
        )

        setState((previous) => ({
          ...previous,
          lockerTypes: types.locker_types ?? [],
          lockerEnvironments: environments.lockers_environment ?? [],
          lockerModels: models.locker_models ?? [],
          lockerPrivacy: privacy.lockers_privacy ?? [],
          states: statesResponse.cities ?? [],
          modules,
          loading: false,
          error: null,
        }))
      } catch (error) {
        if (cancelled) return

        console.error("[useLockerCatalogs] Error loading catalogs:", error)
        setState((previous) => ({
          ...previous,
          loading: false,
          error: "No fue posible cargar los catálogos del locker.",
        }))
      }
    }

    loadCatalogs()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const retry = useCallback(() => {
    setReloadKey((value) => value + 1)
  }, [])

  const loadCities = useCallback(async (stateId: number) => {
    const requestId = ++cityRequestId.current

    if (!stateId) {
      setState((previous) => ({ ...previous, cities: [] }))
      return
    }

    setState((previous) => ({
      ...previous,
      cities: [],
      loadingCities: true,
    }))

    try {
      const response = await systemService.getCitiesByState(stateId)
      if (requestId !== cityRequestId.current) return

      setState((previous) => ({
        ...previous,
        cities: response.cities ?? [],
        loadingCities: false,
      }))
    } catch (error) {
      if (requestId !== cityRequestId.current) return

      console.error("[useLockerCatalogs] Error loading cities:", error)
      setState((previous) => ({
        ...previous,
        cities: [],
        loadingCities: false,
      }))
      toast.error("No fue posible cargar las ciudades")
    }
  }, [])

  return {
    ...state,
    retry,
    loadCities,
  }
}
