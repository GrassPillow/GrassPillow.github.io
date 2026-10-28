/**
 * 简易 CSV 解析（resources.csv 使用）
 * - 支持引号包裹字段（字段内含逗号）
 * - 支持转义引号 "" -> "
 * - 支持字段内换行（引号内的新行不作为行分隔符）
 * - 兼容 CRLF 换行
 * - 返回按首行表头组织的对象数组
 */

export function parseCSV(csvText) {
  if (!csvText || !csvText.trim()) {
    return []
  }

  // 归一化 CRLF，避免 \r 混入最后一个字段
  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 按行切分，但引号内的换行需要与前后行合并
  const records = []
  let current = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (char === '"') {
      // 引号内的 "" 表示字面引号
      if (inQuotes && text[i + 1] === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      current.push(field.trim())
      field = ''
      continue
    }

    if (char === '\n' && !inQuotes) {
      current.push(field.trim())
      field = ''
      // 跳过完全空白的记录
      if (current.some(v => v !== '')) {
        records.push(current)
      }
      current = []
      continue
    }

    field += char
  }

  // 处理文件末尾没有换行符的情况
  if (field !== '' || current.length > 0) {
    current.push(field.trim())
    if (current.some(v => v !== '')) {
      records.push(current)
    }
  }

  if (records.length < 2) {
    return []
  }

  // 去除表头与字段名两端的 BOM 和空白
  const headers = records[0].map(h => h.replace(/^\uFEFF/, '').trim())
  const data = []

  for (let i = 1; i < records.length; i++) {
    const values = records[i]
    // 列数与表头不一致的行直接跳过（数据格式错误）
    if (values.length !== headers.length) {
      continue
    }
    const item = {}
    headers.forEach((header, index) => {
      item[header] = values[index] || ''
    })
    data.push(item)
  }

  return data
}
