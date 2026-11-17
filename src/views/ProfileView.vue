<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <!-- Заглушка -->
  <main class="profile-page">
    <section class="profile-card">
      <h1>Мой профиль</h1>
      <p class="profile-description">Информация о вашем аккаунте Guide List</p>

      <div v-if="authStore.user" class="profile-info">
        <div class="profile-info-item">
          <span>Имя пользователя</span>
          <strong>{{ authStore.user.username }}</strong>
        </div>

        <div class="profile-info-item">
          <span>Электронная почта</span>
          <strong>{{ authStore.user.email }}</strong>
        </div>

        <div class="profile-info-item">
          <span>Роль</span>
          <strong>{{ authStore.user.role }}</strong>
        </div>
      </div>
    </section>
  </main>
</template>
