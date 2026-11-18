<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const router = useRouter()

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  isLoading.value = true

  try {
    // отправляем email и пароль на backend
    await authStore.login({
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
    <div class="login-layout">
      <!-- Левая часть -->
      <section class="login-intro">
        <div class="intro-top">
          <span class="intro-label">GUIDE LIST / AUTHENTICATION</span>
          <span class="intro-number">01 — 02</span>
        </div>

        <div class="intro-content">
          <span class="intro-index">ВАШИ ИНСТРУКЦИИ ЖДУТ</span>

          <h1>
            Продолжим<br />
            с того же <span>места</span>
          </h1>

          <p>
            Возвращайтесь к своим инструкциям, сохраняйте прогресс и открывайте для себя новые
            способы решать повседневные задачи.
          </p>
        </div>

        <div class="intro-bottom">
          <span>LEARN. FOLLOW. COMPLETE.</span>
          <span>EST. 2026</span>
        </div>

        <div class="intro-decoration">GL.</div>
      </section>

      <!-- Правая часть -->
      <section class="login-panel">
        <div class="login-card">
          <div class="login-heading">
            <span class="form-label">СНОВА РАДЫ ВАС ВИДЕТЬ</span>

            <h2>Вход в аккаунт</h2>

            <p>Введите данные, чтобы продолжить работу</p>
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
              <span>{{ isLoading ? 'Входим...' : 'Войти в аккаунт' }}</span>
            </button>
          </form>

          <div class="login-footer">
            <span>Ещё нет аккаунта?</span>
            <RouterLink to="/register">Зарегистрироваться</RouterLink>
          </div>
        </div>

        <div class="panel-note">
          <span>GUIDE LIST — YOUR PERSONAL HANDBOOK</span>
          <span>© 2026</span>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss" src="../assets/styles/login.scss"></style>
