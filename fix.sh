#!/usr/bin/env bash
set -eu      # 途中で失敗したら止める

# ホスト側操作 
echo "ホスト側を $(id -un):$(id -gn) に chown 中..."
sudo chown -R "$USER":"$USER" .

# コンテナ側操作
echo "app コンテナ内の storage 権限を修正..."
docker compose exec app bash -c \
  "chown -R www-data:www-data /app/storage && chmod -R 775 /app/storage"

echo "権限修正完了!"