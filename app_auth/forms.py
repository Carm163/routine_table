from django import forms
from .models import TaskItem
from django.utils import timezone

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

class TaskItemForm(forms.ModelForm):
    class Meta:
        model = TaskItem
        fields = ['task', 'done_date', 'period_days']
        widgets = {
            'done_date': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean_period_days(self):
        pd = self.cleaned_data.get('period_days')
        if pd is None or pd < 1:
            raise forms.ValidationError("Периодичность должна быть целым числом >= 1")
        return pd

    def clean_done_date(self):
        dd = self.cleaned_data.get('done_date')
        if dd is None:
            raise forms.ValidationError("Укажи дату выполнения")
        # можно добавить дополнительные проверки (например, не в будущем)
        return dd