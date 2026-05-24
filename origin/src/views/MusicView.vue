<template>
  <div class="music-view">
    <!-- Header -->
    <header class="music-header">
      <div class="header-content">
        <h1 class="page-title">音乐空间</h1>
        <p class="page-subtitle">聆听美好，放松心情</p>
      </div>
    </header>

    <!-- Main Player Section -->
    <section class="player-section">
      <div class="player-container">
        <!-- Album Art -->
        <div class="album-art-container">
          <div class="album-art" :class="{ playing: isPlaying }">
            <img :src="currentTrack?.cover || defaultCover" :alt="currentTrack?.title" />
            <div class="album-reflection"></div>
          </div>
        </div>

        <!-- Track Info -->
        <div class="track-info">
          <h2 class="track-title">{{ currentTrack?.title || '选择一首歌曲' }}</h2>
          <p class="track-artist">{{ currentTrack?.artist || '未知艺术家' }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-bar" @click="seekTo">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="time-display">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="player-controls">
          <button class="control-btn" @click="toggleShuffle" :class="{ active: isShuffle }">
            🔀
          </button>
          <button class="control-btn" @click="prevTrack">
            ⏮️
          </button>
          <button class="control-btn play-btn" @click="togglePlay">
            {{ isPlaying ? '⏸️' : '▶️' }}
          </button>
          <button class="control-btn" @click="nextTrack">
            ⏭️
          </button>
          <button class="control-btn" @click="toggleRepeat" :class="{ active: repeatMode !== 'none' }">
            {{ repeatMode === 'one' ? '🔂' : '🔁' }}
          </button>
        </div>

        <!-- Volume Control -->
        <div class="volume-section">
          <span class="volume-icon" @click="toggleMute">{{ isMuted ? '🔇' : '🔊' }}</span>
          <input
            type="range"
            class="volume-slider"
            min="0"
            max="100"
            :value="isMuted ? 0 : volume"
            @input="setVolume"
          />
        </div>
      </div>
    </section>

    <!-- Playlist Section -->
    <section class="playlist-section">
      <div class="playlist-header">
        <h3 class="section-title">播放列表</h3>
        <div class="playlist-tabs">
          <button
            v-for="tab in playlistTabs"
            :key="tab.id"
            class="playlist-tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <div class="playlist-container">
        <div
          v-for="(track, index) in playlist"
          :key="track.id"
          class="playlist-item"
          :class="{ active: currentTrackIndex === index }"
          @click="playTrack(index)"
        >
          <div class="item-cover">
            <img :src="track.cover" :alt="track.title" />
            <div class="play-overlay">
              <span>{{ currentTrackIndex === index && isPlaying ? '⏸️' : '▶️' }}</span>
            </div>
          </div>
          <div class="item-info">
            <h4 class="item-title">{{ track.title }}</h4>
            <p class="item-artist">{{ track.artist }}</p>
          </div>
          <span class="item-duration">{{ track.duration }}</span>
        </div>
      </div>
    </section>

    <!-- Visualizer (simplified) -->
    <section class="visualizer-section" v-if="isPlaying">
      <div class="visualizer">
        <div
          v-for="n in 20"
          :key="n"
          class="visualizer-bar"
          :style="{
            height: Math.random() * 60 + 20 + '%',
            animationDelay: n * 0.05 + 's'
          }"
        ></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const defaultCover = 'https://picsum.photos/seed/music-default/300/300.jpg'

const playlistTabs = [
  { id: 'all', name: '全部' },
  { id: 'favorite', name: '收藏' },
  { id: 'recent', name: '最近播放' }
]

const playlist = ref([
  {
    id: 1,
    title: '星空漫步',
    artist: 'Dream Walker',
    cover: 'https://picsum.photos/seed/track1/100/100.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '3:45'
  },
  {
    id: 2,
    title: '城市夜景',
    artist: 'Night Owl',
    cover: 'https://picsum.photos/seed/track2/100/100.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '4:12'
  },
  {
    id: 3,
    title: '晨光序曲',
    artist: 'Morning Light',
    cover: 'https://picsum.photos/seed/track3/100/100.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '3:58'
  },
  {
    id: 4,
    title: '森林低语',
    artist: 'Nature Sounds',
    cover: 'https://picsum.photos/seed/track4/100/100.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '5:20'
  },
  {
    id: 5,
    title: '电子脉搏',
    artist: 'Digital Pulse',
    cover: 'https://picsum.photos/seed/track5/100/100.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '4:05'
  },
  {
    id: 6,
    title: '爵士时光',
    artist: 'Jazz Cafe',
    cover: 'https://picsum.photos/seed/track6/100/100.jpg',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: '4:33'
  }
])

const activeTab = ref('all')
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const isShuffle = ref(false)
const repeatMode = ref('none')
const volume = ref(70)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Audio instance
let audio = null

const currentTrack = computed(() => playlist.value[currentTrackIndex.value])

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const initAudio = () => {
  if (audio) {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
  }

  audio = new Audio()
  audio.volume = isMuted.value ? 0 : volume.value / 100

  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
  })
  audio.addEventListener('loadedmetadata', () => {
    duration.value = audio.duration
  })
  audio.addEventListener('ended', () => {
    handleTrackEnd()
  })
  audio.addEventListener('play', () => {
    isPlaying.value = true
  })
  audio.addEventListener('pause', () => {
    isPlaying.value = false
  })
  audio.addEventListener('error', () => {
    isPlaying.value = false
  })
}

const loadTrack = () => {
  if (!audio) initAudio()
  const track = currentTrack.value
  if (track?.src) {
    audio.src = track.src
    audio.load()
    currentTime.value = 0
    duration.value = 0
  }
}

watch(currentTrackIndex, () => {
  loadTrack()
  if (isPlaying.value) {
    audio?.play().catch(() => {})
  }
})

const togglePlay = () => {
  if (!audio) loadTrack()
  if (!audio?.src) return

  if (audio.paused) {
    audio.play().catch(() => {})
  } else {
    audio.pause()
  }
}

const handleTrackEnd = () => {
  if (repeatMode.value === 'one') {
    audio.currentTime = 0
    audio.play().catch(() => {})
  } else if (repeatMode.value === 'all' || currentTrackIndex.value < playlist.value.length - 1) {
    nextTrack()
  }
}

const prevTrack = () => {
  if (audio && audio.currentTime > 3) {
    audio.currentTime = 0
  } else {
    currentTrackIndex.value = currentTrackIndex.value > 0
      ? currentTrackIndex.value - 1
      : playlist.value.length - 1
  }
}

const nextTrack = () => {
  if (isShuffle.value) {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * playlist.value.length)
    } while (newIndex === currentTrackIndex.value && playlist.value.length > 1)
    currentTrackIndex.value = newIndex
  } else {
    currentTrackIndex.value = currentTrackIndex.value < playlist.value.length - 1
      ? currentTrackIndex.value + 1
      : 0
  }
}

const playTrack = (index) => {
  currentTrackIndex.value = index
  if (audio && audio.src) {
    audio.play().catch(() => {})
  }
}

const toggleShuffle = () => {
  isShuffle.value = !isShuffle.value
}

const toggleRepeat = () => {
  const modes = ['none', 'all', 'one']
  const currentIndex = modes.indexOf(repeatMode.value)
  repeatMode.value = modes[(currentIndex + 1) % modes.length]
}

const setVolume = (e) => {
  volume.value = parseInt(e.target.value)
  isMuted.value = volume.value === 0
  if (audio) {
    audio.volume = volume.value / 100
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audio) {
    audio.volume = isMuted.value ? 0 : volume.value / 100
  }
}

const seekTo = (e) => {
  if (!audio || !duration.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  audio.currentTime = percent * duration.value
}

onMounted(() => {
  loadTrack()
})

onUnmounted(() => {
  if (audio) {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    audio = null
  }
})
</script>

<style scoped>
.music-view {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.music-header {
  background: var(--gradient-hero);
  padding: 60px 24px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

/* Player Section */
.player-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
}

.player-container {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 40px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
}

/* Album Art */
.album-art-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.album-art {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.album-art.playing {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-reflection {
  position: absolute;
  bottom: -50%;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
  transform: scaleY(-1);
  opacity: 0.3;
  filter: blur(10px);
}

/* Track Info */
.track-info {
  text-align: center;
  margin-bottom: 32px;
}

.track-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.track-artist {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Progress Section */
.progress-section {
  margin-bottom: 24px;
}

.progress-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.time-display {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Controls */
.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.control-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--bg-tertiary);
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  transform: scale(1.1);
  background: var(--bg-secondary);
}

.control-btn.active {
  background: var(--primary-color);
}

.control-btn.play-btn {
  width: 64px;
  height: 64px;
  background: var(--gradient-primary);
  font-size: 1.8rem;
}

.control-btn.play-btn:hover {
  transform: scale(1.15);
  box-shadow: var(--shadow-md);
}

/* Volume */
.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.volume-icon {
  font-size: 1.2rem;
  cursor: pointer;
}

.volume-slider {
  width: 120px;
  height: 4px;
  -webkit-appearance: none;
  background: var(--bg-tertiary);
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

/* Playlist Section */
.playlist-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.playlist-tabs {
  display: flex;
  gap: 8px;
}

.playlist-tab {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.playlist-tab:hover {
  border-color: var(--border-color);
}

.playlist-tab.active {
  background: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

.playlist-container {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--border-light);
}

.playlist-item:last-child {
  border-bottom: none;
}

.playlist-item:hover {
  background: var(--bg-secondary);
}

.playlist-item.active {
  background: rgba(45, 122, 107, 0.1);
}

.item-cover {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.item-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playlist-item:hover .play-overlay,
.playlist-item.active .play-overlay {
  opacity: 1;
}

.play-overlay span {
  font-size: 0.9rem;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-artist {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.item-duration {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Visualizer */
.visualizer-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.visualizer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  height: 60px;
}

.visualizer-bar {
  width: 8px;
  background: var(--gradient-primary);
  border-radius: 4px;
  animation: visualize 0.5s ease-in-out infinite alternate;
}

@keyframes visualize {
  from { transform: scaleY(0.3); }
  to { transform: scaleY(1); }
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .player-container {
    padding: 24px;
  }

  .album-art {
    width: 180px;
    height: 180px;
  }

  .player-controls {
    gap: 12px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .control-btn.play-btn {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }

  .playlist-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
