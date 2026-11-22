import { ref } from 'vue'
import { defineStore } from 'pinia'

import { instructionsApi } from '../api/instructions.api'
import type { Instructions, Instruction, CreateInstructionRequest } from '../types/instruction'

// создание хранилища инструкций
export const useInstructionsStore = defineStore('instructions', () => {
  const instructions = ref<Instructions[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // загружает список инструкций
  async function fetchInstructions() {
    isLoading.value = true
    error.value = null

    try {
      instructions.value = await instructionsApi.getAll()
    } catch (err) {
      console.error('Ошибка загрузки инструкций:', err)
      error.value = 'Не удалось загрузить инструкции'
    } finally {
      isLoading.value = false
    }
  }

  // создаёт новую инструкцию
  async function createInstruction(data: CreateInstructionRequest): Promise<Instruction> {
    const newInstruction = await instructionsApi.create(data)

    // обновляем список после создания
    await fetchInstructions()

    return newInstruction
  }

  // удаляет инструкцию
  async function deleteInstruction(id: number): Promise<void> {
    await instructionsApi.delete(id)

    // удаляем инструкцию из локального списка
    instructions.value = instructions.value.filter((instruction) => instruction.id !== id)
  }

  return {
    instructions,
    isLoading,
    error,
    fetchInstructions,
    createInstruction,
    deleteInstruction,
  }
})
