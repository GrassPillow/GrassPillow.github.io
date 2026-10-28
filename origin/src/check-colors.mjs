/**
 * 颜色 token 合规检查
 *
 * 校验目标：
 * 1. 活动组件与视图中不存在裸十六进制颜色
 * 2. 所有 rgba()/rgb() 的颜色通道均由 var(--*-rgb) token 提供
 * 3. [data-theme="dark"] 覆盖 :root 中定义的全部颜色类 token
 *
 * 用法：node origin/src/check-colors.mjs
 */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const SRC = new URL('.', import.meta.url).pathname

const FILES = [
  'App.vue',
  'components/Toast.vue',
  'components/BackToTop.vue',
  'components/ThemeToggle.vue',
  'components/ResourceCard.vue',
  'components/PageTransition.vue',
  'views/HomeView.vue',
  'views/ResourceView.vue'
]

// 剥离两处调色板块，它们本身就是颜色定义处
const stripPalettes = s =>
  s.replace(/:root \{[\s\S]*?\n\}/, '').replace(/\[data-theme="dark"\] \{[\s\S]*?\n\}/, '')

const HEX = /#[0-9a-fA-F]{3,8}\b/
// 允许一层嵌套括号：rgba(var(--x-rgb), .5) 中的 var(...) 自带括号
const RGB_FN = /rgba?\((?:[^;{}()]|\([^()]*\))*\)/g
// 合规形态：rgba(var(--xxx-rgb), 0.5)
const VALID_RGB = /^rgba?\(\s*var\(--[a-z0-9-]+-rgb\)\s*,\s*[\d.]+\s*\)$/

let errors = 0

for (const file of FILES) {
  const lines = stripPalettes(readFileSync(join(SRC, file), 'utf8')).split('\n')
  lines.forEach((line, i) => {
    if (HEX.test(line)) {
      console.error(`✗ ${file}:${i + 1} 裸十六进制 → ${line.trim()}`)
      errors++
    }
    for (const call of line.match(RGB_FN) || []) {
      if (!VALID_RGB.test(call.trim())) {
        console.error(`✗ ${file}:${i + 1} 颜色未走 token → ${call.trim()}`)
        errors++
      }
    }
  })
}

// dark 块须覆盖全部颜色类 token
const app = readFileSync(join(SRC, 'App.vue'), 'utf8')
const names = block => [...block.matchAll(/^\s+(--[a-z0-9-]+):/gm)].map(m => m[1])
const isColor = n => n.startsWith('--c-') || n.startsWith('--shadow')
const rootTokens = names(app.match(/:root \{([\s\S]*?)\n\}/)[1]).filter(isColor)
const darkTokens = names(app.match(/\[data-theme="dark"\] \{([\s\S]*?)\n\}/)[1]).filter(isColor)

const missing = rootTokens.filter(t => !darkTokens.includes(t))
const extra = darkTokens.filter(t => !rootTokens.includes(t))
if (missing.length) {
  console.error(`✗ [data-theme="dark"] 缺少取值：${missing.join(', ')}`)
  errors += missing.length
}
if (extra.length) {
  console.error(`✗ [data-theme="dark"] 多出取值：${extra.join(', ')}`)
  errors += extra.length
}

// 全站禁用 CSS 渐变
const allFiles = [...FILES, ...readdirSync(join(SRC, 'components')).map(f => join('components', f))]
for (const file of new Set(allFiles)) {
  const content = readFileSync(join(SRC, file), 'utf8')
  if (/(linear|radial|conic)-gradient/.test(content)) {
    console.error(`✗ ${file} 含 CSS 渐变`)
    errors++
  }
}

console.log(`\n颜色类 token：:root ${rootTokens.length} 个，dark ${darkTokens.length} 个`)
if (errors === 0) {
  console.log('✓ 通过：零颜色字面量，全部经由 var(--*-rgb)；dark 覆盖完整；无渐变')
} else {
  console.error(`✗ 共 ${errors} 处不合规`)
  process.exit(1)
}
