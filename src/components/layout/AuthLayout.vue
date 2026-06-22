<template>
  <div class="auth-layout">
    <div class="auth-card">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #f4f6f8;
}

.auth-card {
  width: 100%;
  max-width: 24rem;
  padding: 2rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}
</style>
