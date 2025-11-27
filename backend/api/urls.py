from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('change-password/', views.change_password_view, name='change_password'),
    path('users/', views.user_list_view, name='user_list'),
    path('users/create/', views.admin_create_user_view, name='admin_create_user'),
    path('users/delete/', views.delete_user_view, name='delete_user'),
    path('check-admin/', views.check_admin_view, name='check_admin'),
]
