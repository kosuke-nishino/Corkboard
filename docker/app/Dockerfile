FROM php:8.3-fpm

# タイムゾーンと必要パッケージ
ENV TZ Asia/Tokyo

RUN apt-get update && \
    apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    nodejs \
    npm && \
    docker-php-ext-install intl pdo_mysql zip bcmath

# 任意でNodeのバージョン確認
RUN node -v && npm -v

COPY ./docker/app/php.ini /usr/local/etc/php/php.ini

WORKDIR /app