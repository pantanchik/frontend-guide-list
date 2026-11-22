<script setup lang="ts">
type SortOption = 'popular' | 'newest'

defineProps<{
  searchQuery: string
  selectedCategory: string
  sortBy: SortOption
  categories: string[]
  categoryCounts: Record<string, number>
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedCategory': [value: string]
  'update:sortBy': [value: SortOption]
}>()
</script>

<template>
  <section class="catalog-toolbar">
    <div class="catalog-search-row">
      <label class="search-box">
        <span class="visually-hidden">Поиск инструкций</span>

        <svg class="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>

        <input
          :value="searchQuery"
          type="search"
          placeholder="Что хочешь узнать или сделать?"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />

        <button
          v-if="searchQuery"
          class="search-clear"
          type="button"
          aria-label="Очистить поиск"
          @click="emit('update:searchQuery', '')"
        >
          ×
        </button>
      </label>

      <div class="catalog-sort">
        <label for="catalog-sort">Сортировка</label>

        <select
          id="catalog-sort"
          :value="sortBy"
          @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value as SortOption)"
        >
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
        @click="emit('update:selectedCategory', category)"
      >
        <span>{{ category }}</span>

        <span class="category-count">
          {{ categoryCounts[category] ?? 0 }}
        </span>
      </button>
    </div>
  </section>
</template>
