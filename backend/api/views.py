from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer
from rest_framework import status

# login view
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # checking if user exists
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # creating or getting token
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'role': user.role,
            'username': user.username
        })
    else:
        return Response({'error': 'Invalid Credentials'}, status=400)

# register view for students
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        # saving the new student
        serializer.save()
        return Response({'message': 'Student registered successfully!'}, status=201)
    return Response(serializer.errors, status=400)

# change password view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user
    new_password = request.data.get('new_password')
    
    if not new_password or len(new_password) < 4:
        return Response({'error': 'Password must be at least 4 chars'}, status=400)
        
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password changed successfully'})

# admin: get all users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list_view(request):
    # checking if user is admin
    if request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=403)
        
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# admin: delete user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_user_view(request):
    if request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=403)
        
    user_id = request.data.get('user_id')
    try:
        user_to_delete = CustomUser.objects.get(id=user_id)
        # preventing admin from deleting themselves
        if user_to_delete.id == request.user.id:
             return Response({'error': 'Cannot delete yourself'}, status=400)
             
        user_to_delete.delete()
        return Response({'message': 'User deleted'})
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

# helper to check admin status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin_view(request):
    return Response({'is_admin': request.user.role == 'admin'})

# admin: create user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_user_view(request):
    if request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=403)
    
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    if not username or not password or not role:
        return Response({'error': 'Missing fields'}, status=400)
        
    if CustomUser.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
        
    try:
        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role
        )
        return Response({'message': 'User created successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
