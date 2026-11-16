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
  <div class="home">
    <!-- Главный экран -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-label">ПЛАТФОРМА ПОШАГОВЫХ ИНСТРУКЦИЙ</span>

        <h1>
          Учись.
          <span>Создавай.</span>
          Делись.
        </h1>

        <p class="hero-description">
          Находи полезные инструкции, осваивай новые навыки и создавай собственные руководства
          вместе с Guide List.
        </p>

        <button class="primary-button" @click="goToCatalog">
          Перейти к инструкциям
          <span>→</span>
        </button>
      </div>
    </section>

    <!-- Категории -->
    <section class="section">
      <div class="section-heading">
        <div>
          <span class="section-label">ИССЛЕДУЙ</span>
          <h2>Выбери направление</h2>
          <p>Найди инструкции по интересующей тебя теме.</p>
        </div>

        <button class="text-button" @click="goToCatalog">Весь каталог →</button>
      </div>

      <div class="categories-grid">
        <article v-for="category in categories" :key="category.title" class="category-card">
          <div class="feature-icon">{{ category.icon }}</div>
          <h3>{{ category.title }}</h3>
          <p>{{ category.description }}</p>
          <button class="card-link" @click="goToCatalog">Смотреть инструкции →</button>
        </article>
      </div>
    </section>

    <!-- Преимущества -->
    <section class="features-section">
      <div class="section-heading centered">
        <span class="section-label">ВОЗМОЖНОСТИ</span>
        <h2>Всё для эффективного обучения</h2>
        <p>Инструменты, которые помогают превращать знания в результат.</p>
      </div>

      <div class="features-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-card">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <!-- Призыв к действию -->
    <section class="cta-section">
      <h2>Есть чем поделиться?</h2>
      <p>Создай собственную инструкцию и помоги другим освоить что-то новое.</p>
      <button class="primary-button" @click="goToCatalog">Исследовать Guide List →</button>
    </section>

    <footer class="footer">
      <strong>Guide List</strong>
      <span>Учись. Создавай. Делись.</span>
    </footer>
  </div>
</template>

<style scoped lang="scss" src="../assets/styles/home.scss"></style>
