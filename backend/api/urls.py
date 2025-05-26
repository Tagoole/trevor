from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import (signup, verify_otp, login, resend_otp, DepartmentView, CourseView, forgot_password, change_password,
    IssueView, assign_issue, resolve_issue, UserInfoView, UserEditView,
    LecturerView, LecturerIssuesView, CourseDetailView, CustomTokenRefreshView,  # Add these new views
    RegistrarView, CollegeViewset,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'colleges',CollegeViewset,basename='colleges')


urlpatterns = [
    path('',include(router.urls)),
    path('signup/', signup),
    path('verify-otp/', verify_otp),
    path('login/', login),
    path('forgot-password/', forgot_password),
    path('change-password/', change_password),
    path('resend-otp/', resend_otp),
    path('departments/', DepartmentView.as_view(), name='department-list-create'),
    path('courses/', CourseView.as_view(), name='course-list-create'),
    path('lecturers/', LecturerView.as_view(), name='lecturer-list-create'),  # New
    path('lecturers/issues/', LecturerIssuesView.as_view(), name='lecturer-issues'),  # New
    path('issues/', IssueView.as_view(), name='issue-list-create'),
    path('issues/<int:pk>/', IssueView.as_view(), name='issue-detail'),
    path('issues/<int:issue_id>/assign/<int:lecturer_id>/', assign_issue, name='assign-issue'),
    path('issues/<int:issue_id>/resolve/', resolve_issue, name='resolve-issue'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    path('user-info/edit/', UserEditView.as_view(), name='user-edit'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    #path('colleges/', CollegeView.as_view(), name='colleges'),
    path('registrars/', RegistrarView.as_view(), name='registrars'),
    path('registrars/<int:pk>/', RegistrarView.as_view(), name='registrars'),
]