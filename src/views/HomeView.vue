<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCatalog() {
  router.push('/instructions')
}

const categories = [
  {
    title: 'Программирование',
    description: 'Изучай языки программирования и технологии',
    icon: '💻',
  },
  {
    title: 'Дизайн',
    description: 'Создавай интерфейсы и визуальные проекты',
    icon: '🎨',
  },
  {
    title: 'Обучение',
    description: 'Осваивай новые навыки шаг за шагом',
    icon: '📚',
  },
  {
    title: 'Практика',
    description: 'Закрепляй знания на реальных задачах',
    icon: '🛠️',
  },
]

const features = [
  {
    title: 'Пошаговые инструкции',
    description: 'Разбивай сложные задачи на понятные последовательные действия.',
  },
  {
    title: 'Отслеживание прогресса',
    description: 'Следи за выполнением шагов и собственными результатами.',
  },
  {
    title: 'Обмен знаниями',
    description: 'Создавай инструкции и делись опытом с другими пользователями.',
  },
]
</script>

<template>
  <!-- Главный экран -->
  <section class="hero">
    <div class="hero-content">
      <span class="hero-label"> ПЛАТФОРМА ПОШАГОВЫХ ИНСТРУКЦИЙ </span>

      <h1>
        Любая задача.
        <span>Понятно.</span>
        По шагам.
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

    <!-- Декоративная карточка инструкции -->
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
</template>

<style scoped lang="scss" src="../assets/styles/home.scss"></style>
