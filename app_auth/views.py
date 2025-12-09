from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm
from django.utils import timezone
from datetime import timedelta
from .models import TaskItem
from .forms import TaskItemForm

def login_view(request):
    if request.user.is_authenticated:
        return redirect('table')

    message = ''
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return redirect('table')
            message = 'Неверные данные'
    else:
        form = LoginForm()

    return render(request, 'app_auth/login.html', {'form': form, 'message': message})

@login_required
def table_view(request):
    # today в локальной дате (учитывает TIME_ZONE)
    today = timezone.localdate()

    # обработка формы добавления новой записи
    if request.method == 'POST':
        form = TaskItemForm(request.POST)
        if form.is_valid():

            # 🔽 ДОБАВЛЯЕМ ПРОВЕРКУ ПЕРИОДИЧНОСТИ
            if form.cleaned_data['period_days'] <= 0:
                qs = TaskItem.objects.filter(user=request.user)

                # пересчитываем rows, как ниже в коде
                today = timezone.localdate()
                rows = []
                for obj in qs:
                    next_date = obj.done_date + timedelta(days=obj.period_days)
                    days_left = (next_date - today).days
                    rows.append({
                        'id': obj.id,
                        'task': obj.task,
                        'done_date': obj.done_date,
                        'period_days': obj.period_days,
                        'next_date': next_date,
                        'days_left': days_left,
                        'obj': obj,
                    })
                rows_sorted = sorted(rows, key=lambda r: r['days_left'])

                # 🔽 ВОЗВРАЩАЕМ ОШИБКУ В ШАБЛОН
                return render(
                    request,
                    'app_auth/table.html',
                    {
                        'today': today,
                        'rows': rows_sorted,
                        'form': form,
                        'error': "Периодичность должна быть больше нуля!",
                    }
                )

            # 🔽 ЕСЛИ ВСЁ ОК — СОХРАНЯЕМ ЗАДАЧУ
            task_item = form.save(commit=False)
            task_item.user = request.user
            task_item.save()
            return redirect('table')
    else:
        form = TaskItemForm()

    # получаем все записи текущего пользователя
    qs = TaskItem.objects.filter(user=request.user)

    # Для каждого объекта рассчитываем next_date и days_left, и формируем список словарей.
    rows = []
    for obj in qs:
        next_date = obj.done_date + timedelta(days=obj.period_days)
        days_left = (next_date - today).days
        rows.append({
            'id': obj.id,
            'task': obj.task,
            'done_date': obj.done_date,
            'period_days': obj.period_days,
            'next_date': next_date,
            'days_left': days_left,
            'obj': obj,
        })

    # сортируем по days_left (возрастание: от меньшего к большему)
    rows_sorted = sorted(rows, key=lambda r: r['days_left'])

    context = {
        'today': today,
        'rows': rows_sorted,
        'form': form,
    }
    return render(request, 'app_auth/table.html', context)

@login_required
def delete_task(request, pk):
    t = get_object_or_404(TaskItem, pk=pk, user=request.user)
    if request.method == 'POST':
        t.delete()
        return redirect('table')
    return render(request, 'app_auth/confirm_delete.html', {'task': t})

def logout_view(request):
    logout(request)
    return redirect('login')