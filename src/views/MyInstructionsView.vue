<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useAuthStore } from '../stores/auth'
import { useInstructionsStore } from '../stores/instructions'

import CatalogToolbar from '../components/catalog/CatalogToolbar.vue'
import FeaturedInstructionCard from '../components/catalog/FeaturedInstructionCard.vue'
import InstructionCard from '../components/catalog/InstructionCard.vue'

const authStore = useAuthStore()
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

// фильтруем инструкции текущего пользователя
const myInstructions = computed(() => {
  const userId = authStore.user?.id

  if (!userId) return []

  return store.instructions.filter((instruction) => instruction.author?.id === userId)
})

// формируем категории
const categories = computed(() => {
  const uniqueCategories = [...new Set(myInstructions.value.map((item) => item.category))]

  return ['Все', ...uniqueCategories]
})

// считаем кол-во инструкций в каждой категории
const categoryCounts = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = {
    Все: myInstructions.value.length,
  }

  myInstructions.value.forEach((instruction) => {
    counts[instruction.category] = (counts[instruction.category] ?? 0) + 1
  })

  return counts
})

// поиск, фильтрация и сортировка
const filteredInstructions = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  const result = myInstructions.value.filter((instruction) => {
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

  return [...result].sort((a, b) => {
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

// сбрасываем фильтры
function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'Все'
  sortBy.value = 'popular'
}

// повторная загрузка
async function refreshInstructions() {
  await store.fetchInstructions()
}
</script>

<template>
  <main class="catalog-page">
    <div class="catalog-top-background">
      <div class="catalog-container">
        <section class="catalog-intro">
          <div class="catalog-heading">
            <div class="catalog-eyebrow">
              <span class="catalog-index">01 / MY LIBRARY</span>
            </div>

            <h1>
              Мои
              <span>инструкции</span>
            </h1>

            <p>
              Все руководства, которые вы создали. Управляйте своей коллекцией и следите за её
              развитием.
            </p>
          </div>

          <aside class="catalog-aside">
            <span class="aside-label">GUIDE LIST / AUTHOR</span>

            <div class="aside-number">
              {{ String(myInstructions.length).padStart(2, '0') }}
            </div>

            <span class="aside-description"> МОИХ ИНСТРУКЦИЙ </span>

            <RouterLink to="/instructions/create" class="create-instruction-button">
              Создать инструкцию
            </RouterLink>
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

    <div class="catalog-container">
      <!-- Загрузка -->
      <section
        v-if="store.isLoading && !store.instructions.length"
        class="catalog-state"
        aria-live="polite"
      >
        <span class="state-index">02 / LOADING</span>
        <div class="state-loader"></div>
        <h2>Загружаем ваши инструкции</h2>
        <p>Подготавливаем вашу коллекцию...</p>
      </section>

      <!-- Ошибка -->
      <section
        v-else-if="store.error && !store.instructions.length"
        class="catalog-state"
        aria-live="polite"
      >
        <span class="state-index">02 / ERROR</span>
        <h2>Не удалось загрузить инструкции</h2>
        <p>{{ store.error }}</p>

        <button class="catalog-action" type="button" @click="refreshInstructions">
          Попробовать снова <span>↗</span>
        </button>
      </section>

      <!-- Результаты -->
      <template v-else>
        <section class="catalog-results-heading">
          <div>
            <span class="results-label">02 / YOUR COLLECTION</span>
            <h2>Моя коллекция</h2>
          </div>

          <div class="results-count">
            <strong>{{ filteredInstructions.length }}</strong>
            <span>НАЙДЕНО</span>
          </div>
        </section>

        <template v-if="featuredInstruction">
          <FeaturedInstructionCard :instruction="featuredInstruction" />

          <section v-if="remainingInstructions.length" class="instructions-grid">
            <InstructionCard
              v-for="instruction in remainingInstructions"
              :key="instruction.id"
              :instruction="instruction"
            />
          </section>
        </template>

        <!-- Нет собственных инструкций -->
        <section v-else-if="myInstructions.length === 0" class="catalog-state">
          <span class="state-index">03 / EMPTY COLLECTION</span>

          <h2>Здесь пока пусто<span>.</span></h2>

          <p>
            Вы ещё не создали ни одной инструкции. Ваша коллекция начнёт заполняться после первой
            публикации.
          </p>
        </section>

        <!-- Поиск ничего не нашёл -->
        <section v-else class="catalog-state">
          <span class="state-index">03 / NO RESULTS</span>

          <h2>Ничего не найдено<span>.</span></h2>

          <p>Попробуйте изменить поисковый запрос или выбрать другую категорию.</p>

          <button class="catalog-action" type="button" @click="resetFilters">
            Сбросить фильтры <span>↗</span>
          </button>
        </section>
      </template>
    </div>
  </main>
</template>

<style lang="scss" src="../assets/styles/instructions.scss"></style>
