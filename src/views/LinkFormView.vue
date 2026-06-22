<template>
  <main class="link-form-placeholder">
    <h1>{{ isEditing ? 'Edit link' : 'Create link' }}</h1>
    <p>This screen will be implemented in the next step.</p>
    <RouterLink to="/">Back to dashboard</RouterLink>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isEditing = computed(() => Boolean(route.params.id))
</script>

<style scoped>
.link-form-placeholder {
  max-width: 40rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}
</style>
