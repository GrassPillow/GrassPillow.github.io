<template>
  <section class="grid-section">
    <div class="grid-container">
      <GridCard
        v-for="(card, index) in gridCards"
        :key="index"
        :title="card.title"
        :description="card.description"
        :icon="card.icon"
        :background-color="card.backgroundColor"
        :icon-color="card.iconColor"
        :image="card.image"
      />
    </div>
    <div class="footer-text">Pestres 1</div>
  </section>
</template>

<script setup>
import GridCard from './GridCard.vue'

const gridCards = [
  {
    title: 'Stare Seador',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
    icon: 'flower',
    backgroundColor: '#2d7a6b',
    iconColor: 'white'
  },
  {
    title: 'Teavnt',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    icon: 'leaf',
    backgroundColor: '#5a4a3a',
    iconColor: 'white'
  },
  {
    title: 'VOUSIHUTERCS',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    icon: 'golden-leaf',
    backgroundColor: '#c9a882',
    iconColor: '#d4a574'
  },
  {
    title: '',
    description: '',
    icon: '',
    backgroundColor: '#2d7a6b',
    iconColor: '',
    image: 'forest'
  },
  {
    title: 'Esoct Fias te',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
    icon: 'flower',
    backgroundColor: '#5a4a3a',
    iconColor: 'white'
  },
  {
    title: 'Blisstdare',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
    icon: 'hexagon',
    backgroundColor: '#c9a882',
    iconColor: '#5a4a3a'
  }
]
</script>

<style scoped>
.grid-section {
  width: 100%;
  background-color: #1e5a4a;
  padding: 80px 40px 40px;
  position: relative;
}

.grid-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.footer-text {
  text-align: center;
  color: white;
  font-size: 0.9rem;
  margin-top: 60px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-section {
    padding: 60px 20px 30px;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>

