from django.contrib import admin
from .models import CustomUser

# registering the model so i can see it in admin panel
admin.site.register(CustomUser)
