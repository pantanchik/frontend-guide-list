<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { authApi } from '../api/auth.api'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const isLoading = ref(false)
const error = ref('')
const success = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = false

  // проверяем совпадение паролей
  if (password.value !== passwordConfirm.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true

  // отправляем данные на api
  try {
    await authApi.register({
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
    })

    success.value = true
  } catch (err) {
    console.error('Ошибка регистрации:', err)

    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data

      // если неверные данные
      if (Array.isArray(responseData?.detail)) {
        const emailError = responseData.detail.find((item: { loc?: string[] }) =>
          item.loc?.includes('email'),
        )

        if (emailError) {
          error.value = 'Введите корректный адрес электронной почты'
        } else {
          error.value = 'Проверьте правильность заполнения полей'
        }
      } else if (typeof responseData?.detail === 'string') {
        error.value = responseData.detail
      } else {
        error.value = 'Не удалось зарегистрироваться. Попробуйте ещё раз'
      }
    } else {
      error.value = 'Произошла непредвиденная ошибка'
    }
  } finally {
    isLoading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <main class="register-page">
    <section class="register-card">
      <template v-if="!success">
        <div class="register-heading">
          <h1>Создать аккаунт</h1>

          <p>
            Зарегистрируйся, чтобы создавать инструкции, делиться знаниями и отслеживать свой
            прогресс.
          </p>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">Имя пользователя</label>

            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Например, student"
              autocomplete="username"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Электронная почта</label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="example@mail.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Придумай пароль"
              autocomplete="new-password"
              required
            />
          </div>

          <div class="form-group">
            <label for="password-confirm">Повтори пароль</label>

            <input
              id="password-confirm"
              v-model="passwordConfirm"
              type="password"
              placeholder="Повтори пароль"
              autocomplete="new-password"
              required
            />
          </div>

          <p v-if="error" class="form-error">
            {{ error }}
          </p>

          <button class="register-submit" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>

        <div class="register-footer">
          Уже есть аккаунт?
          <RouterLink to="/login">Войти</RouterLink>
        </div>
      </template>

      <div v-else class="register-success">
        <div class="success-icon">✓</div>

        <h1>Аккаунт создан!</h1>

        <p>
          Регистрация прошла успешно. Теперь можно перейти к авторизации и войти в свой аккаунт.
        </p>

        <button class="register-submit" @click="goToLogin">Перейти ко входу</button>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss" src="../assets/styles/register.scss"></style>
