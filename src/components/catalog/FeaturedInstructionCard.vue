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
    class="featured-card"
  >
    <div class="featured-content">
      <div class="featured-top">
        <span class="featured-category">
          {{ instruction.category }}
        </span>

        <span class="featured-number"> № {{ String(instruction.id).padStart(2, '0') }} </span>
      </div>

      <div class="featured-main">
        <h3>{{ instruction.title }}</h3>

        <p>
          {{ instruction.description || 'Пошаговое руководство для этой задачи.' }}
        </p>
      </div>

      <div class="featured-bottom">
        <div class="featured-author">
          <span class="author-mark">
            {{ instruction.author?.username?.charAt(0).toUpperCase() || 'G' }}
          </span>

          <span>
            {{ instruction.author?.username || 'Автор' }}
          </span>
        </div>

        <div class="featured-meta">
          <span>{{ instruction.views_count }} просм.</span>
        </div>
      </div>
    </div>

    <div class="featured-visual">
      <div class="visual-placeholder">
        <span class="visual-label">GUIDE</span>

        <div class="visual-steps">
          <span class="visual-big-number">
            {{ String(instruction.steps_count).padStart(2, '0') }}
          </span>

          <span class="visual-steps-label">
            {{ getStepsLabel(instruction.steps_count) }}
          </span>
        </div>

        <div class="visual-bottom">
          <span>STEP BY STEP</span>
          <span>GUIDE LIST</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
