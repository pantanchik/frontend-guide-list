<script setup lang="ts">
import type { Instructions } from '../../types/instruction'
import { getStepsLabel } from '../declension'

defineProps<{
  instruction: Instructions
}>()
</script>

<template>
  <RouterLink
    :to="{
      name: 'instruction-preview',
      params: { id: instruction.id },
    }"
    class="instruction-card"
  >
    <div class="card-top">
      <span class="card-category">
        {{ instruction.category }}
      </span>

      <span class="card-number"> № {{ String(instruction.id).padStart(2, '0') }} </span>
    </div>

    <div class="card-visual">
      <div class="card-visual-placeholder">
        <div class="visual-steps">
          <span class="card-visual-big-number">
            {{ String(instruction.steps_count).padStart(2, '0') }}
          </span>

          <span class="visual-steps-label">
            {{ getStepsLabel(instruction.steps_count) }}
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

        <span>
          {{ instruction.author?.username || 'Автор' }}
        </span>
      </div>

      <div class="card-meta">
        <span>{{ instruction.views_count }} просм.</span>
      </div>
    </div>
  </RouterLink>
</template>
