<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Первая буква имени для аватара
const userInitial = computed(() => {
  return authStore.user?.username.trim().charAt(0).toUpperCase() || '?'
})

// Переводим роль пользователя
const roleLabel = computed(() => {
  const role = authStore.user?.role.toLowerCase()

  const roles: Record<string, string> = {
    student: 'Участник',
    author: 'Автор',
    admin: 'Администратор',
  }

  return role ? roles[role] || authStore.user?.role : 'Не указана'
})

// Форматируем дату регистрации
const registrationDate = computed(() => {
  const date = authStore.user?.created_at

  if (!date) return 'Не указана'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Не указана'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
})
</script>

<template>
  <main class="profile-page">
    <div class="profile-container">
      <!-- Заголовок -->
      <header class="profile-heading">
        <div class="profile-heading-top">
          <span class="profile-label">GUIDE LIST / PERSONAL SPACE</span>
          <span class="profile-index">ACCOUNT — 001</span>
        </div>

        <div class="profile-title">
          <span class="section-number">01 / PROFILE</span>

          <h1>Ваше <span>пространство.</span></h1>

          <p>
            Управляйте аккаунтом, просматривайте информацию о себе и продолжайте открывать новые
            инструкции.
          </p>
        </div>
      </header>

      <!-- Информация о пользователе -->
      <section v-if="authStore.user" class="profile-content">
        <!-- Основная карточка -->
        <article class="profile-main-card">
          <div class="card-top">
            <span class="card-label">USER INFORMATION</span>
            <span class="card-number">№ {{ authStore.user.id }}</span>
          </div>

          <div class="profile-user">
            <div class="profile-avatar">
              {{ userInitial }}
            </div>

            <div class="profile-user-info">
              <span class="user-role">{{ roleLabel }}</span>
              <h2>{{ authStore.user.username }}</h2>
              <p>{{ authStore.user.email }}</p>
            </div>
          </div>

          <div class="profile-divider"></div>

          <div class="profile-card-footer">
            <span>MEMBER OF GUIDE LIST</span>
            <span>EST. 2026</span>
          </div>
        </article>

        <!-- Дополнительная информация -->
        <section class="profile-details">
          <div class="details-heading">
            <span class="section-number">02 / ACCOUNT DETAILS</span>
            <h2>Данные аккаунта</h2>
          </div>

          <div class="details-list">
            <div class="detail-item">
              <span class="detail-label">Имя пользователя</span>
              <span class="detail-value">
                {{ authStore.user.username }}
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Электронная почта</span>
              <span class="detail-value">
                {{ authStore.user.email }}
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Роль в системе</span>
              <span class="detail-value">
                {{ roleLabel }}
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Дата регистрации</span>
              <span class="detail-value">
                {{ registrationDate }}
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Идентификатор</span>
              <span class="detail-value detail-id"> #{{ authStore.user.id }} </span>
            </div>
          </div>
        </section>
      </section>

      <!-- Состояние загрузки -->
      <section v-else class="profile-loading">
        <span class="section-number">LOADING / 001</span>
        <p>Загружаем информацию об аккаунте...</p>
      </section>

      <!-- Нижняя часть -->
      <footer class="profile-footer">
        <span>GUIDE LIST — YOUR PERSONAL HANDBOOK</span>
        <span>© 2026</span>
      </footer>
    </div>
  </main>
</template>

<style scoped lang="scss" src="../assets/styles/profile.scss"></style>
