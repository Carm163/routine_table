from django.db import models
from django.conf import settings

class TaskItem(models.Model):
    objects = None
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    task = models.CharField("Обязаловка", max_length=260)
    done_date = models.DateField("Когда выполнено")
    period_days = models.PositiveIntegerField("Периодичность (дней)", help_text="Введите целое количество дней (>=1)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"
        ordering = ['id']

    def __str__(self):
        return f"{self.task} ({self.user})"