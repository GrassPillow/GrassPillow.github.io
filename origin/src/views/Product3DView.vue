<template>
  <div class="product-3d-view">
    <div class="view-header">
      <h1 class="page-title">3D 产品展示</h1>
      <p class="page-subtitle">交互式 3D 场景体验</p>
    </div>
    
    <div class="view-content">
      <div class="canvas-container">
        <div ref="canvasWrapper" class="canvas-wrapper"></div>
        
        <!-- 控制面板 -->
        <div class="control-panel">
          <div class="control-section">
            <h3 class="control-title">产品选择</h3>
            <div class="product-list">
              <button
                v-for="product in products"
                :key="product.id"
                class="product-btn"
                :class="{ active: currentProduct.id === product.id }"
                @click="switchProduct(product)"
              >
                {{ product.name }}
              </button>
            </div>
          </div>
          
          <div class="control-section">
            <h3 class="control-title">视角控制</h3>
            <div class="control-buttons">
              <button class="control-btn" @click="resetCamera">
                <span>🔄</span> 重置视角
              </button>
              <button class="control-btn" @click="toggleAutoRotate">
                <span>{{ autoRotate ? '⏸️' : '▶️' }}</span> 
                {{ autoRotate ? '停止旋转' : '自动旋转' }}
              </button>
            </div>
          </div>
          
          <div class="control-section">
            <h3 class="control-title">环境设置</h3>
            <div class="control-item">
              <label>环境光强度</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                v-model="ambientIntensity"
                @input="updateAmbientLight"
              />
              <span>{{ ambientIntensity }}</span>
            </div>
            <div class="control-item">
              <label>点光源强度</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                v-model="pointIntensity"
                @input="updatePointLight"
              />
              <span>{{ pointIntensity }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 产品信息面板 -->
      <div class="info-panel">
        <div class="product-info">
          <h2 class="product-name">{{ currentProduct.name }}</h2>
          <p class="product-description">{{ currentProduct.description }}</p>
          
          <div class="product-specs">
            <h3>产品规格</h3>
            <ul>
              <li v-for="(value, key) in currentProduct.specs" :key="key">
                <strong>{{ key }}:</strong> {{ value }}
              </li>
            </ul>
          </div>
          
          <div class="product-features">
            <h3>产品特点</h3>
            <ul>
              <li v-for="feature in currentProduct.features" :key="feature">
                ✓ {{ feature }}
              </li>
            </ul>
          </div>
          
          <div class="product-actions">
            <button class="action-btn primary">立即购买</button>
            <button class="action-btn secondary">加入购物车</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 提示信息 -->
    <div class="hint-overlay">
      <div class="hint-text">
        <p>🖱️ 鼠标拖拽：旋转视角</p>
        <p>🔍 滚轮：缩放</p>
        <p>👆 点击产品：查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasWrapper = ref(null)
let scene = null
let camera = null
let renderer = null
let currentMesh = null
let raycaster = null
let mouse = null

const autoRotate = ref(true)
const ambientIntensity = ref(0.6)
const pointIntensity = ref(1.2)

const currentProduct = ref({
  id: 5,
  name: '经典跑车',
  description: '流线型设计的经典跑车，展现速度与激情的完美结合。',
  specs: {
    '长度': '4.5m',
    '宽度': '1.9m',
    '高度': '1.3m',
    '引擎': 'V8 双涡轮',
    '最大功率': '600马力',
    '0-100km/h': '3.5秒'
  },
  features: [
    '流线型设计',
    '强劲动力',
    '豪华内饰',
    '先进科技'
  ]
})

const products = ref([
  {
    id: 1,
    name: '经典立方体',
    description: '这是一个精美的3D立方体产品，展示了现代设计的简约美学。',
    specs: {
      '尺寸': '10cm × 10cm × 10cm',
      '材质': '高级金属',
      '颜色': '渐变蓝',
      '重量': '500g'
    },
    features: [
      '精美设计',
      '高质量材质',
      '环保工艺',
      '持久耐用'
    ],
    geometry: 'box',
    color: 0x4a90e2
  },
  {
    id: 2,
    name: '优雅球体',
    description: '流畅的球体设计，完美诠释了简约与优雅的完美结合。',
    specs: {
      '直径': '12cm',
      '材质': '陶瓷',
      '颜色': '渐变紫',
      '重量': '300g'
    },
    features: [
      '流畅曲线',
      '精致工艺',
      '易于清洁',
      '多种用途'
    ],
    geometry: 'sphere',
    color: 0x9b59b6
  },
  {
    id: 3,
    name: '现代锥体',
    description: '独特的锥体造型，展现出现代设计的创新精神。',
    specs: {
      '高度': '15cm',
      '底径': '8cm',
      '材质': '玻璃',
      '颜色': '渐变绿',
      '重量': '400g'
    },
    features: [
      '独特造型',
      '透明质感',
      '现代风格',
      '多功能'
    ],
    geometry: 'cone',
    color: 0x2ecc71
  },
  {
    id: 4,
    name: '精致圆环',
    description: '优雅的圆环设计，象征着完美与和谐。',
    specs: {
      '外径': '10cm',
      '内径': '6cm',
      '材质': '金属',
      '颜色': '渐变金',
      '重量': '350g'
    },
    features: [
      '优雅设计',
      '金属质感',
      '经典造型',
      '收藏价值'
    ],
    geometry: 'torus',
    color: 0xf39c12
  },
  {
    id: 5,
    name: '经典跑车',
    description: '流线型设计的经典跑车，展现速度与激情的完美结合。',
    specs: {
      '长度': '4.5m',
      '宽度': '1.9m',
      '高度': '1.3m',
      '引擎': 'V8 双涡轮',
      '最大功率': '600马力',
      '0-100km/h': '3.5秒'
    },
    features: [
      '流线型设计',
      '强劲动力',
      '豪华内饰',
      '先进科技'
    ],
    geometry: 'car',
    color: 0xe74c3c
  }
])

// 初始化3D场景
function initScene() {
  if (!canvasWrapper.value) return
  
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f7)
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    canvasWrapper.value.clientWidth / canvasWrapper.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 5)
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(canvasWrapper.value.clientWidth, canvasWrapper.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  canvasWrapper.value.appendChild(renderer.domElement)
  
  // 创建轨道控制器（需要安装 orbit-controls）
  // 这里使用简单的鼠标控制
  setupControls()
  
  // 创建光源
  const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity.value)
  scene.add(ambientLight)
  
  const pointLight = new THREE.PointLight(0xffffff, pointIntensity.value)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)
  
  // 添加辅助光源
  const pointLight2 = new THREE.PointLight(0xffffff, 0.5)
  pointLight2.position.set(-5, -5, -5)
  scene.add(pointLight2)
  
  // 创建射线检测器
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  
  // 创建初始产品
  createProduct(currentProduct.value)
  
  // 添加网格辅助线
  const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xcccccc)
  scene.add(gridHelper)
  
  // 开始渲染循环
  animate()
  
  // 窗口大小调整
  window.addEventListener('resize', onWindowResize)
  
  // 鼠标事件
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false })
  renderer.domElement.addEventListener('click', onMouseClick)
  
  // 鼠标释放事件
  document.addEventListener('mouseup', () => {
    isDragging = false
  })
}

// 设置控制
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }
let rotationSpeed = 0.01

function setupControls() {
  // 简单的鼠标控制实现
}

function onMouseDown(event) {
  isDragging = true
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

function onMouseMove(event) {
  if (!isDragging || !currentMesh) return
  
  const deltaX = event.clientX - previousMousePosition.x
  const deltaY = event.clientY - previousMousePosition.y
  
  if (currentMesh.isGroup || currentMesh.rotation) {
    currentMesh.rotation.y += deltaX * rotationSpeed
    currentMesh.rotation.x += deltaY * rotationSpeed
  }
  
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

function onWheel(event) {
  event.preventDefault()
  const delta = event.deltaY * 0.01
  camera.position.z = Math.max(2, Math.min(10, camera.position.z + delta))
}

function onMouseClick(event) {
  if (!raycaster || !currentMesh) return
  
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  
  // 如果是组，检查所有子对象
  let intersects = []
  if (currentMesh.isGroup) {
    currentMesh.traverse((child) => {
      if (child.isMesh) {
        const childIntersects = raycaster.intersectObject(child)
        intersects = intersects.concat(childIntersects)
      }
    })
  } else {
    intersects = raycaster.intersectObject(currentMesh)
  }
  
  if (intersects.length > 0) {
    // 点击产品时的动画效果
    animateClick()
  }
}

function animateClick() {
  if (!currentMesh) return
  
  const originalScale = currentMesh.scale ? currentMesh.scale.x : 1
  let scale = originalScale
  
  const animate = () => {
    scale += (1.2 - scale) * 0.1
    if (currentMesh.scale) {
      currentMesh.scale.set(scale, scale, scale)
    }
    
    if (Math.abs(scale - 1.2) > 0.01) {
      requestAnimationFrame(animate)
    } else {
      // 恢复
      const restore = () => {
        scale += (originalScale - scale) * 0.1
        if (currentMesh.scale) {
          currentMesh.scale.set(scale, scale, scale)
        }
        if (Math.abs(scale - originalScale) > 0.01) {
          requestAnimationFrame(restore)
        }
      }
      restore()
    }
  }
  animate()
}

function onWindowResize() {
  if (!camera || !renderer || !canvasWrapper.value) return
  
  camera.aspect = canvasWrapper.value.clientWidth / canvasWrapper.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(canvasWrapper.value.clientWidth, canvasWrapper.value.clientHeight)
}

// 创建产品
function createProduct(product) {
  // 移除旧的产品
  if (currentMesh) {
    scene.remove(currentMesh)
    currentMesh.geometry.dispose()
    currentMesh.material.dispose()
  }
  
  let geometry
  
  switch (product.geometry) {
    case 'box':
      geometry = new THREE.BoxGeometry(2, 2, 2)
      break
    case 'sphere':
      geometry = new THREE.SphereGeometry(1, 32, 32)
      break
    case 'cone':
      geometry = new THREE.ConeGeometry(1, 2, 32)
      break
    case 'torus':
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
      break
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2)
  }
  
  // 创建渐变材质
  const material = new THREE.MeshPhongMaterial({
    color: product.color,
    shininess: 100,
    specular: 0x222222
  })
  
  currentMesh = new THREE.Mesh(geometry, material)
  currentMesh.position.set(0, 0, 0)
  scene.add(currentMesh)
  
  // 添加边缘线
  const edges = new THREE.EdgesGeometry(geometry)
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
  )
  currentMesh.add(line)
}

// 切换产品
function switchProduct(product) {
  currentProduct.value = product
  createProduct(product)
}

// 重置相机
function resetCamera() {
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)
  if (currentMesh) {
    if (currentMesh.isGroup) {
      currentMesh.rotation.set(0, 0, 0)
    } else {
      currentMesh.rotation.set(0, 0, 0)
    }
  }
}

// 切换自动旋转
function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
}

// 更新环境光
function updateAmbientLight() {
  if (!scene) return
  const ambientLight = scene.children.find(child => child.type === 'AmbientLight')
  if (ambientLight) {
    ambientLight.intensity = ambientIntensity.value
  }
}

// 更新点光源
function updatePointLight() {
  if (!scene) return
  const pointLights = scene.children.filter(child => child.type === 'PointLight')
  if (pointLights.length > 0) {
    pointLights[0].intensity = pointIntensity.value
  }
}

// 动画循环
function animate() {
  requestAnimationFrame(animate)
  
  if (currentMesh && autoRotate.value) {
    if (currentMesh.isGroup || currentMesh.rotation) {
      currentMesh.rotation.y += 0.01
      currentMesh.rotation.x += 0.005
    }
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// 清理
function cleanup() {
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('mouseup', () => {
    isDragging = false
  })
  
  if (renderer && renderer.domElement) {
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('wheel', onWheel)
    renderer.domElement.removeEventListener('click', onMouseClick)
  }
  
  // 清理当前模型
  if (currentMesh) {
    if (currentMesh.isGroup) {
      // 如果是组，遍历所有子对象并清理
      currentMesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    } else {
      if (currentMesh.geometry) currentMesh.geometry.dispose()
      if (currentMesh.material) {
        if (Array.isArray(currentMesh.material)) {
          currentMesh.material.forEach(mat => mat.dispose())
        } else {
          currentMesh.material.dispose()
        }
      }
    }
  }
  
  // 清理场景
  if (scene) {
    while(scene.children.length > 0) {
      const child = scene.children[0]
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose())
        } else {
          child.material.dispose()
        }
      }
      scene.remove(child)
    }
  }
  
  if (renderer) {
    renderer.dispose()
  }
}

onMounted(() => {
  setTimeout(() => {
    initScene()
  }, 100)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.product-3d-view {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f7 0%, #e8ecf1 100%);
  padding: 2rem;
}

.view-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.view-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.canvas-container {
  position: relative;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.canvas-wrapper {
  width: 100%;
  height: 600px;
  position: relative;
}

.control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 10;
}

.control-section {
  margin-bottom: 1.5rem;
}

.control-section:last-child {
  margin-bottom: 0;
}

.control-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 0.9rem;
  text-align: left;
}

.product-btn:hover {
  border-color: #2d7a6b;
  background: rgba(45, 122, 107, 0.05);
}

.product-btn.active {
  border-color: #2d7a6b;
  background: #2d7a6b;
  color: white;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn:hover {
  border-color: #2d7a6b;
  background: rgba(45, 122, 107, 0.05);
}

.control-item {
  margin-bottom: 1rem;
}

.control-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.control-item input[type="range"] {
  width: 100%;
  margin-bottom: 0.25rem;
}

.control-item span {
  font-size: 0.85rem;
  color: #2d7a6b;
  font-weight: 600;
}

.info-panel {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.product-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0 0 2rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.product-specs,
.product-features {
  margin-bottom: 2rem;
}

.product-specs h3,
.product-features h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.product-specs ul,
.product-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-specs li,
.product-features li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.95rem;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.product-specs li:last-child,
.product-features li:last-child {
  border-bottom: none;
}

.product-specs strong {
  color: #2d7a6b;
  margin-right: 0.5rem;
}

.product-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-btn {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.action-btn.primary {
  background: linear-gradient(135deg, #2d7a6b 0%, #1e5a4a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 122, 107, 0.4);
}

.action-btn.secondary {
  background: white;
  color: #2d7a6b;
  border: 2px solid #2d7a6b;
}

.action-btn.secondary:hover {
  background: rgba(45, 122, 107, 0.05);
}

.hint-overlay {
  position: fixed;
  bottom: 100px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.hint-text p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@media (max-width: 1024px) {
  .view-content {
    grid-template-columns: 1fr;
  }
  
  .control-panel {
    position: relative;
    top: auto;
    right: auto;
    max-width: none;
    margin-top: 1rem;
  }
  
  .canvas-wrapper {
    height: 500px;
  }
  
  .hint-overlay {
    display: none;
  }
}

@media (max-width: 768px) {
  .product-3d-view {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .canvas-wrapper {
    height: 400px;
  }
  
  .info-panel {
    padding: 1.5rem;
  }
}
</style>

