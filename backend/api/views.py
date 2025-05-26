from rest_framework import viewsets
from django.core.mail import send_mail
from rest_framework import status, generics
from rest_framework.response import Response
from django.utils import timezone
from .serializers import IssueSerializer, LecturerSerializer, DepartmentSerializer, CourseSerializer, UserUpdateSerializer
from .models import *   
from rest_framework.exceptions import PermissionDenied
from .serializers import *  # Import all serializers
from .serializers import CourseSerializer, UserUpdateSerializer  # Explicitly import required serializers
from rest_framework.exceptions import PermissionDenied
from django.http import JsonResponse
from .permissions import IsRegistrar, IsLecturer, IsStudent 
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.shortcuts import  get_object_or_404
import random
from django.core.cache import cache  # Import Django cache
import logging  # Import logging module

# Configure logger
logger = logging.getLogger(__name__)


User = get_user_model()

def generate_otp():
    return str(random.randint(100000, 999999))


# Signup View


# @api_view(['POST'])
# def signup(request):
#     email = request.data.get('email')
#     fullname = request.data.get('fullname')
#     password = request.data.get('password')
#     role = request.data.get('role', 'student')
    
#     if not email or not password:
#         return JsonResponse({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
#     if User.objects.filter(email=email).exists():
#         return JsonResponse({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
#     otp = generate_otp()
#     cache.set(f'otp_{email}', {'otp': otp, 'fullname': fullname, 'password': password, 'role': role}, timeout=600)  # Store OTP for 10 minutes

#     send_mail('Your OTP Code', f'Your OTP is {otp}', 'Group-A-AITS@mail.com', [email])
#     return JsonResponse({'message': 'OTP sent to your email!'}, status=status.HTTP_201_CREATED)

# @api_view(['POST'])
# def login(request):
#     email = request.data.get('email')
#     password = request.data.get('password')
    
#     if not email or not password:
#         return JsonResponse(
#             {'error': 'Email and password are required'}, 
#             status=status.HTTP_400_BAD_REQUEST
#         )
        
#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         return JsonResponse(
#             {'error': 'Invalid email or password'}, 
#             status=status.HTTP_400_BAD_REQUEST
#         )
        
#     if not user.check_password(password):
#         return JsonResponse(
#             {'error': 'Invalid email or password'}, 
#             status=status.HTTP_400_BAD_REQUEST
#         )
        
#     refresh = RefreshToken.for_user(user)
    
#     return JsonResponse({
#         'access': str(refresh.access_token),
#         'refresh': str(refresh),
#         'role': user.role,
#         'fullname': user.fullname,
#         'email': user.email
#     }, status=status.HTTP_200_OK)
    
# @api_view(['POST'])
# def verify_otp(request):
#     email = request.data.get('email')
#     otp = request.data.get('otp')

#     if not email or not otp:
#         return JsonResponse({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
    
#     cached_data = cache.get(f'otp_{email}')
#     if not cached_data:
#         return JsonResponse({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
    
#     if cached_data['otp'] == otp:
#         # Create user after OTP verification
#         user = User.objects.create_user(
#             fullname=cached_data['fullname'], 
#             email=email, 
#             password=cached_data['password'], 
#             role=cached_data['role']
#         )
        
#         user.is_verified = True
#         user.save()
        
#         cache.delete(f'otp_{email}')  # Clear OTP data

#         refresh = RefreshToken.for_user(user)
#         return JsonResponse({'token': str(refresh.access_token), 'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)

#     return JsonResponse({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    fullname = request.data.get('fullname')
    password = request.data.get('password')
    role = request.data.get('role', 'student')

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if role not in ['student', 'lecturer', 'registrar']:
        return JsonResponse({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
    
    otp = generate_otp()
    cache.set(f'otp_{email}', {'otp': otp, 'fullname': fullname, 'password': password, 'role': role}, timeout=600)  # Store OTP for 10 minutes

    # print({"signup:": cache.get(f"otp_{email}")})
    send_mail('Your OTP Code', f'Your OTP is {otp}', 'Group-A-AITS@mail.com', [email])
    return JsonResponse({'message': 'OTP sent to your email!'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
# @permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return JsonResponse(
            {'error': 'Email and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse(
            {'error': 'Invalid email or password'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(password):
        return JsonResponse(
            {'error': 'Invalid email or password'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    refresh = RefreshToken.for_user(user)
    
    return JsonResponse({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'role': user.role,
        'fullname': user.fullname,
        'email': user.email
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
# @permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')

    if not email:
        return JsonResponse(
            {'error': 'Email is are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if user := User.objects.filter(email=email).exists():
        otp = generate_otp()
        cache.set(f'forgot_password_{email}', {'otp': otp}, timeout=600)  # Store OTP for 10 minutes
        body = f"Someone requested a password reset for your account. If you didn't request this, you can ignore this email. Your OTP is: {otp}"
        send_mail('Password Reset Request', body, 'Group-A-AITS@mail.com', [email])

    return JsonResponse({'message': 'A password reset code has been sent to your email!'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
# @permission_classes([AllowAny])
def change_password(request):
    email = request.data.get('email')
    new_password = request.data.get('new_password')
    otp = request.data.get('otp')
    flow = request.data.get('flow')

    if not new_password:
        return JsonResponse(
            {'error': 'New password is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    match flow:
        case 'forgot_password':
            cached_data = cache.get(f'forgot_password_{email}')
            if not cached_data or cached_data['otp'] != otp:
                return JsonResponse({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        case _:
            return JsonResponse({'error': 'Invalid flow'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.get(email=email)
    user.set_password(new_password)
    user.save()
    cache.delete(f'forgot_password_{email}')
    
    return JsonResponse({'message': 'Password changed successfully!'}, status=status.HTTP_200_OK)


@api_view(['POST'])
# @permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    

    if not email or not otp:
        return JsonResponse({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

    cached_data = cache.get(f'otp_{email}')

    # print({"verify:": cache.get(f"otp_{email}"), 'verify:otp': otp})
    
    if not cached_data:
        return JsonResponse({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

    if cached_data['otp'] == otp:
        # Create user after OTP verification
        user = User.objects.create_user(
            fullname=cached_data['fullname'], 
            email=email, 
            password=cached_data['password'], 
            role=cached_data['role']
        )
        user.is_verified = True
        user.save()

        cache.delete(f'otp_{email}')  # Clear OTP data

        refresh = RefreshToken.for_user(user)
        return JsonResponse({'token': str(refresh.access_token), 'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)

    return JsonResponse({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
# @permission_classes([AllowAny])
def resend_otp(request):
    email = request.data.get('email')
    # if not email:
    #     return JsonResponse({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # user = User.objects.filter(email=email).first()
    # if not user:
    #     return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # user.otp = generate_otp()
    # user.otp_created_at = timezone.now()  # Reset the OTP timestamp
    # user.save()
    # send_mail('Your OTP Code', f'Your OTP is {user.otp}', 'AITS@mail.com', [email])
    
    cached_data = cache.get(f'otp_{email}')
    
    if not cached_data:
        return JsonResponse({'error': 'Sorry, your session has probably expired, please repeat the process'}, status=status.HTTP_400_BAD_REQUEST)

    otp = generate_otp()
    cached_data['otp'] = otp
    cache.set(f'otp_{email}', cached_data, timeout=600)  # Store OTP for 10 minutes

    send_mail('Your OTP Code', f'Your OTP is {otp}', 'AITS@mail.com', [email])
    return JsonResponse({'message': 'OTP resent successfully!'}, status=status.HTTP_200_OK)

    
class DepartmentView(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsRegistrar]

    def get_queryset(self):
        return Department.objects.all()

    def perform_create(self, serializer):
        serializer.save()
    

class IssueView(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    

class CourseView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsRegistrar]
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        return Course.objects.all().select_related('department')
    
    def perform_create(self, serializer):
        department = serializer.validated_data.get('department')
        if not Department.objects.filter(id=department.id).exists():
            raise serializer.ValidationError("Department does not exist")
        serializer.save()
    
class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsRegistrar]
    


from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework import generics
from django.contrib.auth import get_user_model

User = get_user_model()

from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework import generics
from django.contrib.auth import get_user_model

User = get_user_model()

class IssueView(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    
    def get_user_from_request(self):
        """Helper method to safely get and validate user from request"""
        user = getattr(self.request, 'user', None)
        print(f"Raw user from request: {user}")
        print(f"User type: {type(user)}")
        print(f"User is authenticated: {user.is_authenticated if user else 'No user'}")
        print(f"User ID: {getattr(user, 'id', 'No ID')}")
        print(f"User username: {getattr(user, 'username', 'No username')}")
        print(f"User email: {getattr(user, 'email', 'No email')}")
        print(f"User role: {getattr(user, 'role', 'No role')}")
        
        if not user or not user.is_authenticated:
            print("User authentication failed - raising AuthenticationFailed")
            raise AuthenticationFailed('Authentication required')
        
        return user
    
    def get_queryset(self):
        user = self.get_user_from_request()
        user_email = user.email
        print(f"Getting queryset for user email: {user_email}, role: {user.role}")
        
        if user.role == 'student':
            # Find issues created by students with this email
            # We'll filter by the student's email field directly
            queryset = Issue.objects.filter(student__email=user_email).distinct()
            print(f"Student issues by email queryset count: {queryset.count()}")
            
            # Log each issue found
            for issue in queryset:
                print(f"Found issue: {issue.id} - {issue.title} - {issue.status} - Student: {issue.student.email}")
            
            return queryset
                
        elif user.role == 'lecturer':
            # Return issues assigned to lecturers with this email
            queryset = Issue.objects.filter(assigned_to__email=user_email)
            print(f"Lecturer issues queryset count: {queryset.count()}")
            return queryset
                
        elif user.role == 'registrar':
            # Return all issues for registrars
            print("User is registrar - returning all issues")
            queryset = Issue.objects.all()
            print(f"Registrar queryset count: {queryset.count()}")
            return queryset
            
        else:
            print(f"Unknown role: {user.role}")
            return Issue.objects.none()
    
    def perform_create(self, serializer):
        user = self.get_user_from_request()
        user_email = user.email
        print(f"Creating issue for user email: {user_email}, role: {user.role}")
        print(f"Validated data: {serializer.validated_data}")
        
        if user.role == 'student':
            try:
                from .models import Student
                # Get student instance by email
                student_instance = Student.objects.get(email=user_email)
                print(f"Found student by email for creation: {student_instance}")
                
                course = serializer.validated_data.get('course')
                print(f"Issue course: {course}")
                
                # Only check course enrollment if a course is specified
                if course:
                    enrolled_courses = student_instance.enrolled_courses.all()
                    print(f"Student enrolled courses: {list(enrolled_courses)}")
                    
                    if course not in enrolled_courses:
                        print(f"Permission denied: Student not enrolled in course {course}")
                        raise PermissionDenied('You can only report issues for courses you are enrolled in.')
                    print("Student is enrolled in course - proceeding with save")
                else:
                    print("No course specified - proceeding with save")
                
                # Save with the student instance
                issue = serializer.save(student=student_instance)
                print(f"Issue created successfully: {issue}")
                print(f"Issue ID: {issue.id}")
                print(f"Issue student email: {issue.student.email}")
                print(f"Issue course: {issue.course}")
                
            except Student.DoesNotExist:
                print(f"Student.DoesNotExist for email: {user_email}")
                raise PermissionDenied(f'Student profile not found for email: {user_email}')
                
        else:
            print(f"Permission denied: Only students can create issues. User role: {user.role}")
            raise PermissionDenied('Only students can create issues.')
    
    def get_object(self):
        """Override to handle detail views (GET, PUT, DELETE for specific issue)"""
        obj = super().get_object()
        user = self.get_user_from_request()
        user_email = user.email
        print(f"Getting object for user email: {user_email}, issue ID: {obj.id}")
        
        # Additional permission check for detail views
        if user.role == 'student':
            print(f"Issue student email: {obj.student.email}")
            print(f"Requesting user email: {user_email}")
            
            if obj.student.email != user_email:
                print(f"Permission denied: Issue belongs to different student")
                print(f"Expected email: {user_email}, Issue student email: {obj.student.email}")
                raise PermissionDenied('You can only access your own issues.')
            print("Permission granted for issue access")
        elif user.role == 'lecturer':
            # Lecturers can access issues assigned to them
            if obj.assigned_to and obj.assigned_to.email != user_email:
                print(f"Permission denied: Issue not assigned to this lecturer")
                raise PermissionDenied('You can only access issues assigned to you.')
        # Registrars can access all issues (no additional check needed)
        
        return obj
#class IssueView(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
#    serializer_class = IssueSerializer
#    permission_classes = [IsAuthenticated]
#    
#    def get_queryset(self):
#        user = self.request.user
#        
#        if user.role == 'student':
#            try:
#                # Since Student inherits from CustomUser, we can cast the user to Student
#                from .models import Student
#                student_instance = Student.objects.get(id=user.id)
#                
#                # Filter issues that belong to this student AND 
#                # where the issue's course is in the student's enrolled courses
#                return Issue.objects.filter(
#                    student=student_instance,
#                    course__in=student_instance.enrolled_courses.all()
#                ).distinct()
#                
#            except Student.DoesNotExist:
#                # Handle case where user is not a proper student
#                return Issue.objects.none()
#        
#        elif user.role == 'lecturer':
#            # Return issues assigned to this lecturer
#            from .models import Lecturer
#            try:
#                lecturer_instance = Lecturer.objects.get(id=user.id)
#                return Issue.objects.filter(assigned_to=lecturer_instance)
#            except Lecturer.DoesNotExist:
#                return Issue.objects.none()
#        
#        elif user.role == 'registrar':
#            # Return all issues for registrars
#            return Issue.objects.all()
#        
#        else:
#            # Return empty queryset for unknown roles
#            return Issue.objects.none()
#    
#    def perform_create(self, serializer):
#        user = self.request.user
#        
#        if user.role == 'student':
#            try:
#                from .models import Student
#                student_instance = Student.objects.get(id=user.id)
#                
#                course = serializer.validated_data.get('course')
#                
#                # Check if student is enrolled in the course
#                if course and course not in student_instance.enrolled_courses.all():
#                    raise PermissionDenied('You can only report issues for courses you are enrolled in.')
#                
#                # Save with the student instance
#                serializer.save(student=student_instance)
#                print(serializer.data)
#                print(serializer.validated_data)
#                
#            except Student.DoesNotExist:
#                raise PermissionDenied('Student profile not found.')
#        
#        else:
#            raise PermissionDenied('Only students can create issues.')
#    
#    def get_object(self):
#        """Override to handle detail views (GET, PUT, DELETE for specific issue)"""
#        obj = super().get_object()
#        user = self.request.user
#        
#        # Additional permission check for detail views
#        if user.role == 'student':
#            try:
#                from .models import Student
#                student_instance = Student.objects.get(id=user.id)
#                if obj.student != student_instance:
#                    raise PermissionDenied('You can only access your own issues.')
#            except Student.DoesNotExist:
#                raise PermissionDenied('Student profile not found.')
#        
#        return obj
    
    
    
    
    
    
    
    # Assign Issue View (Only accessible by registrars)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsRegistrar])  # Only registrars can assign issues
def assign_issue(request, issue_id, lecturer_id):
    issue = get_object_or_404(Issue, id=issue_id)
    lecturer = get_object_or_404(Lecturer, id=lecturer_id)
    
    if issue.course and lecturer.department != issue.course.department:
        return JsonResponse({'error': 'Lecturer must belong to the same department as the course'}, status=status.HTTP_400_BAD_REQUEST)
    
    issue.assign_to_lecturer(request.user, lecturer)
    issue.assigned_at = timezone.now()
    issue.save()
    return JsonResponse({'message': 'Issue assigned successfully'})

# Resolve Issue View (Accessible by lecturers and registrars)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_issue(request, issue_id):
    issue = get_object_or_404(Issue, id=issue_id)
    
    if request.user.role in ['registrar', 'lecturer'] and (issue.assigned_to == request.user or request.user.role == 'registrar'):
        issue.resolved_by = request.user
        issue.resolved_at = timezone.now()
        issue.status = 'resolved'
        issue.save()
        return JsonResponse({'message': 'Issue resolved successfully'})
    
    return JsonResponse({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

# User Info View (Accessible by authenticated users)
class UserInfoView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        user_data = {
            "id": user.id,
            "email": user.email,
            "fullname": user.fullname,
            "role": user.role,
            "phone_number": user.phone_number,
            "profile_picture": user.profile_picture.url if user.profile_picture else None
        }
        return JsonResponse(user_data, status=status.HTTP_200_OK)
# User Edit View (Accessible by authenticated users)
class UserEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return response
    
class LecturerView(generics.ListCreateAPIView):
    serializer_class = LecturerSerializer
    permission_classes = [IsAuthenticated, IsRegistrar]
    
    def get_queryset(self):
        # Only show issues assigned to the current lecturer
        return Issue.objects.filter(assigned_to=self.request.user)

class LecturerIssuesView(generics.ListAPIView):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated, IsLecturer]

    def get_queryset(self):
        # Only show issues assigned to the current lecturer
        return Issue.objects.filter(assigned_to=self.request.user)

    
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Ensure the refresh token is properly formatted
        if 'refresh' not in request.data:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )  
            
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Add any additional processing here if needed
            pass
            
        return response

# class CustomTokenRefreshView(TokenRefreshView):
#     def post(self, request, *args, **kwargs):
#         try:
#             return super().post(request, *args, **kwargs)
#         except Exception as e:
#             return Response(
#                 {"error": "Session expired. Please login again."},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )


class CollegeViewset(viewsets.ModelViewSet):
    serializer_class = CollegeSerializer
    #permission_classes = [IsAuthenticated]
    queryset = College.objects.all()

    #def get_queryset(self):
    #    return College.objects.all()
    

class RegistrarView(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RegistrarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Registrar.objects.all()
