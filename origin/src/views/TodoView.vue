<template>
  <div class="todo-view">
    <!-- Header -->
    <header class="todo-header">
      <div class="header-content">
        <h1 class="page-title">待办清单</h1>
        <p class="page-subtitle">记录灵感，规划目标</p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="todo-container">
      <!-- Add New Todo -->
      <div class="add-todo-section">
        <div class="add-todo-form">
          <input
            v-model="newTodo"
            type="text"
            class="todo-input"
            placeholder="添加新的待办事项..."
            @keyup.enter="addTodo"
          />
          <select v-model="newTodoPriority" class="priority-select">
            <option value="low">低优先级</option>
            <option value="medium">中优先级</option>
            <option value="high">高优先级</option>
          </select>
          <select v-model="newTodoCategory" class="category-select">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>
          <button class="add-btn" @click="addTodo" :disabled="!newTodo.trim()">
            添加
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-section">
        <div class="filter-tabs">
          <button
            v-for="filter in filters"
            :key="filter.id"
            class="filter-tab"
            :class="{ active: activeFilter === filter.id }"
            @click="activeFilter = filter.id"
          >
            {{ filter.name }}
            <span class="count">{{ getFilterCount(filter.id) }}</span>
          </button>
        </div>
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Todo List -->
      <div class="todo-list">
        <transition-group name="todo-item">
          <div
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="todo-item"
            :class="{ completed: todo.completed, [`priority-${todo.priority}`]: true }"
          >
            <button class="check-btn" @click="toggleTodo(todo.id)">
              <span v-if="todo.completed" class="check-icon">✓</span>
            </button>

            <div class="todo-content">
              <div class="todo-main">
                <span class="todo-text">{{ todo.text }}</span>
                <div class="todo-meta">
                  <span class="category-tag" :style="{ background: getCategoryColor(todo.category) }">
                    {{ getCategoryIcon(todo.category) }}
                  </span>
                  <span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
                </div>
              </div>

              <div class="todo-actions">
                <button class="action-btn edit" @click="startEdit(todo)" title="编辑">
                  ✏️
                </button>
                <button class="action-btn delete" @click="deleteTodo(todo.id)" title="删除">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </transition-group>

        <div v-if="filteredTodos.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <p class="empty-text">暂无待办事项</p>
          <p class="empty-hint">添加一个新的待办开始吧</p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-label">总计</span>
          <span class="stat-value">{{ todos.length }}</span>
        </div>
        <div class="stat-item completed">
          <span class="stat-label">已完成</span>
          <span class="stat-value">{{ todos.filter(t => t.completed).length }}</span>
        </div>
        <div class="stat-item pending">
          <span class="stat-label">进行中</span>
          <span class="stat-value">{{ todos.filter(t => !t.completed).length }}</span>
        </div>
        <div class="stat-item high-priority">
          <span class="stat-label">高优先级</span>
          <span class="stat-value">{{ todos.filter(t => t.priority === 'high' && !t.completed).length }}</span>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="editingTodo" class="modal-overlay" @click.self="cancelEdit">
          <div class="modal-content">
            <h3 class="modal-title">编辑待办</h3>
            <input
              v-model="editText"
              type="text"
              class="modal-input"
              @keyup.enter="saveEdit"
            />
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="cancelEdit">取消</button>
              <button class="modal-btn save" @click="saveEdit">保存</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'grasspillow-todos'

const categories = [
  { id: 'work', name: '工作', icon: '💼', color: '#3b82f6' },
  { id: 'personal', name: '个人', icon: '👤', color: '#10b981' },
  { id: 'study', name: '学习', icon: '📚', color: '#8b5cf6' },
  { id: 'health', name: '健康', icon: '🏃', color: '#f59e0b' },
  { id: 'other', name: '其他', icon: '📌', color: '#6b7280' }
]

const filters = [
  { id: 'all', name: '全部' },
  { id: 'active', name: '进行中' },
  { id: 'completed', name: '已完成' }
]

const todos = ref([])
const newTodo = ref('')
const newTodoPriority = ref('medium')
const newTodoCategory = ref('work')
const activeFilter = ref('all')
const searchQuery = ref('')
const editingTodo = ref(null)
const editText = ref('')

// Persist todos to localStorage
const saveTodos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}

// Load todos from localStorage
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    todos.value = JSON.parse(saved).map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt)
    }))
  }
})

const filteredTodos = computed(() => {
  let result = todos.value

  // Filter by status
  if (activeFilter.value === 'active') {
    result = result.filter(t => !t.completed)
  } else if (activeFilter.value === 'completed') {
    result = result.filter(t => t.completed)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => t.text.toLowerCase().includes(query))
  }

  // Sort by priority and date
  return result.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

const getFilterCount = (filterId) => {
  if (filterId === 'all') return todos.value.length
  if (filterId === 'active') return todos.value.filter(t => !t.completed).length
  if (filterId === 'completed') return todos.value.filter(t => t.completed).length
  return 0
}

const getCategoryColor = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat?.color || '#6b7280'
}

const getCategoryIcon = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat?.icon || '📌'
}

const formatDate = (date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const addTodo = () => {
  if (!newTodo.value.trim()) return

  todos.value.unshift({
    id: Date.now(),
    text: newTodo.value.trim(),
    completed: false,
    priority: newTodoPriority.value,
    category: newTodoCategory.value,
    createdAt: new Date()
  })

  newTodo.value = ''
  saveTodos()
}

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
  }
}

const deleteTodo = (id) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    saveTodos()
  }
}

const startEdit = (todo) => {
  editingTodo.value = todo
  editText.value = todo.text
}

const saveEdit = () => {
  if (editingTodo.value && editText.value.trim()) {
    editingTodo.value.text = editText.value.trim()
    editingTodo.value = null
    saveTodos()
  }
}

const cancelEdit = () => {
  editingTodo.value = null
}
</script>

<style scoped>
.todo-view {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.todo-header {
  background: var(--gradient-hero);
  padding: 60px 24px;
  text-align: center;
}

.todo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Add Todo Section */
.add-todo-section {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.add-todo-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.todo-input {
  flex: 1;
  min-width: 200px;
  padding: 14px 18px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.todo-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(45, 122, 107, 0.1);
}

.priority-select,
.category-select {
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.priority-select:focus,
.category-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.add-btn {
  padding: 14px 28px;
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Filter Section */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 10px 20px;
  border: none;
  border-radius: 24px;
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-light);
}

.filter-tab:hover {
  border-color: var(--border-color);
}

.filter-tab.active {
  background: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

.filter-tab .count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.search-box {
  flex: 1;
  max-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  font-size: 0.9rem;
  background: var(--card-bg);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Todo List */
.todo-list {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: var(--bg-secondary);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
}

.todo-item.priority-high {
  border-left: 4px solid #ef4444;
}

.todo-item.priority-medium {
  border-left: 4px solid #f59e0b;
}

.todo-item.priority-low {
  border-left: 4px solid #10b981;
}

.check-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.check-btn:hover {
  border-color: var(--primary-color);
  background: rgba(45, 122, 107, 0.1);
}

.todo-item.completed .check-btn {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.check-icon {
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
}

.todo-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.todo-main {
  flex: 1;
}

.todo-text {
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.category-tag {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.todo-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.todo-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: var(--bg-tertiary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.edit:hover {
  background: rgba(59, 130, 246, 0.2);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.empty-hint {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.stat-item {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 1px solid var(--border-light);
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-item.completed .stat-value {
  color: #10b981;
}

.stat-item.pending .stat-value {
  color: #f59e0b;
}

.stat-item.high-priority .stat-value {
  color: #ef4444;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
}

.modal-title {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin: 0 0 16px;
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  margin-bottom: 16px;
}

.modal-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.modal-btn.cancel {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.modal-btn.save {
  background: var(--primary-color);
  color: #fff;
}

/* Transitions */
.todo-item-enter-active,
.todo-item-leave-active {
  transition: all 0.3s ease;
}

.todo-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.todo-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .add-todo-form {
    flex-direction: column;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .search-box {
    max-width: none;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .todo-actions {
    opacity: 1;
  }
}
</style>
