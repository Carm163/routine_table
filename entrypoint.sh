#!/bin/sh

# Запускаем миграции
python manage.py migrate --noinput

# Запускаем Django через gunicorn
gunicorn myproject.wsgi:application --bind 0.0.0.0:8000