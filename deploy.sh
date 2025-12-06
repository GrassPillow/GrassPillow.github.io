# 开始时间
start_time=$(date "+%Y-%m-%d %H:%M:%S")

echo "deploying start " $(date "+%Y-%m-%d %H:%M:%S")

echo "开始删除 " $(date "+%Y-%m-%d %H:%M:%S")
# 保留的文件和文件夹列表
KEEP_ITEMS=(".idea" "a-origin" ".gitignore" "deploy.sh" "README.md")

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
cd a-origin
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
end_time=$(date "+%Y-%m-%d %H:%M:%S")

# 计算执行时间
exec_time=$(echo $end_time $start_time | awk '{print $1 - $2}')

echo "整个部署过程执行时间：$exec_time 毫秒"
