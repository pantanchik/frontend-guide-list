
<script setup lang="ts">
import { onMounted } from 'vue'
import { useInstructionsStore } from '../stores/instructions'

const store = useInstructionsStore()

onMounted(() => {
  store.fetchInstructions()
})
</script>

<template>
  <main class="catalog">
    <h1>Каталог инструкций</h1>

    <p v-if="store.isLoading">
      Загрузка инструкций...
    </p>

    <p v-else-if="store.error">
      {{ store.error }}
    </p>

    <section v-else-if="store.instructions.length">
      <article
        v-for="instruction in store.instructions"
        :key="instruction.id"
        class="instruction-card"
      >
        <h2>{{ instruction.title }}</h2>

        <p>{{ instruction.description }}</p>

        <span>Категория: {{ instruction.category }}</span>

        <p>Автор: {{ instruction.author.username }}</p>

        <small>
          Просмотров: {{ instruction.views_count }}
        </small>
      </article>
    </section>

    <p v-else>
      Инструкций пока нет.
    </p>
  </main>
</template>

<style scoped src="../assets/styles/instructions.scss"></style>
