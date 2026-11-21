<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { instructionsApi } from '../api/instructions.api'
import type { Instruction } from '../types/instruction'

import { getStepsLabel } from '../components/declension'

const route = useRoute()
const router = useRouter()

const instruction = ref<Instruction | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const stepsCount = computed(() => instruction.value?.steps.length ?? 0)

const percentage = computed(() => {
  // TODO
  return 0
})

const remainingSteps = computed(() => {
  return Math.max(stepsCount.value, 0)
})

async function loadInstruction() {
  const id = Number(route.params.id)

  instruction.value = null
  error.value = null

  if (!Number.isInteger(id) || id <= 0) {
    error.value = 'Некорректный номер инструкции'
    isLoading.value = false
    return
  }

  isLoading.value = true

  try {
    instruction.value = await instructionsApi.getById(id)
  } catch (err) {
    console.error('Ошибка загрузки инструкции:', err)
    error.value = 'Не удалось загрузить инструкцию. Возможно, она не существует.'
  } finally {
    isLoading.value = false
  }
}

function startInstruction() {
  if (!instruction.value) return

  router.push({
    name: 'instruction-player',
    params: { id: instruction.value.id },
  })
}

watch(() => route.params.id, loadInstruction, { immediate: true })
</script>

<template>
  <main class="instruction-preview-page">
    <div v-if="isLoading" class="preview-state">
      <span class="preview-eyebrow">GUIDE LIST / LOADING</span>
      <div class="preview-loader"></div>
      <h1>Загружаем инструкцию</h1>
      <p>Подготавливаем руководство...</p>
    </div>

    <div v-else-if="error || !instruction" class="preview-state">
      <span class="preview-eyebrow">GUIDE LIST / ERROR</span>
      <h1>Инструкция не найдена</h1>
      <p>{{ error || 'Не удалось получить данные инструкции.' }}</p>

      <RouterLink to="/instructions" class="preview-back-button">
        Вернуться к каталогу <span>↗</span>
      </RouterLink>
    </div>

    <div v-else class="preview-container">
      <!-- Левая колонка -->
      <section class="preview-description">
        <div class="preview-topline">
          <span class="preview-eyebrow"
            >INSTRUCTION / {{ String(instruction.id).padStart(2, '0') }}</span
          >
          <span class="preview-category">{{ instruction.category }}</span>
        </div>

        <div class="preview-main">
          <h1>{{ instruction.title }}</h1>

          <div class="preview-author">
            <span class="preview-author-mark">
              {{ instruction.author?.username?.charAt(0).toUpperCase() || 'G' }}
            </span>

            <span>
              {{ instruction.author?.username || 'Автор инструкции' }}
            </span>
          </div>

          <div class="preview-description-scroll">
            <p>
              {{ instruction.description || 'Автор пока не добавил описание этой инструкции.' }}
            </p>
          </div>
        </div>

        <div class="preview-bottomline">
          <span>STEP BY STEP</span>
          <span>GUIDE LIST</span>
        </div>
      </section>

      <!-- Правая колонка -->
      <aside class="preview-summary">
        <div>
          <span class="summary-eyebrow">YOUR PROGRESS</span>

          <div class="summary-percentage">{{ percentage }}<span>%</span></div>

          <div class="summary-progress-track">
            <div class="summary-progress-fill" :style="{ width: `${percentage}%` }"></div>
          </div>

          <div class="summary-progress-caption">
            <span>Выполнено</span>
            <strong>{{ percentage }}%</strong>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-statistics">
          <div class="summary-stat">
            <span class="summary-stat-label">Всего</span>
            <span class="summary-stat-value">{{ stepsCount }}</span>
          </div>

          <div class="summary-stat">
            <span class="summary-stat-label">Выполнено</span>
            <span class="summary-stat-value">0</span>
          </div>

          <div class="summary-stat">
            <span class="summary-stat-label">Осталось</span>
            <span class="summary-stat-value">{{ remainingSteps }}</span>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-bottom">
          <p>
            {{
              stepsCount
                ? `Инструкция состоит из ${stepsCount} ${getStepsLabel(stepsCount, 2)}. Проходи их последовательно в удобном темпе.`
                : 'В этой инструкции пока нет шагов.'
            }}
          </p>

          <button
            class="preview-start-button"
            type="button"
            :disabled="stepsCount === 0"
            @click="startInstruction"
          >
            Приступить
          </button>

          <RouterLink to="/instructions" class="summary-back-link">
            Вернуться к каталогу
          </RouterLink>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped lang="scss" src="../assets/styles/instruction-preview.scss"></style>
