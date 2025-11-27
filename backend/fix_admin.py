import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_project_backend.settings')
django.setup()

from api.models import CustomUser

try:
    user = CustomUser.objects.get(username='admin')
    print(f"User 'admin' found. Role: {user.role}")
    
    if user.role != 'admin':
        print("Fixing admin role...")
        user.role = 'admin'
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print("User 'admin' is now an admin.")
    else:
        print("User 'admin' is already an admin.")
        
except CustomUser.DoesNotExist:
    print("User 'admin' does not exist. Creating it...")
    CustomUser.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpassword',
        role='admin'
    )
    print("Admin user created.")
