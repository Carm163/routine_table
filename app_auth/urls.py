from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('table/', views.table_view, name='table'),
    path('logout/', views.logout_view, name='logout'),
    path('task/<int:pk>/delete/', views.delete_task, name='delete_task'),
]