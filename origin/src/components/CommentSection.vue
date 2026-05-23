<template>
  <div class="comments-section">
    <h3 class="comments-title">评论 ({{ totalComments }})</h3>

    <div class="comment-form">
      <div class="comment-avatar">
        <img src="https://picsum.photos/seed/user/100/100.jpg" alt="用户头像" />
      </div>
      <div class="comment-input-area">
        <textarea
          v-model="newComment"
          placeholder="写下你的评论..."
          class="comment-textarea"
        ></textarea>
        <div class="comment-actions-row">
          <button class="submit-comment" @click="handleSubmit">发布评论</button>
        </div>
      </div>
    </div>

    <div class="comments-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-avatar">
          <img :src="comment.avatar" :alt="comment.author" />
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-actions">
            <button class="comment-action" @click="$emit('like-comment', comment.id)">
              <span>{{ comment.isLiked ? '❤️' : '🤍' }}</span>
              <span>{{ comment.likes }}</span>
            </button>
            <button class="comment-action" @click="$emit('reply-comment', comment.id)">
              <span>💬</span>
              <span>回复</span>
            </button>
          </div>

          <div v-if="comment.replies && comment.replies.length > 0" class="replies">
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="reply-item"
            >
              <div class="reply-avatar">
                <img :src="reply.avatar" :alt="reply.author" />
              </div>
              <div class="reply-content">
                <div class="reply-header">
                  <span class="reply-author">{{ reply.author }}</span>
                  <span class="reply-date">{{ formatDate(reply.createdAt) }}</span>
                </div>
                <div class="reply-text">{{ reply.content }}</div>
                <div class="reply-actions">
                  <button class="comment-action" @click="$emit('like-reply', reply.id)">
                    <span>{{ reply.isLiked ? '❤️' : '🤍' }}</span>
                    <span>{{ reply.likes }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: { type: Array, default: () => [] },
    totalComments: { type: Number, default: 0 }
  },
  emits: ['submit-comment', 'like-comment', 'reply-comment', 'like-reply'],
  data() {
    return {
      newComment: ''
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('zh-CN', options)
    },
    handleSubmit() {
      if (!this.newComment.trim()) return
      this.$emit('submit-comment', this.newComment)
      this.newComment = ''
    }
  }
}
</script>

<style scoped>
.comments-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #333;
}

.comment-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-input-area {
  flex: 1;
}

.comment-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.comment-textarea:focus {
  outline: none;
  border-color: #2d7a6b;
}

.comment-actions-row {
  display: flex;
  justify-content: flex-end;
}

.submit-comment {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #1e5a4a 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.submit-comment:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
}

.comment-date {
  color: #999;
  font-size: 0.875rem;
}

.comment-text {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #666;
  transition: background-color 0.3s;
}

.comment-action:hover {
  background-color: #f5f5f5;
}

.replies {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.reply-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.reply-author {
  font-weight: 600;
  font-size: 0.875rem;
}

.reply-date {
  color: #999;
  font-size: 0.75rem;
}

.reply-text {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.reply-actions {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .comments-section {
    padding: 1.5rem;
  }

  .comment-form {
    flex-direction: column;
  }
}
</style>
