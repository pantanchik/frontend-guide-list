<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useInstructionsStore } from '../stores/instructions'
import type { CreateInstructionRequest, StepCreateRequest } from '../types/instruction'

const router = useRouter()
const store = useInstructionsStore()

// данные основной части инструкции
const form = reactive({
  title: '',
  description: '',
  category: '',
  tags: '',
})

// первый шаг
function createEmptyStep(stepNumber: number): StepCreateRequest {
  return {
    step_number: stepNumber,
    title: '',
    content: '',
    image_url: null,
  }
}

// список шагов
const steps = ref<StepCreateRequest[]>([createEmptyStep(1)])

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

// добавление нового шага
function addStep() {
  steps.value.push(createEmptyStep(steps.value.length + 1))
}

// удаление шага
function removeStep(index: number) {
  if (steps.value.length === 1) return

  steps.value.splice(index, 1)

  // пересчитываем номера шагов
  steps.value.forEach((step, stepIndex) => {
    step.step_number = stepIndex + 1
  })
}

// отправка формы
async function submitInstruction() {
  errorMessage.value = null

  if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
    errorMessage.value = 'Заполните название, описание и категорию инструкции.'
    return
  }

  const hasEmptySteps = steps.value.some((step) => !step.title.trim() || !step.content.trim())

  if (hasEmptySteps) {
    errorMessage.value = 'Заполните название и описание каждого шага.'
    return
  }

  const data: CreateInstructionRequest = {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    tags: form.tags.trim() || null,
    steps: steps.value.map((step, index) => ({
      step_number: index + 1,
      title: step.title.trim(),
      content: step.content.trim(),
      image_url: step.image_url?.trim() || null,
    })),
  }

  isSubmitting.value = true

  try {
    await store.createInstruction(data)

    // после создания переходим в раздел своих инструкций
    await router.push({ name: 'my-instructions' })
  } catch (error) {
    console.error('Ошибка создания инструкции:', error)
    errorMessage.value = 'Не удалось создать инструкцию. Попробуйте ещё раз.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="instruction-create-page">
    <div class="create-top-background">
      <div class="create-container">
        <div class="create-intro">
          <div class="create-eyebrow">
            <span>01 / AUTHOR WORKSPACE</span>
          </div>

          <h1>
            Создай свою
            <span>инструкцию</span>
          </h1>

          <p>
            Раздели сложную задачу на понятные шаги. Поделись своим опытом и помоги другим
            разобраться
          </p>
        </div>
      </div>
    </div>

    <div class="create-container">
      <form class="instruction-form" @submit.prevent="submitInstruction">
        <!-- Основная информация -->
        <section class="form-section">
          <div class="form-section-heading">
            <span class="form-section-index">02 / INFORMATION</span>
            <h2>Основная информация</h2>
            <p>Сначала расскажи, чему посвящена твоя инструкция</p>
          </div>

          <div class="form-fields">
            <label class="form-field">
              <span>Название инструкции <i>*</i></span>
              <input
                v-model="form.title"
                type="text"
                maxlength="150"
                placeholder="Например, как собрать компьютер"
                required
              />
            </label>

            <label class="form-field">
              <span>Описание <i>*</i></span>
              <textarea
                v-model="form.description"
                rows="4"
                maxlength="2000"
                placeholder="Кратко опиши, чему научится читатель..."
                required
              ></textarea>
            </label>

            <div class="form-fields-row">
              <label class="form-field">
                <span>Категория <i>*</i></span>
                <input
                  v-model="form.category"
                  type="text"
                  maxlength="100"
                  placeholder="Например, Техника"
                  required
                />
              </label>

              <label class="form-field">
                <span>Теги</span>
                <input v-model="form.tags" type="text" placeholder="компьютер, сборка, ПК" />
                <small>Перечисляй теги через запятую</small>
              </label>
            </div>
          </div>
        </section>

        <!-- Шаги инструкции -->
        <section class="steps-section">
          <div class="form-section-heading">
            <span class="form-section-index">03 / STEP BY STEP</span>
            <h2>Шаги инструкции</h2>
            <p>
              Разбей процесс на последовательные действия. У каждого шага должно быть название и
              описание
            </p>
          </div>

          <div class="steps-list">
            <article v-for="(step, index) in steps" :key="index" class="step-editor">
              <div class="step-editor-heading">
                <div class="step-editor-number">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>

                <div class="step-editor-title">
                  <span>STEP {{ String(index + 1).padStart(2, '0') }}</span>
                  <strong>Шаг {{ index + 1 }}</strong>
                </div>

                <button
                  v-if="steps.length > 1"
                  class="remove-step-button"
                  type="button"
                  @click="removeStep(index)"
                >
                  Удалить <span>×</span>
                </button>
              </div>

              <div class="step-editor-fields">
                <label class="form-field">
                  <span>Название шага <i>*</i></span>
                  <input
                    v-model="step.title"
                    type="text"
                    maxlength="150"
                    placeholder="Например, подготовьте необходимые инструменты"
                    required
                  />
                </label>

                <label class="form-field">
                  <span>Описание шага <i>*</i></span>
                  <textarea
                    v-model="step.content"
                    rows="4"
                    placeholder="Подробно объясните, что нужно сделать..."
                    required
                  ></textarea>
                </label>

                <label class="form-field">
                  <span>Ссылка на изображение</span>
                  <input
                    v-model="step.image_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                  />
                  <small>Необязательное поле. Укажите прямую ссылку на изображение</small>
                </label>
              </div>
            </article>
          </div>

          <button class="add-step-button" type="button" @click="addStep">
            <span>+</span>
            Добавить следующий шаг
          </button>
        </section>

        <!-- Ошибка -->
        <p v-if="errorMessage" class="form-error" role="alert">
          {{ errorMessage }}
        </p>

        <!-- Отправка -->
        <section class="form-submit-section">
          <div>
            <p>Проверь содержимое инструкции перед созданием</p>
          </div>

          <button class="submit-instruction-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Создаём...' : 'Создать инструкцию' }}
          </button>
        </section>
      </form>
    </div>
  </main>
</template>

<style lang="scss" src="../assets/styles/instruction-create.scss"></style>
