<template>
  <div class="comments-wrapper">
    <Giscus
      repo="GrassPillow/GrassPillow.github.io"
      repo-id="REPO_ID_PLACEHOLDER"
      category="Announcements"
      category-id="CATEGORY_ID_PLACEHOLDER"
      mapping="pathname"
      reactions-enabled="1"
      input-position="top"
      :theme="giscusTheme"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Giscus from '@giscus/vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const giscusTheme = computed(() => {
  return isDark.value ? 'dark_dimmed' : 'light'
})
</script>

<style scoped>
.comments-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}
</style>
