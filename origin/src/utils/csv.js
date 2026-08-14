/**
 * 简易 CSV 解析（books.csv / ai-websites.csv 共用）
 * - 支持引号包裹字段（字段内含逗号）
 * - 支持转义引号 "" -> "
 * - 返回按首行表头组织的对象数组
 */
export function parseCSV(csvText) {
  if (!csvText || !csvText.trim()) {
    return []
  }

  const lines = csvText.trim().split('\n').filter(line => line.trim())
  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(',').map(h => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = []
    let currentValue = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        // 转义引号 "" 表示字面引号
        if (inQuotes && line[j + 1] === '"') {
          currentValue += '"'
          j++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim())
        currentValue = ''
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())

    // 字段数不匹配的行直接跳过（表头/数据列不一致）
    if (values.length === headers.length) {
      const item = {}
      headers.forEach((header, index) => {
        item[header] = values[index] || ''
      })
      data.push(item)
    }
  }

  return data
}
