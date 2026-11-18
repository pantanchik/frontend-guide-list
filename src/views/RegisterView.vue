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
    <div class="register-layout">
      <!-- Левая часть -->
      <section class="register-intro">
        <div class="intro-top">
          <span class="intro-label">GUIDE LIST / GETTING STARTED</span>
          <span class="intro-number">02 — 02</span>
        </div>

        <div class="intro-content">
          <span class="intro-index">ВАШ ПУТЬ НАЧИНАЕТСЯ ЗДЕСЬ</span>

          <h1>
            Знания<br />
            становятся<br />
            <span>ближе.</span>
          </h1>

          <p>
            Создавайте собственные инструкции, делитесь опытом и помогайте другим справляться с
            повседневными задачами.
          </p>
        </div>

        <div class="intro-bottom">
          <span>CREATE. SHARE. DISCOVER.</span>
          <span>EST. 2026</span>
        </div>

        <div class="intro-decoration">GL.</div>
      </section>

      <!-- Правая часть -->
      <section class="register-panel">
        <div class="register-card">
          <template v-if="!success">
            <div class="register-heading">
              <span class="form-label">НОВАЯ ГЛАВА НАЧИНАЕТСЯ</span>

              <h2>Создать аккаунт</h2>

              <p>Заполните данные, чтобы присоединиться к нам</p>
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
                  placeholder="Придумайте пароль"
                  autocomplete="new-password"
                  required
                />
              </div>

              <div class="form-group">
                <label for="password-confirm">Повторите пароль</label>

                <input
                  id="password-confirm"
                  v-model="passwordConfirm"
                  type="password"
                  placeholder="Повторите пароль"
                  autocomplete="new-password"
                  required
                />
              </div>

              <p v-if="error" class="form-error">
                {{ error }}
              </p>

              <button class="register-submit" type="submit" :disabled="isLoading">
                {{ isLoading ? 'Регистрация...' : 'Создать аккаунт' }}
              </button>
            </form>

            <div class="register-footer">
              <span>Уже есть аккаунт?</span>
              <RouterLink to="/login">Войти</RouterLink>
            </div>
          </template>

          <!-- Успешная регистрация -->
          <div v-else class="register-success">
            <span class="success-label">REGISTRATION COMPLETE</span>

            <div class="success-icon">✓</div>

            <h2>Аккаунт создан!</h2>

            <p>
              Регистрация прошла успешно. Теперь можно перейти к авторизации и начать пользоваться
              Guide List.
            </p>

            <button class="register-submit" @click="goToLogin">Перейти ко входу</button>
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

<style scoped lang="scss" src="../assets/styles/register.scss"></style>
