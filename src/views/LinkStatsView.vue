<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import ClicksChart from '@/components/links/ClicksChart.vue'
import { fetchLinkStats } from '@/services/links'
import { buildShortUrl } from '@/utils/links'
import { prepareLast7DaysChart } from '@/utils/stats'
import { getApiErrorMessage } from '@/utils/validation'

const route = useRoute()

const stats = ref(null)
const loading = ref(true)
const error = ref('')

const linkId = computed(() => route.params.id)

const shortUrl = computed(() => {
  if (!stats.value) {
    return ''
  }

  return buildShortUrl(
    {
      slug: stats.value.slug,
      shortUrl: stats.value.shortUrl,
    },
    import.meta.env.VITE_SHORT_URL_BASE ?? '',
  )
})

const chart = computed(() => {
  if (!stats.value) {
    return { labels: [], data: [] }
  }

  return prepareLast7DaysChart(stats.value.clicksByDay)
})

async function loadStats() {
  loading.value = true
  error.value = ''

  try {
    stats.value = await fetchLinkStats(linkId.value)
  } catch (err) {
    error.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <main class="link-stats">
    <header class="page-header">
      <div>
        <RouterLink class="back-link" to="/">← Back to dashboard</RouterLink>
        <h1>Link statistics</h1>
        <p v-if="stats?.slug">
          <code>{{ stats.slug }}</code>
          <span v-if="shortUrl"> · {{ shortUrl }}</span>
        </p>
      </div>
    </header>

    <p v-if="loading" class="status">Loading statistics...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <template v-else-if="stats">
      <section class="summary-card">
        <p class="summary-label">Total clicks</p>
        <p class="summary-value">{{ stats.totalClicks }}</p>
      </section>

      <section class="chart-card">
        <h2>Clicks in the last 7 days</h2>
        <ClicksChart :labels="chart.labels" :data="chart.data" />
      </section>
    </template>
  </main>
</template>

<style scoped>
.link-stats {
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
}

.page-header p {
  margin: 0;
  color: #64748b;
}

code {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: #f1f5f9;
  font-size: 0.875rem;
}

.status {
  margin: 0;
  color: #64748b;
}

.error {
  margin: 0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
}

.summary-card,
.chart-card {
  padding: 1.25rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #fff;
}

.summary-card {
  margin-bottom: 1rem;
}

.summary-label {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.summary-value {
  margin: 0.5rem 0 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.chart-card h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}
</style>
