<template>
  <div class="empty-state">
    <p>You don't have any links yet.</p>
    <RouterLink class="create-link" to="/links/new">Create your first link</RouterLink>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 3rem 1.5rem;
  text-align: center;
  border: 1px dashed #cbd5e1;
  border-radius: 0.75rem;
  color: #64748b;
}

.create-link {
  display: inline-block;
  margin-top: 0.75rem;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}
</style>
