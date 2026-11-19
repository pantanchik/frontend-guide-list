<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useInstructionsStore } from '../stores/instructions'

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

// склонение "шаг"
const getStepsLabel = (count: number): string => {
  const lastTwoDigits = count % 100
  const lastDigit = count % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'шагов'
  }

  if (lastDigit === 1) {
    return 'шаг'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'шага'
  }

  return 'шагов'
}

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
              <span class="catalog-eyebrow-line"></span>
              <span>БИБЛИОТЕКА ИНСТРУКЦИЙ</span>
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

        <!-- Поиск и фильтры -->
        <section class="catalog-toolbar">
          <div class="catalog-search-row">
            <label class="search-box">
              <span class="visually-hidden">Поиск инструкций</span>

              <svg class="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>

              <input
                v-model="searchQuery"
                type="search"
                placeholder="Что хочешь узнать или сделать?"
              />

              <button
                v-if="searchQuery"
                class="search-clear"
                type="button"
                aria-label="Очистить поиск"
                @click="searchQuery = ''"
              >
                ×
              </button>
            </label>

            <div class="catalog-sort">
              <label for="catalog-sort">Сортировка</label>

              <select id="catalog-sort" v-model="sortBy">
                <option value="popular">Популярные</option>
                <option value="newest">Сначала новые</option>
              </select>
            </div>
          </div>

          <div class="catalog-filter-heading">
            <span>КАТЕГОРИИ</span>
            <span>{{ categories.length - 1 }} РАЗДЕЛОВ</span>
          </div>

          <div class="categories-list">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              class="category-filter"
              :class="{ active: selectedCategory === category }"
              :aria-pressed="selectedCategory === category"
              @click="selectedCategory = category"
            >
              <span>{{ category }}</span>
              <span class="category-count">
                {{ categoryCounts[category] ?? 0 }}
              </span>
            </button>
          </div>
        </section>
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
          <article class="featured-card">
            <div class="featured-content">
              <div class="featured-top">
                <span class="featured-category">
                  {{ featuredInstruction.category }}
                </span>

                <span class="featured-number">
                  № {{ String(featuredInstruction.id).padStart(2, '0') }}
                </span>
              </div>

              <div class="featured-main">
                <h3>{{ featuredInstruction.title }}</h3>

                <p>
                  {{ featuredInstruction.description || 'Пошаговое руководство для этой задачи.' }}
                </p>
              </div>

              <div class="featured-bottom">
                <div class="featured-author">
                  <span class="author-mark">
                    {{ featuredInstruction.author?.username?.charAt(0).toUpperCase() || 'G' }}
                  </span>

                  <span>
                    {{ featuredInstruction.author?.username || 'Автор' }}
                  </span>
                </div>

                <div class="featured-meta">
                  <span>{{ featuredInstruction.views_count }} просм.</span>
                </div>
              </div>
            </div>

            <div class="featured-visual">
              <img
                v-if="featuredInstruction.steps?.[0]?.image_url"
                :src="featuredInstruction.steps[0].image_url"
                :alt="`Иллюстрация: ${featuredInstruction.title}`"
              />

              <div v-else class="visual-placeholder">
                <span class="visual-label">GUIDE</span>

                <div class="visual-steps">
                  <span class="visual-big-number">
                    {{ String(featuredInstruction.steps?.length ?? 0).padStart(2, '0') }}
                  </span>

                  <span class="visual-steps-label">
                    {{ getStepsLabel(featuredInstruction.steps?.length ?? 0) }}
                  </span>
                </div>

                <div class="visual-bottom">
                  <span>STEP BY STEP</span>
                  <span>GUIDE LIST</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Остальные карточки -->
          <section v-if="remainingInstructions.length" class="instructions-grid">
            <article
              v-for="(instruction, index) in remainingInstructions"
              :key="instruction.id"
              class="instruction-card"
            >
              <div class="card-top">
                <span class="card-category">
                  {{ instruction.category }}
                </span>

                <span class="card-number"> № {{ String(instruction.id).padStart(2, '0') }} </span>
              </div>

              <div class="card-visual">
                <img
                  v-if="instruction.steps?.[0]?.image_url"
                  :src="instruction.steps[0].image_url"
                  :alt="`Иллюстрация: ${instruction.title}`"
                />

                <div v-else class="card-visual-placeholder">
                  <div class="visual-steps">
                    <span class="card-visual-big-number">
                      {{ String(instruction.steps?.length ?? 0).padStart(2, '0') }}
                    </span>

                    <span class="visual-steps-label">
                      {{ getStepsLabel(instruction.steps?.length ?? 0) }}
                    </span>
                  </div>
                  <small>GUIDE LIST</small>
                </div>
              </div>

              <h3>{{ instruction.title }}</h3>

              <p class="card-description">
                {{ instruction.description || 'Пошаговое руководство для этой задачи.' }}
              </p>

              <div class="card-bottom">
                <div class="card-author">
                  <span class="author-mark">
                    {{ instruction.author?.username?.charAt(0).toUpperCase() || 'G' }}
                  </span>

                  <span>{{ instruction.author?.username || 'Автор' }}</span>
                </div>

                <div class="card-meta">
                  <span>{{ instruction.views_count }} просм.</span>
                </div>
              </div>
            </article>
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

<style scoped lang="scss" src="../assets/styles/instructions.scss"></style>
