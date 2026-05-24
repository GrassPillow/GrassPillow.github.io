<template>
  <div class="skeleton" :class="[`skeleton-${type}`, { animate }]">
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>

    <div v-else-if="type === 'list'" class="skeleton-list">
      <div v-for="n in rows" :key="n" class="skeleton-list-item">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-list-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'table'" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="n in columns" :key="n" class="skeleton-cell"></div>
      </div>
      <div v-for="n in rows" :key="n" class="skeleton-table-row">
        <div v-for="c in columns" :key="c" class="skeleton-cell"></div>
      </div>
    </div>

    <div v-else-if="type === 'text'" class="skeleton-text-block">
      <div v-for="n in rows" :key="n" class="skeleton-line" :class="{ short: n === rows }"></div>
    </div>

    <div v-else-if="type === 'image'" class="skeleton-image-full"></div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'card',
    validator: (value) => ['card', 'list', 'table', 'text', 'image'].includes(value)
  },
  rows: {
    type: Number,
    default: 3
  },
  columns: {
    type: Number,
    default: 4
  },
  animate: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.skeleton {
  width: 100%;
}

.skeleton.animate .skeleton-image,
.skeleton.animate .skeleton-avatar,
.skeleton.animate .skeleton-title,
.skeleton.animate .skeleton-text,
.skeleton.animate .skeleton-cell,
.skeleton.animate .skeleton-line,
.skeleton.animate .skeleton-image-full {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Card Skeleton */
.skeleton-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.skeleton-card .skeleton-image {
  height: 200px;
  background: var(--bg-tertiary);
}

.skeleton-content {
  padding: 16px;
}

.skeleton-title {
  height: 20px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  margin-bottom: 12px;
  width: 70%;
}

.skeleton-text {
  height: 14px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  margin-bottom: 8px;
  width: 100%;
}

.skeleton-text.short {
  width: 60%;
}

/* List Skeleton */
.skeleton-list-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  flex-shrink: 0;
}

.skeleton-list-content {
  flex: 1;
}

/* Table Skeleton */
.skeleton-table {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.skeleton-table-header {
  display: flex;
  background: var(--bg-tertiary);
  padding: 12px;
  gap: 12px;
}

.skeleton-table-row {
  display: flex;
  padding: 12px;
  gap: 12px;
  border-bottom: 1px solid var(--border-light);
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

.skeleton-cell {
  flex: 1;
  height: 16px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  min-width: 60px;
}

/* Text Skeleton */
.skeleton-text-block {
  padding: 16px;
}

.skeleton-line {
  height: 14px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
}

.skeleton-line.short {
  width: 40%;
}

/* Image Skeleton */
.skeleton-image-full {
  width: 100%;
  height: 300px;
  background: var(--bg-tertiary);
  border-radius: 12px;
}
</style>
