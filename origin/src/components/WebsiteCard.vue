<template>
  <div class="website-card">
    <div class="website-header">
      <h4 class="website-name">{{ site.name }}</h4>
    </div>
    <p v-if="site.description" class="website-desc">{{ site.description }}</p>
    <div class="website-footer">
      <a
        :href="site.url"
        target="_blank"
        rel="noopener noreferrer"
        class="website-link"
      >
        访问网站 →
      </a>
      <span class="website-category-badge">{{ categoryName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    site: { type: Object, required: true },
    categoryName: { type: String, default: '' }
  }
}
</script>

<style scoped>
.website-card {
  background: var(--c-bg-card);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 2px solid rgba(224, 224, 224, 0.6);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.website-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--c-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.website-card:hover::before {
  transform: scaleX(1);
}

.website-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(45, 122, 107, 0.3),
              0 8px 20px rgba(139, 111, 71, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: #2d7a6b;
  background: var(--c-bg-card);
}

.website-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.website-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e5a4a;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.01em;
  transition: transform 0.3s ease;
}

.website-card:hover .website-name {
  transform: translateX(4px);
}

.website-desc {
  font-size: 0.95rem;
  color: #666;
  margin: 0.75rem 0 1.25rem 0;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.website-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.website-link {
  display: inline-block;
  padding: 0.7rem 1.4rem;
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
  position: relative;
  overflow: hidden;
}

.website-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.website-link:hover::before {
  width: 300px;
  height: 300px;
}

.website-link:hover {
  transform: translateX(6px) scale(1.05);
  box-shadow: 0 8px 24px rgba(45, 122, 107, 0.5),
              0 4px 12px rgba(139, 111, 71, 0.3);
}

.website-category-badge {
  font-size: 0.75rem;
  padding: 0.4rem 1rem;
  background: rgba(45, 122, 107, 0.1);
  color: #2d7a6b;
  border-radius: 14px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  border: 1px solid rgba(45, 122, 107, 0.2);
  transition: all 0.3s ease;
}

.website-card:hover .website-category-badge {
  background: rgba(45, 122, 107, 0.2);
  transform: scale(1.05);
}
</style>
