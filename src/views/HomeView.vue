<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInstructionsStore } from '../stores/instructions'

const router = useRouter()
const instructionsStore = useInstructionsStore()

function goToCatalog() {
  router.push('/instructions')
}

// cортировка инструкций по популярности
const popularInstructions = computed(() =>
  [...instructionsStore.instructions].sort((a, b) => b.views_count - a.views_count).slice(0, 8),
)

const carouselViewport = ref<HTMLElement | null>(null)
const carouselTrack = ref<HTMLElement | null>(null)

const isHovering = ref(false)
const isDragging = ref(false)
const isSettling = ref(false)

const isPaused = computed(() => isHovering.value || isDragging.value || isSettling.value)

let offset = 0
let loopWidth = 0
let animationFrame = 0
let previousFrameTime = 0
let activePointerId: number | null = null
let lastPointerX = 0
let hasDragged = false
let suppressClick = false
let resumeTimer: ReturnType<typeof setTimeout> | undefined

// скорость движения в пикселях в секунду
const carouselSpeed = 32

// нормализация смещения карусели
function normalizeOffset(value: number) {
  if (!loopWidth) return 0

  return ((value % loopWidth) + loopWidth) % loopWidth
}

// измеряем ширину первой группы карточек
function updateLoopWidth() {
  const firstGroup = carouselTrack.value?.firstElementChild as HTMLElement | null

  if (!firstGroup) {
    loopWidth = 0
    return
  }

  loopWidth = firstGroup.getBoundingClientRect().width
  offset = normalizeOffset(offset)
  applyTrackPosition()
}

// применяем смещение
function applyTrackPosition() {
  if (!carouselTrack.value) return

  carouselTrack.value.style.transform = `translate3d(${-offset}px, 0, 0)`
}

// анимация карусели
function animateCarousel(time: number) {
  if (!previousFrameTime) previousFrameTime = time

  const deltaTime = Math.min((time - previousFrameTime) / 1000, 0.05)
  previousFrameTime = time

  if (!isPaused.value && loopWidth > 0 && popularInstructions.value.length > 1) {
    offset = normalizeOffset(offset + carouselSpeed * deltaTime)
    applyTrackPosition()
  }

  animationFrame = requestAnimationFrame(animateCarousel)
}

// задержка перед возобновлением движения
function startResumeDelay() {
  if (resumeTimer) clearTimeout(resumeTimer)

  isSettling.value = true

  resumeTimer = setTimeout(() => {
    isSettling.value = false
  }, 300)
}

// наведение мыши
function handlePointerEnter(event: PointerEvent) {
  if (event.pointerType === 'mouse') {
    isHovering.value = true
  }
}

function handlePointerLeave(event: PointerEvent) {
  if (event.pointerType === 'mouse') {
    isHovering.value = false
  }
}

// начало перетаскивания
function handlePointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  if (resumeTimer) clearTimeout(resumeTimer)
  isSettling.value = false

  activePointerId = event.pointerId
  lastPointerX = event.clientX
  hasDragged = false
  isDragging.value = true

  // захват на карточке
  const target = event.target as HTMLElement
  const card = target.closest<HTMLElement>('.popular-card')

  card?.setPointerCapture(event.pointerId)
}

// перетаскивание карусели
function handlePointerMove(event: PointerEvent) {
  if (activePointerId !== event.pointerId) return

  const deltaX = event.clientX - lastPointerX

  if (Math.abs(deltaX) > 4) {
    hasDragged = true
  }

  if (hasDragged) {
    offset = normalizeOffset(offset - deltaX)
    applyTrackPosition()
    event.preventDefault()
  }

  lastPointerX = event.clientX
}

// завершение перетаскивания
function handlePointerUp(event: PointerEvent) {
  if (activePointerId !== event.pointerId) return

  activePointerId = null
  isDragging.value = false

  if (hasDragged) {
    suppressClick = true

    window.setTimeout(() => {
      suppressClick = false
    }, 0)
  }

  startResumeDelay()
}

// отменяем переход, если пользователь перетаскивал карусель
function handleCarouselClick(event: MouseEvent) {
  if (suppressClick) {
    event.preventDefault()
    event.stopPropagation()
  }
}

// загружаем инструкции при открытии
onMounted(async () => {
  if (!instructionsStore.instructions.length && !instructionsStore.isLoading) {
    await instructionsStore.fetchInstructions()
  }

  await nextTick()
  updateLoopWidth()

  window.addEventListener('resize', updateLoopWidth)
  animationFrame = requestAnimationFrame(animateCarousel)
})

// пересчитываем ширину при изменении списка инструкций
watch(popularInstructions, async () => {
  await nextTick()
  updateLoopWidth()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', updateLoopWidth)

  if (resumeTimer) clearTimeout(resumeTimer)
})
</script>

<template>
  <!-- Главный экран -->
  <section class="hero">
    <div class="hero-content">
      <span class="hero-label">ПЛАТФОРМА ПОШАГОВЫХ ИНСТРУКЦИЙ</span>

      <h1>
        Любая задача
        <span>Понятно</span>
        <br />По шагам
      </h1>

      <p class="hero-description">
        Находи полезные инструкции, осваивай новые навыки и превращай сложные задачи в
        последовательность простых действий.
      </p>

      <div class="hero-actions">
        <button class="primary-button" @click="goToCatalog">
          Найти инструкцию
          <span>→</span>
        </button>
      </div>

      <div class="hero-note">
        <span class="hero-note-line"></span>
        <span>Учись в собственном темпе</span>
      </div>
    </div>

    <!-- Декоративная карточка -->
    <div class="hero-visual">
      <div class="guide-preview">
        <div class="preview-top">
          <span>ПРИМЕР РУКОВОДСТВА</span>
          <span>№ 001</span>
        </div>

        <h2>Собери свой первый проект</h2>

        <p class="preview-description">Последовательность действий от идеи до результата.</p>

        <div class="preview-divider"></div>

        <div class="preview-step completed">
          <span class="step-number">01</span>
          <span>Подготовь инструменты</span>
          <span class="step-status">✓</span>
        </div>

        <div class="preview-step completed">
          <span class="step-number">02</span>
          <span>Изучи компоненты</span>
          <span class="step-status">✓</span>
        </div>

        <div class="preview-step">
          <span class="step-number">03</span>
          <span>Приступи к сборке</span>
          <span class="step-status">—</span>
        </div>

        <div class="preview-divider"></div>

        <div class="preview-progress">
          <div class="progress-info">
            <span>ТВОЙ ПРОГРЕСС</span>
            <span>2 / 3</span>
          </div>

          <div class="progress-track">
            <div class="progress-value"></div>
          </div>
        </div>

        <div class="preview-footer">
          <span>GUIDE LIST</span>
          <span>STEP BY STEP</span>
        </div>
      </div>

      <span class="visual-index">FIG. 01 — HOW IT WORKS</span>
    </div>
  </section>

  <!-- Популярные инструкции -->
  <section class="popular-section">
    <div class="popular-heading">
      <div class="popular-heading-content">
        <span class="section-label">ЛУЧШЕЕ ЗА ВСЁ ВРЕМЯ</span>
        <h2>Популярные инструкции</h2>
        <p>Посмотри, какие руководства сейчас изучают чаще всего</p>
      </div>
    </div>

    <!-- Загрузка -->
    <div
      v-if="instructionsStore.isLoading && !instructionsStore.instructions.length"
      class="popular-message"
    >
      Загружаем инструкции...
    </div>

    <!-- Ошибка -->
    <div
      v-else-if="instructionsStore.error && !instructionsStore.instructions.length"
      class="popular-message"
    >
      {{ instructionsStore.error }}
    </div>

    <!-- Пустой список -->
    <div v-else-if="!popularInstructions.length" class="popular-message">
      Пока здесь нет инструкций. Скоро они появятся!
    </div>

    <!-- Карусель -->
    <div
      v-else
      ref="carouselViewport"
      class="popular-viewport"
      @pointerenter="handlePointerEnter"
      @pointerleave="handlePointerLeave"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
      @click.capture="handleCarouselClick"
    >
      <div ref="carouselTrack" class="popular-track">
        <div
          v-for="groupIndex in popularInstructions.length > 1 ? 4 : 1"
          :key="groupIndex"
          class="popular-group"
          :aria-hidden="groupIndex !== 1"
        >
          <RouterLink
            v-for="(instruction, index) in popularInstructions"
            :key="`${groupIndex}-${instruction.id}`"
            class="popular-card"
            :to="{
              name: 'instruction-preview',
              params: { id: instruction.id },
            }"
            :tabindex="groupIndex === 1 ? 0 : -1"
            draggable="false"
          >
            <span class="popular-card-top">
              <span class="popular-category">{{ instruction.category }}</span>
              <span class="popular-number"> № {{ String(index + 1).padStart(2, '0') }} </span>
            </span>

            <span class="popular-card-title">{{ instruction.title }}</span>

            <span class="popular-card-description">
              {{ instruction.description || 'Пошаговое руководство для этой задачи.' }}
            </span>

            <span class="popular-card-bottom">
              <span class="popular-author">
                {{ instruction.author?.username || 'Автор' }}
              </span>

              <span class="popular-views"> {{ instruction.views_count }} просмотров </span>
            </span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="popular-footer">
      <span>GUIDE LIST / POPULAR GUIDES</span>

      <button class="popular-catalog-link" type="button" @click="goToCatalog">
        Смотреть весь каталог <span>→</span>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss" src="../assets/styles/home.scss"></style>
