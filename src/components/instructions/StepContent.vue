<script setup lang="ts">
import type { Step } from '../../types/instruction'

defineProps<{
  step: Step
  totalSteps: number
  confirmed: boolean
  alreadyCompleted: boolean
}>()

const emit = defineEmits<{
  'update:confirmed': [value: boolean]
}>()
</script>

<template>
  <section class="step-content">
    <div class="step-content-heading">
      <span>
        ШАГ {{ String(step.step_number).padStart(2, '0') }} /
        {{ String(totalSteps).padStart(2, '0') }}
      </span>

      <span v-if="alreadyCompleted" class="step-completed-label"> ВЫПОЛНЕНО ✓ </span>
    </div>

    <div class="step-content-scroll">
      <h1>{{ step.title }}</h1>

      <p class="step-description">
        {{ step.content }}
      </p>

      <div v-if="step.image_url?.trim()" class="step-image-wrapper">
        <img :src="step.image_url.trim()" :alt="step.title" class="step-image" />
      </div>
    </div>

    <label class="step-confirmation" :class="{ 'is-checked': confirmed }">
      <input
        type="checkbox"
        :checked="confirmed"
        :disabled="alreadyCompleted"
        @change="emit('update:confirmed', ($event.target as HTMLInputElement).checked)"
      />

      <span class="custom-checkbox">
        <span v-if="confirmed">✓</span>
      </span>

      <span>Я выполнил этот шаг</span>
    </label>
  </section>
</template>
