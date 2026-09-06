<template>
  <div class="dt-root">
    <!-- Loading overlay -->
    <div class="dt-loading-overlay" v-if="loading">
      <div class="dt-spinner"></div>
    </div>

    <!-- Table wrapper for scroll -->
    <div
      class="dt-scroll-wrapper"
      :style="{
        maxHeight: scroll.y ? (typeof scroll.y === 'number' ? scroll.y + 'px' : scroll.y) : undefined,
        overflowX: scroll.x ? 'auto' : undefined
      }"
    >
      <table class="dt-table" :style="{ minWidth: scroll.x || undefined }">
        <thead class="dt-thead">
          <tr>
            <th
              v-for="col in columns"
              :key="col.dataIndex || col.key"
              :class="[
                'dt-th',
                fixedClass(col),
                { 'dt-th-sortable': col.sorter }
              ]"
              :style="{
                width: col.width ? col.width + 'px' : undefined,
                minWidth: col.minWidth ? col.minWidth + 'px' : col.width ? col.width + 'px' : undefined
              }"
              @click="handleSort(col)"
            >
              <span>{{ col.title }}</span>
              <span v-if="col.sorter" class="dt-sort-icon">{{ getSortIcon(col) }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="dt-tbody">
          <tr v-if="pagedData.length === 0 && !loading">
            <td :colspan="columns.length" class="dt-empty">暂无数据</td>
          </tr>
          <tr
            v-for="(record, idx) in pagedData"
            :key="record[rowKey] || idx"
            class="dt-row"
          >
            <td
              v-for="col in columns"
              :key="col.dataIndex || col.key"
              :class="[
                'dt-td',
                fixedClass(col),
                { 'dt-td-ellipsis': col.ellipsis }
              ]"
              :style="{
                width: col.width ? col.width + 'px' : undefined,
                minWidth: col.minWidth ? col.minWidth + 'px' : col.width ? col.width + 'px' : undefined
              }"
            >
              <span v-if="col.ellipsis" class="dt-ellipsis-text">
                <component :is="() => renderCell(col, record)" />
              </span>
              <component v-else :is="() => renderCell(col, record)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="dt-pagination" v-if="showPagination">
      <span class="dt-pagination-total" v-if="pagination?.showTotal">
        {{ pagination.showTotal(processedData.length) }}
      </span>
      <div class="dt-pagination-controls">
        <button :disabled="currentPage === 1" @click="goToPage(1)">&laquo;</button>
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">&lsaquo;</button>
        <template v-for="p in totalPages" :key="p">
          <button
            v-if="p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)"
            :class="{ 'dt-page-active': p === currentPage }"
            @click="goToPage(p)"
          >{{ p }}</button>
          <span v-else-if="p === currentPage - 3 || p === currentPage + 3" class="dt-page-ellipsis">...</span>
        </template>
        <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">&rsaquo;</button>
        <button :disabled="currentPage === totalPages" @click="goToPage(totalPages)">&raquo;</button>
      </div>
      <div class="dt-pagination-extra">
        <select
          v-if="pagination?.showSizeChanger !== false"
          :value="pageSize"
          @change="e => { pageSize = Number(e.target.value); currentPage = 1 }"
          class="dt-page-size-select"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }} 条/页</option>
        </select>
        <template v-if="pagination?.showQuickJumper">
          <span class="dt-jump-label">跳至</span>
          <input
            v-model="jumpPage"
            class="dt-jump-input"
            @keyup.enter="doJump"
          />
          <span>页</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, defineComponent } from 'vue'

export default defineComponent({
  props: {
    columns: { type: Array, default: () => [] },
    dataSource: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    rowKey: { type: String, default: 'key' },
    scroll: { type: Object, default: () => ({}) },
    pagination: { type: [Object, Boolean], default: undefined }
  },
  setup(props) {
    const sortKey = ref('')
    const sortOrder = ref(null)

    function handleSort(col) {
      if (!col.sorter) return
      if (sortKey.value !== col.key && sortKey.value !== col.dataIndex) {
        sortKey.value = col.dataIndex || col.key
        sortOrder.value = 'ascend'
      } else if (sortOrder.value === 'ascend') {
        sortOrder.value = 'descend'
      } else if (sortOrder.value === 'descend') {
        sortOrder.value = null
        sortKey.value = ''
      }
    }

    function getSortIcon(col) {
      const key = col.dataIndex || col.key
      if (key !== sortKey.value) return ''
      return sortOrder.value === 'ascend' ? ' ▲' : ' ▼'
    }

    const processedData = computed(() => {
      let data = [...props.dataSource]
      if (sortKey.value && sortOrder.value) {
        const col = props.columns.find(c => (c.dataIndex || c.key) === sortKey.value)
        if (col && col.sorter) {
          data.sort(col.sorter)
          if (sortOrder.value === 'descend') data.reverse()
        }
      }
      return data
    })

    const currentPage = ref(1)
    const pageSize = ref(20)
    const pageSizeOptions = computed(() => {
      if (props.pagination && props.pagination.pageSizeOptions) {
        return props.pagination.pageSizeOptions.map(Number)
      }
      return [10, 20, 50, 100]
    })

    watch(() => props.pagination?.pageSize, (val) => {
      if (val) pageSize.value = val
    }, { immediate: true })

    const totalPages = computed(() => Math.ceil(processedData.value.length / pageSize.value) || 1)
    const showPagination = computed(() => props.pagination !== false && processedData.value.length > 0)

    watch(processedData, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
      }
    })

    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return processedData.value.slice(start, start + pageSize.value)
    })

    function goToPage(page) {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const jumpPage = ref('')
    function doJump() {
      const p = parseInt(jumpPage.value, 10)
      if (!isNaN(p)) goToPage(p)
      jumpPage.value = ''
    }

    function fixedClass(col) {
      if (col.fixed === 'left') return 'dt-cell-fixed-left'
      return ''
    }

    function renderCell(col, record) {
      const val = record[col.dataIndex]
      if (col.customRender) {
        // 模板通过 <component :is="() => renderCell(...)"> 包裹渲染，
        // 这里直接返回原始结果（字符串或 VNode），不要二次包成函数
        return col.customRender({ text: val, record })
      }
      return val ?? ''
    }

    return {
      sortKey, sortOrder, handleSort, getSortIcon,
      processedData, currentPage, pageSize, pageSizeOptions,
      totalPages, showPagination, pagedData,
      goToPage, jumpPage, doJump, fixedClass, renderCell
    }
  }
})
</script>

<style scoped>
.dt-root {
  position: relative;
}

/* Loading */
.dt-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.dt-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e8e8e8;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: dt-spin 0.8s linear infinite;
}
@keyframes dt-spin {
  to { transform: rotate(360deg); }
}

/* Scroll wrapper */
.dt-scroll-wrapper {
  overflow: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

/* Table */
.dt-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.dt-thead {
  position: sticky;
  top: 0;
  z-index: 2;
}

.dt-th {
  background: #fafafa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  user-select: none;
  transition: background 0.2s;
}
.dt-th::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 60%;
  background: #f0f0f0;
}

.dt-th-sortable {
  cursor: pointer;
}
.dt-th-sortable:hover {
  background: #f0f0f0;
}
.dt-sort-icon {
  color: #999;
  font-size: 12px;
}

.dt-row {
  transition: background 0.2s;
}
.dt-row:hover {
  background: #f0f7ff;
}

.dt-td {
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
  position: relative;
}

.dt-td-ellipsis {
  max-width: 0;
}

.dt-ellipsis-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dt-cell-fixed-left {
  position: sticky;
  left: 0;
  z-index: 1;
  background: #fff;
}
.dt-row:hover .dt-cell-fixed-left {
  background: #f0f7ff;
}
.dt-thead .dt-cell-fixed-left {
  z-index: 3;
  background: #fafafa;
}

.dt-empty {
  text-align: center;
  padding: 60px 16px;
  color: #999;
  font-size: 14px;
}

/* Pagination */
.dt-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.dt-pagination-total {
  color: #666;
  font-size: 14px;
  margin-right: auto;
}
.dt-pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
.dt-pagination-controls button {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  transition: all 0.2s;
}
.dt-pagination-controls button:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}
.dt-pagination-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.dt-page-active {
  border-color: #667eea !important;
  background: #667eea !important;
  color: #fff !important;
}
.dt-page-ellipsis {
  padding: 0 2px;
  color: #999;
}
.dt-pagination-extra {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}
.dt-page-size-select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
}
.dt-jump-input {
  width: 48px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .dt-pagination {
    justify-content: center;
    gap: 8px;
  }
  .dt-pagination-total {
    width: 100%;
    text-align: center;
    margin-right: 0;
  }
}
</style>
