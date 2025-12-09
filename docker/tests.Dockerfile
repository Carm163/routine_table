FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Создаём рабочую директорию в контейнере
WORKDIR /tests

# Копируем только package.json и package-lock.json — это быстрее
COPY playwright_tests/package.json ./
COPY playwright_tests/package-lock.json ./

# Установка зависимостей
RUN npm install --legacy-peer-deps

# Копируем сами тесты
COPY playwright_tests/ .

# По умолчанию команда — запуск тестов
CMD ["npx", "playwright", "test"]