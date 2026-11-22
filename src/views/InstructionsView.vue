<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useInstructionsStore } from '../stores/instructions'

import FeaturedInstructionCard from '../components/catalog/FeaturedInstructionCard.vue'
import InstructionCard from '../components/catalog/InstructionCard.vue'
import CatalogToolbar from '../components/catalog/CatalogToolbar.vue'

const store = useInstructionsStore()

const searchQuery = ref('')
const selectedCategory = ref('Все')
const sortBy = ref<'popular' | 'newest'>('popular')

// получаем инструкции при открытии каталога
onMounted(() => {
  if (!store.instructions.length && !store.isLoading) {
    store.fetchInstructions()
  }
})

// формируем список категорий
const categories = computed(() => {
  const uniqueCategories = [...new Set(store.instructions.map((item) => item.category))]

  return ['Все', ...uniqueCategories]
})

// считаем количество инструкций в категории
const categoryCounts = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = {
    Все: store.instructions.length,
  }

  store.instructions.forEach((instruction) => {
    counts[instruction.category] = (counts[instruction.category] ?? 0) + 1
  })

  return counts
})

// поиск, фильтрация и сортировка
const filteredInstructions = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  const result = store.instructions.filter((instruction) => {
    const searchableText = [
      instruction.title,
      instruction.description,
      instruction.category,
      instruction.tags ?? '',
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch = searchableText.includes(query)

    const matchesCategory =
      selectedCategory.value === 'Все' || instruction.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })

  return result.sort((a, b) => {
    if (sortBy.value === 'popular') {
      return b.views_count - a.views_count
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

// первая инструкция — большая карточка
const featuredInstruction = computed(() => filteredInstructions.value[0] ?? null)

// остальные инструкции
const remainingInstructions = computed(() => filteredInstructions.value.slice(1))

// сброс фильтров
function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'Все'
  sortBy.value = 'popular'
}

// повторная загрузка
async function refreshCatalog() {
  await store.fetchInstructions()
}
</script>

<template>
  <main class="catalog-page">
    <!-- Верхняя часть страницы с общим фоном -->
    <div class="catalog-top-background">
      <div class="catalog-container">
        <!-- Вступительная часть -->
        <section class="catalog-intro">
          <div class="catalog-heading">
            <div class="catalog-eyebrow">
              <span class="catalog-index">01 / LIBRARY</span>
            </div>

            <h1>
              Найди способ
              <span>Сделай сам</span>
            </h1>

            <p>
              Понятные руководства для повседневных задач. Выбирай инструкцию, следуй шагам и
              двигайся к результату в собственном темпе.
            </p>
          </div>

          <aside class="catalog-aside">
            <span class="aside-label">GUIDE LIST / INDEX</span>

            <div class="aside-number">
              {{ String(store.instructions.length).padStart(2, '0') }}
            </div>

            <span class="aside-description"> ИНСТРУКЦИЙ В БИБЛИОТЕКЕ </span>

            <div class="aside-decoration">
              <span>FIND</span>
              <span>FOLLOW</span>
              <span>COMPLETE</span>
            </div>
          </aside>
        </section>

        <CatalogToolbar
          v-model:search-query="searchQuery"
          v-model:selected-category="selectedCategory"
          v-model:sort-by="sortBy"
          :categories="categories"
          :category-counts="categoryCounts"
        />
      </div>
    </div>

    <!-- Основное содержимое каталога -->
    <div class="catalog-container">
      <!-- Загрузка -->
      <section
        v-if="store.isLoading && !store.instructions.length"
        class="catalog-state"
        aria-live="polite"
      >
        <span class="state-index">02 / LOADING</span>
        <div class="state-loader"></div>
        <h2>Собираем библиотеку</h2>
        <p>Загружаем доступные инструкции...</p>
      </section>

      <!-- Ошибка -->
      <section
        v-else-if="store.error && !store.instructions.length"
        class="catalog-state"
        aria-live="polite"
      >
        <span class="state-index">02 / ERROR</span>
        <h2>Не удалось загрузить каталог</h2>
        <p>{{ store.error }}</p>

        <button class="catalog-action" type="button" @click="refreshCatalog">
          Попробовать снова <span>↗</span>
        </button>
      </section>

      <!-- Результаты -->
      <template v-else>
        <section class="catalog-results-heading">
          <div>
            <span class="results-label">02 / THE COLLECTION</span>
            <h2>Все инструкции</h2>
          </div>

          <div class="results-count">
            <strong>{{ filteredInstructions.length }}</strong>
            <span>НАЙДЕНО</span>
          </div>
        </section>

        <!-- Есть инструкции -->
        <template v-if="featuredInstruction">
          <!-- Главная карточка -->
          <FeaturedInstructionCard v-if="featuredInstruction" :instruction="featuredInstruction" />

          <!-- Остальные карточки -->
          <section v-if="remainingInstructions.length" class="instructions-grid">
            <InstructionCard
              v-for="instruction in remainingInstructions"
              :key="instruction.id"
              :instruction="instruction"
            />
          </section>
        </template>

        <!-- Пустой результат -->
        <section v-else class="catalog-state">
          <span class="state-index">04 / NO RESULTS</span>

          <h2>Пока ничего не найдено<span>.</span></h2>

          <p>Попробуй изменить поисковый запрос или выбрать другую категорию.</p>

          <button class="catalog-action" type="button" @click="resetFilters">
            Сбросить фильтры <span>↗</span>
          </button>
        </section>
      </template>
    </div>
  </main>
</template>

<style lang="scss" src="../assets/styles/instructions.scss"></style>
