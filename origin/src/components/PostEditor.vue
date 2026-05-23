<template>
  <div class="editor-form">
    <div class="form-group">
      <label for="title">文章标题</label>
      <input
        id="title"
        type="text"
        :value="postForm.title"
        @input="$emit('update:postForm', { ...postForm, title: $event.target.value })"
        placeholder="请输入文章标题"
        class="form-input"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="category">分类</label>
        <select
          id="category"
          :value="postForm.categoryId"
          @change="$emit('update:postForm', { ...postForm, categoryId: $event.target.value })"
          class="form-select"
        >
          <option value="">请选择分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="coverImage">封面图片</label>
        <input
          id="coverImage"
          type="text"
          :value="postForm.coverImage"
          @input="$emit('update:postForm', { ...postForm, coverImage: $event.target.value })"
          placeholder="请输入图片URL"
          class="form-input"
        />
      </div>
    </div>

    <div class="form-group">
      <label>标签</label>
      <div class="tag-selector">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="tag-option"
          :class="{ selected: postForm.tagIds.includes(tag.id) }"
          :style="{ borderColor: tag.color }"
          @click="$emit('toggle-tag', tag.id)"
        >
          {{ tag.name }}
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="excerpt">文章摘要</label>
      <textarea
        id="excerpt"
        :value="postForm.excerpt"
        @input="$emit('update:postForm', { ...postForm, excerpt: $event.target.value })"
        placeholder="请输入文章摘要"
        class="form-textarea"
        rows="3"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="content">文章内容</label>
      <div class="editor-toolbar">
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '**', '**')">
          <strong>B</strong>
        </button>
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '*', '*')">
          <em>I</em>
        </button>
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '## ', '')">
          H2
        </button>
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '### ', '')">
          H3
        </button>
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '[', '](url)')">
          链接
        </button>
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '```\n', '\n```')">
          代码
        </button>
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '- ', '')">
          列表
        </button>
        <button type="button" class="toolbar-button" @click="$emit('insert-markdown', '> ', '')">
          引用
        </button>
      </div>
      <textarea
        id="content"
        :value="postForm.content"
        @input="$emit('update:postForm', { ...postForm, content: $event.target.value })"
        placeholder="请输入文章内容，支持Markdown格式"
        class="form-textarea content-textarea"
        rows="20"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="status">发布状态</label>
      <select
        id="status"
        :value="postForm.status"
        @change="$emit('update:postForm', { ...postForm, status: $event.target.value })"
        class="form-select"
      >
        <option value="draft">草稿</option>
        <option value="published">已发布</option>
      </select>
    </div>

    <div class="form-actions">
      <button class="preview-button" @click="$emit('preview')">
        <span class="preview-icon">👁</span>
        预览
      </button>
      <button class="save-button" @click="$emit('save')">
        <span class="save-icon">💾</span>
        保存
      </button>
      <button class="publish-button" @click="$emit('publish')" v-if="postForm.status === 'draft'">
        <span class="publish-icon">🚀</span>
        发布
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    postForm: { type: Object, required: true },
    categories: { type: Array, default: () => [] },
    tags: { type: Array, default: () => [] }
  },
  emits: ['update:postForm', 'save', 'publish', 'preview', 'toggle-tag', 'insert-markdown']
}
</script>

<style scoped>
.editor-form {
  max-width: 800px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #2d7a6b;
}

.form-textarea {
  resize: vertical;
}

.content-textarea {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e0e0e0;
  border-bottom: none;
}

.toolbar-button {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.toolbar-button:hover {
  background-color: #f0f0f0;
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-option {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-option:hover {
  background-color: #f5f5f5;
}

.tag-option.selected {
  background-color: rgba(45, 122, 107, 0.1);
  border-color: #2d7a6b;
  color: #2d7a6b;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.preview-button, .save-button, .publish-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.preview-button {
  background-color: #f5f5f5;
  color: #666;
}

.preview-button:hover {
  background-color: #e0e0e0;
}

.save-button {
  background: linear-gradient(135deg, #8b6f47 0%, #6b5537 100%);
  color: white;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 111, 71, 0.3);
}

.publish-button {
  background: linear-gradient(135deg, #2d7a6b 0%, #1e5a4a 100%);
  color: white;
}

.publish-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
