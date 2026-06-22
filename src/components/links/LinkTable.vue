<script setup>
import EmptyLinksState from '@/components/links/EmptyLinksState.vue'
import LinkRow from '@/components/links/LinkRow.vue'

defineProps({
  links: {
    type: Array,
    default: () => [],
  },
  baseUrl: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete'])
</script>

<template>
  <div class="link-table">
    <p v-if="loading" class="status">Loading links...</p>

    <EmptyLinksState v-else-if="links.length === 0" />

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Slug</th>
            <th>Short URL</th>
            <th class="numeric">Clicks</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <LinkRow
            v-for="link in links"
            :key="link.id"
            :link="link"
            :base-url="baseUrl"
            @delete="emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.status {
  margin: 0;
  color: #64748b;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

th,
td {
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: top;
}

th {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.numeric {
  text-align: right;
}
</style>
