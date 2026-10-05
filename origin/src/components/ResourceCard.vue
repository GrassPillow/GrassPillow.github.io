<template>
  <a
    :href="resource.url"
    target="_blank"
    rel="noopener noreferrer"
    class="resource-card"
  >
    <div class="card-top">
      <span class="card-logo">{{ initial }}</span>
      <span class="card-open">↗</span>
    </div>
    <h3 class="card-name">{{ resource.name }}</h3>
    <p class="card-desc">{{ resource.description }}</p>
    <div class="card-footer">
      <span class="card-category">{{ resource.category }}</span>
      <span class="card-domain">{{ domain }}</span>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
})

const initial = computed(() => {
  const name = props.resource.name || '?'
  return name.charAt(0).toUpperCase()
})

const domain = computed(() => {
  try {
    return new URL(props.resource.url).hostname.replace(/^www\./, '')
  } catch (e) {
    return props.resource.url
  }
})
</script>

<style scoped>
.resource-card {
  background: var(--c-bg-page);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-decoration: none;
  color: var(--c-text);
  display: block;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--c-primary);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--c-primary-light);
  color: var(--c-primary);
  font-weight: 800;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-open {
  font-size: 1.1rem;
  color: var(--c-text-muted);
  transition: all 0.2s ease;
}

.resource-card:hover .card-open {
  color: var(--c-primary);
  transform: translate(2px, -2px);
}

.card-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--c-text);
}

.card-desc {
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
  margin: 0 0 1.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.9em;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.9rem;
  border-top: 1px solid var(--c-border);
}

.card-category {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-primary-light);
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
}

.card-domain {
  font-size: 0.8rem;
  color: var(--c-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}
</style>
