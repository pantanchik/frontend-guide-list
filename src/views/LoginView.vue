<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { authApi } from '../api/auth.api'

const router = useRouter()

const email = ref('')
const password = ref('')

const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  isLoading.value = true

  try {
    // отправляем email и пароль на backend
    await authApi.login({
      email: email.value,
      password: password.value,
    })

    // если вход успешен, переходим на главную
    await router.push('/')
  } catch (err) {
    console.error('Ошибка входа:', err)

    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail

      if (detail === 'Invalid email') {
        error.value = 'Пользователь с такой почтой не найден'
      } else if (detail === 'Invalid password') {
        error.value = 'Неверный пароль'
      } else if (typeof detail === 'string') {
        error.value = detail
      } else {
        error.value = 'Не удалось войти. Проверьте введённые данные'
      }
    } else {
      error.value = 'Произошла непредвиденная ошибка'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-card">
      <div class="login-heading">
        <h1>С возвращением!</h1>
        <p>Войдите в свой аккаунт Guide List</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
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
            placeholder="Введите пароль"
            autocomplete="current-password"
            required
          />
        </div>

        <p v-if="error" class="form-error">
          {{ error }}
        </p>

        <button type="submit" class="login-submit" :disabled="isLoading">
          {{ isLoading ? 'Входим...' : 'Войти' }}
        </button>
      </form>

      <div class="login-footer">
        <span>Ещё нет аккаунта?</span>
        <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss" src="../assets/styles/login.scss"></style>
