<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { Step } from '../../types/instruction'

const props = defineProps<{
  steps: Step[]
  activeStepNumber: number
  lastCompletedStep: number
}>()

const emit = defineEmits<{
  select: [stepNumber: number]
}>()

const isMobileOpen = ref(false)
const stepList = ref<HTMLElement | null>(null)

// количество выполненных шагов
const completedCount = computed(() => props.lastCompletedStep)

// заблокирован ли шаг
function isLocked(stepNumber: number) {
  return stepNumber > props.lastCompletedStep + 1
}

// выбор шага
function selectStep(stepNumber: number) {
  if (isLocked(stepNumber)) return

  emit('select', stepNumber)
  isMobileOpen.value = false
}

// открытие и закрытие списка шагов на телефонах
async function toggleMobileList() {
  isMobileOpen.value = !isMobileOpen.value

  if (isMobileOpen.value) {
    await nextTick()

    const activeElement = stepList.value?.querySelector(
      `[data-step-number="${props.activeStepNumber}"]`,
    )

    activeElement?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <aside class="step-navigation">
    <button
      class="step-navigation-mobile-toggle"
      type="button"
      :aria-expanded="isMobileOpen"
      @click="toggleMobileList"
    >
      <span>
        <small>ТЕКУЩИЙ ШАГ</small>
        <strong>
          {{ String(activeStepNumber).padStart(2, '0') }}
          / {{ String(steps.length).padStart(2, '0') }}
        </strong>
      </span>

      <span class="step-navigation-toggle-icon">
        {{ isMobileOpen ? '−' : '+' }}
      </span>
    </button>

    <div class="step-navigation-content" :class="{ 'is-open': isMobileOpen }">
      <div class="step-navigation-heading">
        <span>СОДЕРЖАНИЕ</span>
        <span>{{ completedCount }}/{{ steps.length }}</span>
      </div>

      <div ref="stepList" class="step-navigation-list">
        <button
          v-for="step in steps"
          :key="step.id"
          :data-step-number="step.step_number"
          class="step-navigation-item"
          :class="{
            'is-active': activeStepNumber === step.step_number,
            'is-completed': step.step_number <= lastCompletedStep,
            'is-locked': isLocked(step.step_number),
          }"
          type="button"
          :disabled="isLocked(step.step_number)"
          @click="selectStep(step.step_number)"
        >
          <span class="step-navigation-number">
            <template v-if="step.step_number <= lastCompletedStep"> ✓ </template>
            <template v-else-if="isLocked(step.step_number)"> · </template>
            <template v-else>
              {{ String(step.step_number).padStart(2, '0') }}
            </template>
          </span>

          <span class="step-navigation-title">
            {{ step.title }}
          </span>

          <span v-if="isLocked(step.step_number)" class="step-lock">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>
