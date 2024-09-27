# 开始时间
start_time=$(date "+%Y-%m-%d %H:%M:%S")

echo "deploying start " $(date "+%Y-%m-%d %H:%M:%S")

echo "开始删除 " $(date "+%Y-%m-%d %H:%M:%S")
#删除index.html
rm -rf index.html
#删除favicon.ico
rm -rf favicon.ico
#删除css文件夹
rm -rf css
#删除js文件夹
rm -rf js
echo "删除完成 " $(date "+%Y-%m-%d %H:%M:%S")

echo "开始构建 " $(date "+%Y-%m-%d %H:%M:%S")
cd a-origin
npm run build
echo "构建完成 " $(date "+%Y-%m-%d %H:%M:%S")

echo "开始复制 " $(date "+%Y-%m-%d %H:%M:%S")
cd dist
#复制index.html到上级的上级目录
cp -r index.html ../..
#复制favicon.ico到上级的上级目录
cp -r favicon.ico ../..
#复制css文件夹到上级的上级目录
cp -r css ../..
#复制js文件夹到上级的上级目录
cp -r js ../..
echo "复制完成 " $(date "+%Y-%m-%d %H:%M:%S")

# 结束时间
end_time=$(date "+%Y-%m-%d %H:%M:%S")

# 计算执行时间
exec_time=$(echo $end_time $start_time | awk '{print $1 - $2}')

echo "整个部署过程执行时间：$exec_time 毫秒"
