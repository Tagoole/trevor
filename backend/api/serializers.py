from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ['id', 'email', 'fullname', 'role', 'is_verified', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'termsAccepted']
        exclude = ["password"]
 
class LecturerSerializer(UserSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True, required=False)
    password = serializers.CharField(write_only=True)
    staff_id = serializers.CharField(max_length=20)
    office_location = serializers.CharField(max_length=100)

    class Meta:
        model = Lecturer
        # fields = UserSerializer.Meta.fields + [
        #     'staff_id', 'department', 'courses', 'office_location', 'password'
        # ]
        exclude = ["password"]

        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'read_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        Lecturer = super().create(validated_data)
        if password:
            Lecturer.set_password(password)
            Lecturer.save()
        
        return super().create(validated_data)

class StudentSerializer(UserSerializer):
    department = serializers.StringRelatedField()
    enrolled_courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True)
 
    class Meta:
        model = Student
        # fields = UserSerializer.Meta.fields + ['student_id', 'department', 'enrolled_courses', 'enrollment_date']
        exclude = ["password"]

class RegistrarSerializer(UserSerializer):
    staff_id = serializers.CharField(max_length=20)
    office_number = serializers.CharField(max_length=20)

    class Meta:
        model = Registrar
        # fields = UserSerializer.Meta.fields + ['staff_id', 'office_number']
        exclude = ["password"]

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code']

class CourseSerializer(serializers.ModelSerializer):
     class Meta:
        model = Course
        fields = '__all__'
        extra_kwargs = {
            'department': {'required': True}
        }

class IssueSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    assigned_to = LecturerSerializer(read_only=True)
    assigned_by = RegistrarSerializer(read_only=True)
    resolved_by = RegistrarSerializer(read_only=True)
    
    # issue_type = serializers.ChoiceField(choices=Issue.ISSUE_CHOICES)
    semester = serializers.ChoiceField(choices=Issue.SEMESTER_CHOICES)
    status = serializers.ChoiceField(choices=Issue.ISSUE_STATUS)
    
    class Meta:
        model = Issue
        fields = '__all__'

    def create(self, validated_data):
        # student = self.context['request'].user
        student = self.context['request'].user.student
        validated_data['student'] = student
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr not in ['assigned_to', 'assigned_by', 'resolved_by']:
                setattr(instance, attr, value)
        instance.save()
        return instance
    
class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['fullname', 'phone_number', 'profile_picture'] 
    
    def update(self, instance, validated_data):
        instance.fullname = validated_data.get('fullname', instance.fullname)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance

class CollegeSerializer(serializers.ModelSerializer): 
    class Meta:
        model = College
        fields = '__all__'