<script setup>
import { onMounted, ref } from 'vue'

import DeleteLinkModal from '@/components/links/DeleteLinkModal.vue'
import LinkTable from '@/components/links/LinkTable.vue'
import { deleteLink, fetchLinks } from '@/services/links'
import { getApiErrorMessage } from '@/utils/validation'

const links = ref([])
const baseUrl = ref('')
const loading = ref(true)
const error = ref('')

const linkToDelete = ref(null)
const isDeleting = ref(false)

async function loadLinks() {
  loading.value = true
  error.value = ''

  try {
    const result = await fetchLinks()
    links.value = result.links
    baseUrl.value = result.baseUrl
  } catch (err) {
    error.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

function openDeleteModal(link) {
  linkToDelete.value = link
}

function closeDeleteModal() {
  if (!isDeleting.value) {
    linkToDelete.value = null
  }
}

async function confirmDelete() {
  if (!linkToDelete.value) {
    return
  }

  isDeleting.value = true
  error.value = ''

  try {
    await deleteLink(linkToDelete.value.id)
    links.value = links.value.filter((link) => link.id !== linkToDelete.value.id)
    linkToDelete.value = null
  } catch (err) {
    error.value = getApiErrorMessage(err)
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadLinks)
</script>

<template>
  <main class="dashboard">
    <header class="dashboard-header">
      <div>
        <h1>Your links</h1>
        <p>Manage and track your shortened URLs.</p>
      </div>
      <RouterLink class="primary-button" to="/links/new">New link</RouterLink>
    </header>

    <p v-if="error" class="error">{{ error }}</p>

    <LinkTable
      :links="links"
      :base-url="baseUrl"
      :loading="loading"
      @delete="openDeleteModal"
    />

    <DeleteLinkModal
      :open="Boolean(linkToDelete)"
      :slug="linkToDelete?.slug ?? ''"
      :is-deleting="isDeleting"
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </main>
</template>

<style scoped>
.dashboard {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
}

.dashboard-header p {
  margin: 0;
  color: #64748b;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.error {
  margin: 0 0 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
}
</style>
