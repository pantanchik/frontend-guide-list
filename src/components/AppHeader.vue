<script setup lang="ts"></script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Логотип -->
      <RouterLink to="/" class="logo">
        <span class="logo-icon">G</span>
        <span class="logo-text">Guide List</span>
      </RouterLink>

      <!-- Навигация -->
      <nav class="header-nav">
        <RouterLink to="/" class="nav-link"> Главная </RouterLink>

        <RouterLink to="/instructions" class="nav-link"> Инструкции </RouterLink>
      </nav>

      <!-- Кнопки авторизации -->
      <div class="header-actions">
        <RouterLink to="/login" class="login-button"> Войти </RouterLink>

        <RouterLink to="/register" class="register-button"> Регистрация </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss" src="../assets/styles/header.scss"></style>
