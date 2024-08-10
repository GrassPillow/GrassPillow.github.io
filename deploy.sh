echo "deploying"
#删除index.html
rm -rf index.html
#删除favicon.ico
rm -rf favicon.ico
#删除css文件夹
rm -rf css
#删除js文件夹
rm -rf js
echo "删除完成"
cd a-origin
npm run build
echo "build完成"
cd dist
#复制index.html到上级的上级目录
cp -r index.html ../..
#复制favicon.ico到上级的上级目录
cp -r favicon.ico ../..
#复制css文件夹到上级的上级目录
cp -r css ../..
#复制js文件夹到上级的上级目录
cp -r js ../..
echo "复制完成"