import { ref } from 'vue'
import { defineStore } from 'pinia'

import { instructionsApi } from '../api/instructions.api'
import type { Instruction } from '../types/instruction'

// создание хранилища инструкций
export const useInstructionsStore = defineStore('instructions', () => {
  const instructions = ref<Instruction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchInstructions() {
    isLoading.value = true
    error.value = null

    // запрос инстрункций у backend'а
    try {
      instructions.value = await instructionsApi.getAll()
    } catch (err) {
      console.error('Ошибка загрузки инструкций:', err)
      error.value = 'Не удалось загрузить инструкции'
    } finally {
      isLoading.value = false
    }
  }

  return {
    instructions,
    isLoading,
    error,
    fetchInstructions,
  }
})
