import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_delivery.settings')
django.setup()

from django.contrib.auth.models import User

# Create admin user
email = 'islemchettouf@gmail.com'
password = 'admin123'
username = 'admin'

# Check if user already exists
if User.objects.filter(email=email).exists():
    user = User.objects.get(email=email)
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"Admin user updated: {email}")
elif User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    user.email = email
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"Admin user updated: {email}")
else:
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"Admin user created: {email}")

print(f"Username: {user.username}")
print(f"Email: {user.email}")
print("Password: admin123")
print("You can now log in with these credentials.")
