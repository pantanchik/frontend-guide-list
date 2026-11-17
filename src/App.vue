<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/AppHeader.vue'

const authStore = useAuthStore()

// проверяем авторизацию при запуске
onMounted(() => {
  authStore.fetchCurrentUser()
})
</script>

<template>
  <div class="app">
    <AppHeader />

    <router-view />
  </div>
</template>
