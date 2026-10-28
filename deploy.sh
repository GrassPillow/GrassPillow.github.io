#!/usr/bin/env bash
# 任何一步失败立即退出，避免"构建失败仍继续复制/误删"的脏部署
set -e

# 始终以脚本所在目录（仓库根）为目标，避免在其他目录执行时删错文件
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# 开始时间（用秒级时间戳做差，字符串相减得不到耗时）
start_time=$(date +%s)

echo "deploying start $(date "+%Y-%m-%d %H:%M:%S")"
echo "仓库根目录: $ROOT_DIR"

echo "开始删除 $(date "+%Y-%m-%d %H:%M:%S")"
# 保留的文件和文件夹列表
KEEP_ITEMS=(".idea" "origin" ".gitignore" "deploy.sh" "README.md" ".git" "CLAUDE.md" ".claude" "openspec")

# 遍历当前目录下的所有文件和文件夹
for item in * .*; do
  # 跳过 . 和 ..
  if [ "$item" = "." ] || [ "$item" = ".." ]; then
    continue
  fi
  
  # 检查是否在保留列表中
  should_keep=false
  for keep_item in "${KEEP_ITEMS[@]}"; do
    if [ "$item" = "$keep_item" ]; then
      should_keep=true
      break
    fi
  done
  
  # 如果不在保留列表中，则删除
  if [ "$should_keep" = false ]; then
    echo "删除: $item"
    rm -rf "$item"
  fi
done
echo "删除完成 " $(date "+%Y-%m-%d %H:%M:%S")

echo "开始构建 " $(date "+%Y-%m-%d %H:%M:%S")
cd origin
npm run build
echo "构建完成 " $(date "+%Y-%m-%d %H:%M:%S")

echo "开始复制 " $(date "+%Y-%m-%d %H:%M:%S")
cd dist
# 复制dist文件夹下的所有文件和文件夹到上级的上级目录
for item in * .*; do
  # 跳过 . 和 ..
  if [ "$item" = "." ] || [ "$item" = ".." ]; then
    continue
  fi
  
  # 复制文件或文件夹到上级的上级目录
  if [ -e "$item" ]; then
    echo "复制: $item"
    cp -r "$item" ../..
  fi
done
echo "复制完成 " $(date "+%Y-%m-%d %H:%M:%S")

# 结束时间
end_time=$(date +%s)

# 计算执行时间（秒）
exec_time=$((end_time - start_time))

echo "整个部署过程执行时间：${exec_time} 秒"
echo "构建产物已复制到仓库根目录，部署完成后请执行："
echo "  git add index.html 404.html css js favicon.ico resources.csv"
