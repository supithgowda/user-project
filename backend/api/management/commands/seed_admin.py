from django.core.management.base import BaseCommand
from api.models import CustomUser

class Command(BaseCommand):
    help = 'Creates a default admin user'

    def handle(self, *args, **options):
        # checking if admin exists
        if not CustomUser.objects.filter(username='admin').exists():
            CustomUser.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='adminpassword',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))
        else:
            self.stdout.write(self.style.SUCCESS('Admin user already exists'))
