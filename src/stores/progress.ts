import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { progressApi } from '../api/progress.api'
import type { StoredProgress } from '../types/progress'

// состояние прохождения инструкции
export const useProgressStore = defineStore('progress', () => {
  const lastCompletedStep = ref(0)
  const activeStepNumber = ref(1)
  const isCompleted = ref(false)

  const isSaving = ref(false)

  // идентификатор гостевой сессии
  function getSessionId(): string {
    const key = 'guide-list-session'

    let sessionId = localStorage.getItem(key)

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem(key, sessionId)
    }

    return sessionId
  }

  // ключ локального сохранения инструкции
  function getStorageKey(instructionId: number): string {
    return `guide-list-progress-${instructionId}`
  }

  // сохраняем состояние в браузере
  function saveLocalProgress(instructionId: number) {
    const data: StoredProgress = {
      lastCompletedStep: lastCompletedStep.value,
      activeStepNumber: activeStepNumber.value,
      isCompleted: isCompleted.value,
    }

    localStorage.setItem(getStorageKey(instructionId), JSON.stringify(data))
  }

  // загрузка сохраненного прогресса
  function loadProgress(instructionId: number, totalSteps: number) {
    // начальное состояние
    lastCompletedStep.value = 0
    activeStepNumber.value = 1
    isCompleted.value = false

    if (totalSteps <= 0) return

    const key = getStorageKey(instructionId)
    const saved = localStorage.getItem(key)

    if (!saved) return

    try {
      const data: Partial<StoredProgress> = JSON.parse(saved)

      // проверяем кол-во выполненных шагов
      const savedLastStep = Number(data.lastCompletedStep)

      const safeLastStep = Number.isFinite(savedLastStep) ? Math.trunc(savedLastStep) : 0

      lastCompletedStep.value = Math.min(Math.max(safeLastStep, 0), totalSteps)

      // проверяем статус завершения
      isCompleted.value = data.isCompleted === true && lastCompletedStep.value === totalSteps

      // проверяем номер активного шага
      const savedActiveStep = Number(data.activeStepNumber)

      const safeActiveStep = Number.isFinite(savedActiveStep)
        ? Math.trunc(savedActiveStep)
        : lastCompletedStep.value + 1

      const maxActiveStep = Math.min(lastCompletedStep.value + 1, totalSteps)

      activeStepNumber.value = isCompleted.value
        ? totalSteps
        : Math.min(Math.max(safeActiveStep, 1), maxActiveStep)

      // сохраняем уже проверенные данные
      saveLocalProgress(instructionId)
    } catch (error) {
      console.warn('Не удалось прочитать сохранённый прогресс:', error)

      // удаляем повреждённую запись
      localStorage.removeItem(key)
    }
  }

  // сбрасываем прогресс инструкции
  async function resetProgress(instructionId: number) {
    lastCompletedStep.value = 0
    activeStepNumber.value = 1
    isCompleted.value = false

    // сохраняем сброшенное состояние в браузере
    saveLocalProgress(instructionId)

    // отправляем обновлённый прогресс на backend
    await syncProgress(instructionId)
  }

  // проверка, разрешено ли открыть шаг
  function canOpenStep(stepNumber: number): boolean {
    return stepNumber <= lastCompletedStep.value + 1
  }

  // переходим к выбранному шагу
  function selectStep(stepNumber: number, instructionId: number) {
    if (!canOpenStep(stepNumber)) return

    activeStepNumber.value = stepNumber
    saveLocalProgress(instructionId)
  }

  // отправляем прогресс на backend
  async function syncProgress(instructionId: number) {
    isSaving.value = true

    try {
      await progressApi.update({
        instruction_id: instructionId,
        last_completed_step: lastCompletedStep.value,
        is_completed: isCompleted.value,
        session_id: getSessionId(),
      })
    } catch (error) {
      // локальный прогресс сохраняется даже при ошибке сети
      console.error('Не удалось отправить прогресс:', error)
    } finally {
      isSaving.value = false
    }
  }

  // подтверждаем текущий шаг
  async function completeCurrentStep(instructionId: number, totalSteps: number) {
    const current = activeStepNumber.value

    if (!canOpenStep(current)) return

    // если шаг выполнен, переходим дальше
    if (current <= lastCompletedStep.value) {
      if (current < totalSteps) {
        activeStepNumber.value = current + 1
      }

      saveLocalProgress(instructionId)
      return
    }

    // нельзя пропустить шаг
    if (current !== lastCompletedStep.value + 1) return

    lastCompletedStep.value = current

    if (lastCompletedStep.value === totalSteps) {
      isCompleted.value = true
    } else {
      activeStepNumber.value = current + 1
    }

    saveLocalProgress(instructionId)

    // синхронизируем прогресс с backend
    await syncProgress(instructionId)
  }

  // процент выполнения
  const percentage = computed(() => {
    return lastCompletedStep.value
  })

  return {
    lastCompletedStep,
    activeStepNumber,
    isCompleted,
    isSaving,
    percentage,
    loadProgress,
    resetProgress,
    canOpenStep,
    selectStep,
    completeCurrentStep,
  }
})
