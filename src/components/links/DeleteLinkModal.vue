<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    default: '',
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'confirm'])
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="delete-link-title">
      <h2 id="delete-link-title">Delete link</h2>
      <p>
        Are you sure you want to delete
        <strong>{{ slug }}</strong>
        ? This action cannot be undone.
      </p>

      <div class="actions">
        <button type="button" class="secondary" :disabled="isDeleting" @click="emit('cancel')">
          Cancel
        </button>
        <button type="button" class="danger" :disabled="isDeleting" @click="emit('confirm')">
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.45);
}

.modal {
  width: 100%;
  max-width: 28rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
}

.modal h2 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.modal p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

button {
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.danger {
  background: #dc2626;
  color: #fff;
}
</style>
