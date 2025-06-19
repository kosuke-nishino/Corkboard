#!/bin/bash
 
PROJECT_PATH=~/Corkboard
 
# プロジェクトに移動
cd $PROJECT_PATH || exit
 
# VSCodeを開く
code .
 
# Dockerを起動
docker compose up -d
 
# Git masterブランチを最新に
    git checkout main
    git pull origin main
 
# コンテナ内でnpm run devを実行
docker compose exec app bash -c "npm run dev"
 
echo ""
echo "Docker起動＆Git main更新・npm run dev が完了しました！"
echo "この後絶対ブランチ作成や切り替えしてね！（例：git checkout -b something）"