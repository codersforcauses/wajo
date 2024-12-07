# Create your views here.
# views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import UserCreationForm


@login_required
def admin_create_user(request):
    if not request.user.extendeduser.is_admin():
        return redirect('not-authorized')

    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        form.save(created_by=request.user)
        return redirect('success')
    return render(request, 'admin_create_user.html', {'form': form})


@login_required
def teacher_create_student(request):
    if not request.user.extendeduser.is_teacher():
        return redirect('not-authorized')

    form = UserCreationForm(request.POST or None, initial={'role': 'Student'})
    form.fields['role'].widget.attrs['readonly'] = True
    if form.is_valid():
        form.save(created_by=request.user)
        return redirect('success')

    return render(request, 'teacher_create_student.html', {'form': form})
