import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { lockersService } from "@/services/locker.service"

import {
  INITIAL_LOCKER_FORM,
  LOCKER_DRAFT_STORAGE_KEY,
  LOCKER_DRAFT_VERSION,
  WIZARD_STEPS,
  type WizardStepId,
} from "./locker-create.config"
import type { LockerDraft, LockerFormState } from "./locker-create.types"
import {
  getApiErrorMessage,
  getValidationMessage,
  normalizeLockerForm,
  validateStep,
} from "./locker-create.utils"

function readDraft(): LockerDraft | null {
  try {
    const raw = localStorage.getItem(LOCKER_DRAFT_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as LockerDraft

    if (
      parsed.version !== LOCKER_DRAFT_VERSION ||
      !parsed.form ||
      !Array.isArray(parsed.selectedModuleIds)
    ) {
      localStorage.removeItem(LOCKER_DRAFT_STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    localStorage.removeItem(LOCKER_DRAFT_STORAGE_KEY)
    return null
  }
}

export function useLockerWizard() {
  const navigate = useNavigate()
  const draft = useMemo(readDraft, [])

  const [currentStep, setCurrentStep] = useState<WizardStepId>(() => {
    const draftStep = Number(draft?.currentStep)
    return WIZARD_STEPS.some((step) => step.id === draftStep)
      ? (draftStep as WizardStepId)
      : 1
  })
  const [form, setForm] = useState<LockerFormState>(
    () => draft?.form ?? INITIAL_LOCKER_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>(
    () => draft?.selectedModuleIds ?? [],
  )

  const hasMounted = useRef(false)

  const DATA_STEP_COUNT = WIZARD_STEPS.length - 1

  // Los primeros 5 pasos corresponden a captura de datos. El constructor es
  // una etapa final independiente y no debe "robar" porcentaje al formulario.
  // Por eso, al completar Preferencias ya mostramos 100% de configuración.
  const progress = useMemo(
    () => (Math.min(currentStep, DATA_STEP_COUNT) / DATA_STEP_COUNT) * 100,
    [currentStep],
  )

  const stepValidation = useMemo(() => {
    const validation = Object.fromEntries(
      WIZARD_STEPS.map((step) => [step.id, validateStep(step.id, form)]),
    ) as Record<number, { isValid: boolean; missingFields: string[] }>

    // El constructor se considera completo únicamente cuando existe al menos
    // un módulo seleccionado. Así el estado visual representa el locker real.
    validation[WIZARD_STEPS.length] = {
      isValid: selectedModuleIds.length > 0,
      missingFields: selectedModuleIds.length > 0 ? [] : ["modules"],
    }

    return validation
  }, [form, selectedModuleIds])

  const completedSteps = useMemo(
    () =>
      WIZARD_STEPS.filter((step) => {
        // Preferencias no tiene campos obligatorios: se marca completado cuando
        // el usuario realmente llegó a ese paso, no desde el primer render.
        if (step.id === DATA_STEP_COUNT) return currentStep >= DATA_STEP_COUNT
        return stepValidation[step.id]?.isValid
      }).map((step) => step.id),
    [currentStep, stepValidation],
  )

  const dataStepsComplete = useMemo(
    () =>
      WIZARD_STEPS.slice(0, DATA_STEP_COUNT).every(
        (step) => stepValidation[step.id]?.isValid,
      ),
    [stepValidation],
  )

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(form) !== JSON.stringify(INITIAL_LOCKER_FORM) ||
      selectedModuleIds.length > 0
    )
  }, [form, selectedModuleIds])

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    if (!isDirty) {
      localStorage.removeItem(LOCKER_DRAFT_STORAGE_KEY)
      return
    }

    const timer = window.setTimeout(() => {
      const payload: LockerDraft = {
        version: LOCKER_DRAFT_VERSION,
        currentStep,
        form,
        selectedModuleIds,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(LOCKER_DRAFT_STORAGE_KEY, JSON.stringify(payload))
    }, 350)

    return () => window.clearTimeout(timer)
  }, [currentStep, form, isDirty, selectedModuleIds])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || saving) return
      event.preventDefault()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty, saving])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(LOCKER_DRAFT_STORAGE_KEY)
  }, [])

  const resetWizard = useCallback(() => {
    setCurrentStep(1)
    setForm(INITIAL_LOCKER_FORM)
    setSelectedModuleIds([])
    setErrors({})
    clearDraft()
  }, [clearDraft])

  const updateForm = useCallback((patch: Partial<LockerFormState>) => {
    setForm((previous) => ({ ...previous, ...patch }))

    setErrors((previous) => {
      const next = { ...previous }
      Object.keys(patch).forEach((key) => delete next[key])
      return next
    })
  }, [])

  const updatePcLocker = useCallback(
    (patch: Partial<LockerFormState["pc_locker"]>) => {
      setForm((previous) => ({
        ...previous,
        pc_locker: { ...previous.pc_locker, ...patch },
      }))

      setErrors((previous) => {
        const next = { ...previous }
        Object.keys(patch).forEach((key) => delete next[`pc_locker.${key}`])
        return next
      })
    },
    [],
  )

  const updateApLocker = useCallback(
    (patch: Partial<LockerFormState["ap_locker"]>) => {
      setForm((previous) => ({
        ...previous,
        ap_locker: { ...previous.ap_locker, ...patch },
      }))

      setErrors((previous) => {
        const next = { ...previous }
        Object.keys(patch).forEach((key) => delete next[`ap_locker.${key}`])
        return next
      })
    },
    [],
  )

  const goToNextStep = useCallback(() => {
    const validation = validateStep(currentStep, form)

    if (!validation.isValid) {
      toast.error(getValidationMessage(validation))
      return
    }

    const nextStep = currentStep + 1
    if (nextStep <= WIZARD_STEPS.length) {
      setCurrentStep(nextStep as WizardStepId)
    }
  }, [currentStep, form])

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStepId)
    }
  }, [currentStep])

  const goToStep = useCallback(
    (targetStep: number) => {
      if (!WIZARD_STEPS.some((step) => step.id === targetStep)) return

      if (targetStep > currentStep) {
        for (let stepId = currentStep; stepId < targetStep; stepId += 1) {
          const validation = validateStep(stepId, form)
          if (!validation.isValid) {
            toast.error(
              `${WIZARD_STEPS[stepId - 1]?.name}: ${getValidationMessage(validation)}`,
            )
            setCurrentStep(stepId as WizardStepId)
            return
          }
        }
      }

      setCurrentStep(targetStep as WizardStepId)
    },
    [currentStep, form],
  )

  const handleSave = useCallback(async () => {
    if (saving) return false

    for (const step of WIZARD_STEPS) {
      const validation = validateStep(step.id, form)
      if (!validation.isValid) {
        toast.error(`${step.name}: ${getValidationMessage(validation)}`)
        setCurrentStep(step.id)
        return false
      }
    }

    if (selectedModuleIds.length === 0) {
      toast.error("Selecciona al menos un módulo para construir el locker")
      setCurrentStep(6)
      return false
    }

    const normalizedForm = normalizeLockerForm(form)

    const payload = {
      ...normalizedForm,
      id_locker_type: normalizedForm.id_locker_type as number,
      id_locker_model: normalizedForm.id_locker_model as number,
      id_locker_privacy: normalizedForm.id_locker_privacy as number,
      id_locker_environment: normalizedForm.id_locker_environment as number,
      id_status: normalizedForm.id_status as number,
      id_state: normalizedForm.id_state as number,
      id_city: normalizedForm.id_city as number,
      modules: selectedModuleIds,
    }

    try {
      setSaving(true)
      await lockersService.postLocker(payload)
      clearDraft()
      toast.success("Locker creado exitosamente")
      navigate("/locker")
      return true
    } catch (error) {
      console.error("[LockerAdd] Error creating locker:", error)
      toast.error(getApiErrorMessage(error))
      return false
    } finally {
      setSaving(false)
    }
  }, [clearDraft, form, navigate, saving, selectedModuleIds])

  return {
    currentStep,
    form,
    errors,
    setErrors,
    saving,
    selectedModuleIds,
    setSelectedModuleIds,
    progress,
    completedSteps,
    stepValidation,
    dataStepsComplete,
    isDirty,
    hasRestoredDraft: Boolean(draft),
    updateForm,
    updatePcLocker,
    updateApLocker,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleSave,
    resetWizard,
    clearDraft,
  }
}
