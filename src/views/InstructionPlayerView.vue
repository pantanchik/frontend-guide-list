<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { instructionsApi } from '../api/instructions.api.ts'
import { useProgressStore } from '../stores/progress.ts'

import type { Instruction } from '../types/instruction.ts'

import StepNavigation from '../components/instructions/StepNavigation.vue'
import StepContent from '../components/instructions/StepContent.vue'

const route = useRoute()
const router = useRouter()

const progress = useProgressStore()

const instruction = ref<Instruction | null>(null)

const isLoading = ref(true)
const error = ref<string | null>(null)
const isStepConfirmed = ref(false)

// сортировка шагов по номеру
const sortedSteps = computed(() => {
  return [...(instruction.value?.steps ?? [])].sort((a, b) => a.step_number - b.step_number)
})

// кол-во шагов
const totalSteps = computed(() => sortedSteps.value.length)

// текущий шаг
const currentStep = computed(() => {
  return sortedSteps.value.find((step) => step.step_number === progress.activeStepNumber) ?? null
})

// проверка, был ли шаг выполнен
const alreadyCompleted = computed(() => {
  return !!currentStep.value && currentStep.value.step_number <= progress.lastCompletedStep
})

// процент выполнения
const progressPercentage = computed(() => {
  if (!totalSteps.value) return 0

  return Math.round((progress.lastCompletedStep / totalSteps.value) * 100)
})

// проверка, можно ли пройти дальше
const canContinue = computed(() => {
  return alreadyCompleted.value || isStepConfirmed.value
})

// название кнопки
const nextButtonLabel = computed(() => {
  if (progress.isCompleted) return 'Инструкция завершена'

  if (progress.activeStepNumber === totalSteps.value) {
    return 'Завершить инструкцию'
  }

  return 'Следующий шаг'
})

// загружаем инструкцию
async function loadInstruction() {
  const id = Number(route.params.id)

  instruction.value = null
  error.value = null
  isLoading.value = true

  if (!Number.isInteger(id) || id <= 0) {
    error.value = 'Некорректный номер инструкции'
    isLoading.value = false
    return
  }

  try {
    instruction.value = await instructionsApi.getById(id)

    if (!instruction.value.steps.length) {
      error.value = 'В этой инструкции пока нет шагов'
      return
    }

    progress.loadProgress(id, instruction.value.steps.length)

    isStepConfirmed.value = progress.activeStepNumber <= progress.lastCompletedStep
  } catch (err) {
    console.error('Ошибка загрузки инструкции:', err)
    error.value = 'Не удалось загрузить инструкцию'
  } finally {
    isLoading.value = false
  }
}

// выбираем шаг из списка
function handleSelectStep(stepNumber: number) {
  if (!instruction.value) return

  progress.selectStep(stepNumber, instruction.value.id)

  isStepConfirmed.value = stepNumber <= progress.lastCompletedStep
}

// переход к следующему шагу
async function handleNextStep() {
  if (!instruction.value || !currentStep.value) return
  if (!canContinue.value || progress.isCompleted) return

  await progress.completeCurrentStep(instruction.value.id, totalSteps.value)

  // если инструкция завершена, возврат к предпросмотру
  if (progress.isCompleted) {
    router.push({
      name: 'instruction-preview',
      params: { id: instruction.value.id },
    })

    return
  }

  isStepConfirmed.value = progress.activeStepNumber <= progress.lastCompletedStep
}

// сбрасываем временное подтверждение при смене шага
watch(
  () => progress.activeStepNumber,
  (stepNumber) => {
    isStepConfirmed.value = stepNumber <= progress.lastCompletedStep
  },
)

// следим за ID инструкции в маршруте
watch(() => route.params.id, loadInstruction, { immediate: true })
</script>

<template>
  <main class="instruction-player-page">
    <!-- Загрузка -->
    <div v-if="isLoading" class="player-state">
      <div class="player-loader"></div>
      <p>Загружаем инструкцию...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error || !instruction" class="player-state">
      <h1>Не удалось открыть инструкцию</h1>
      <p>{{ error }}</p>

      <RouterLink
        :to="{ name: 'instruction-preview', params: { id: route.params.id } }"
        class="player-back-button"
      >
        Вернуться к инструкции
      </RouterLink>
    </div>

    <!-- Основной интерфейс -->
    <div v-else class="player-container">
      <!-- Прогресс -->
      <section class="player-progress">
        <div class="player-progress-info">
          <span> {{ progress.lastCompletedStep }} ИЗ {{ totalSteps }} ШАГОВ ВЫПОЛНЕНО </span>

          <strong>{{ progressPercentage }}%</strong>
        </div>

        <div
          class="player-progress-track"
          role="progressbar"
          :aria-valuenow="progressPercentage"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Выполнено ${progressPercentage}% инструкции`"
        >
          <div class="player-progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
      </section>

      <!-- Основная область -->
      <div class="player-layout">
        <StepNavigation
          :steps="sortedSteps"
          :active-step-number="progress.activeStepNumber"
          :last-completed-step="progress.lastCompletedStep"
          @select="handleSelectStep"
        />

        <section class="player-main">
          <StepContent
            v-if="currentStep"
            :key="currentStep.step_number"
            :step="currentStep"
            :total-steps="totalSteps"
            :confirmed="isStepConfirmed"
            :already-completed="alreadyCompleted"
            @update:confirmed="isStepConfirmed = $event"
          />

          <div v-else class="player-state">
            <p>Не удалось найти текущий шаг. Попробуйте обновить страницу.</p>
          </div>

          <div class="player-actions">
            <span v-if="progress.isSaving" class="player-saving"> Сохраняем прогресс... </span>

            <span v-else class="player-step-counter">
              {{ String(progress.activeStepNumber).padStart(2, '0') }}
              / {{ String(totalSteps).padStart(2, '0') }}
            </span>

            <button
              class="player-next-button"
              type="button"
              :disabled="!canContinue || progress.isCompleted"
              @click="handleNextStep"
            >
              {{ nextButtonLabel }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss" src="../assets/styles/instruction-player.scss"></style>
