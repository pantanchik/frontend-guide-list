<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useInstructionsStore } from '../stores/instructions'

const store = useInstructionsStore()

const searchQuery = ref('')
const selectedCategory = ref('Все')

onMounted(() => {
  store.fetchInstructions()
})

// получаем список категорий из загруженных инструкций
const categories = computed(() => {
  const uniqueCategories = [...new Set(store.instructions.map((item) => item.category))]

  return ['Все', ...uniqueCategories]
})

// фильтруем инструкции по поиску и категории
const filteredInstructions = computed(() => {
  return store.instructions.filter((instruction) => {
    const query = searchQuery.value.toLowerCase().trim()

    const matchesSearch =
      instruction.title.toLowerCase().includes(query) ||
      instruction.description.toLowerCase().includes(query)

    const matchesCategory =
      selectedCategory.value === 'Все' || instruction.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <main class="catalog">
    <div class="catalog-container">
      <!-- Заголовок -->
      <section class="catalog-heading">
        <span class="section-label">БАЗА ЗНАНИЙ</span>

        <h1>Каталог инструкций</h1>

        <p>Находи полезные руководства и осваивай новые навыки шаг за шагом.</p>
      </section>

      <!-- Поиск -->
      <section class="catalog-controls">
        <div class="search-box">
          <span class="search-icon">⌕</span>

          <input v-model="searchQuery" type="text" placeholder="Найти инструкцию..." />
        </div>

        <!-- Категории -->
        <div class="categories-list">
          <button
            v-for="category in categories"
            :key="category"
            class="category-filter"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </section>

      <!-- Загрузка -->
      <div v-if="store.isLoading" class="catalog-message">
        <div class="loader"></div>
        <p>Загружаем инструкции...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="store.error" class="catalog-message">
        <h2>Не удалось загрузить каталог</h2>
        <p>{{ store.error }}</p>

        <button class="retry-button" @click="store.fetchInstructions">Попробовать снова</button>
      </div>

      <!-- Карточки -->
      <template v-else>
        <div class="catalog-results">
          <h2>Все инструкции</h2>

          <span> Найдено: {{ filteredInstructions.length }} </span>
        </div>

        <section v-if="filteredInstructions.length" class="instructions-grid">
          <article
            v-for="instruction in filteredInstructions"
            :key="instruction.id"
            class="instruction-card"
          >
            <div class="card-top">
              <span class="card-category">
                {{ instruction.category }}
              </span>

              <span class="card-views"> {{ instruction.views_count }} просмотров </span>
            </div>

            <h3>{{ instruction.title }}</h3>

            <p class="card-description">
              {{ instruction.description }}
            </p>

            <div class="card-bottom">
              <div class="card-author">
                <span class="author-avatar">
                  {{ instruction.author.username.charAt(0).toUpperCase() }}
                </span>

                <span>{{ instruction.author.username }}</span>
              </div>

              <span class="card-steps"> {{ instruction.steps?.length ?? 0 }} шагов </span>
            </div>
          </article>
        </section>

        <!-- Пустой результат -->
        <div v-else class="catalog-message">
          <h2>Ничего не найдено</h2>

          <p>Попробуй изменить поисковый запрос или выбрать другую категорию.</p>

          <button class="retry-button" @click="((searchQuery = ''), (selectedCategory = 'Все'))">
            Сбросить фильтры
          </button>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped lang="scss" src="../assets/styles/instructions.scss"></style>
