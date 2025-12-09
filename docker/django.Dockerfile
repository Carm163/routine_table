FROM python:3.12-slim

WORKDIR /app

# Установим системные зависимости для сборки
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Скопируем зависимости
COPY requirements.txt .

# Установка Python-зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект в контейнер
COPY . .

# Django будет слушать все интерфейсы
ENV PYTHONUNBUFFERED=1

# Открываем порт
EXPOSE 8000

# Команда запуска для docker-compose
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]