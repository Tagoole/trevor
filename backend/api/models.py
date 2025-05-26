
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone
import datetime
from django.core.validators import MaxLengthValidator
from uuid import uuid4

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)

        match role := extra_fields.get("role"):
            case 'student':
                user_model = Student
            case 'lecturer':
                user_model = Lecturer
            case 'registrar':
                user_model = Registrar
            case _:
                user_model = self.model  # fallback to CustomUser

        user = user_model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = None
    email = models.EmailField(unique=True)
    fullname = models.CharField(max_length=255, null=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)  # Added first_name field
    last_name = models.CharField(max_length=30, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True)   
    termsAccepted = models.BooleanField(default=False)

    
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
    ]
    
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='student')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullname', 'role'] 
    
    
    objects = CustomUserManager()

    def __str__(self):
        return self.fullname
    
class Department(models.Model):  
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Course(models.Model):  
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"   

class Lecturer(CustomUser):
    staff_id = models.CharField(max_length=36, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    courses = models.ManyToManyField(Course)
    office_location = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        # self.role = CustomUser.ROLE_CHOICES.Lecturer # Set role to 'lecturer'  
        self.role = "lecturer"
        self.staff_id = str(uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff_id} - {self.first_name} {self.last_name}" 

class Student(CustomUser): 
    student_id = models.CharField(max_length=36, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    enrolled_courses = models.ManyToManyField(Course, blank=True)
    # enrollment_date = models.DateField()

    def save(self, *args, **kwargs):
        # self.role = CustomUser.ROLE_CHOICES.student # Set role to 'student'
        self.role = "student"
        self.student_id=str(uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student_id} - {self.first_name} {self.last_name}" 
    
class Registrar(CustomUser):  
    staff_id = models.CharField(max_length=36, unique=True)
    office_number = models.CharField(max_length=20, null=True, blank=False)

    def save(self, *args, **kwargs):
        # self.role = CustomUser.ROLE_CHOICES.Registrar # Set role to 'registrar'
        self.role = "registrar"
        self.staff_id = str(uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff_id} - {self.first_name} {self.last_name}"     

class Issue(models.Model):
    ISSUE_STATUS = (
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        
    )

    ISSUE_CHOICES = (('missingmarks','MISSING MARKS'),
                     ('appeal','APPEAL'),
                     ('correction','CORRECTION'))
    
    SEMESTER_CHOICES = (('1','Semester One'),
                        ('2','Semester Two'))
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    registrar = models.ForeignKey(Registrar, on_delete=models.CASCADE)
    category = models.CharField(max_length=50,choices=ISSUE_CHOICES)
    semester = models.CharField(max_length=50,choices=SEMESTER_CHOICES)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField( validators=[MaxLengthValidator(500)], null=True, blank=True)
    attachments = models.ImageField(upload_to='issue_attachments/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=ISSUE_STATUS, default='open')
    created_at = models.DateTimeField(default=datetime.datetime.now)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey(
        Lecturer, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_issues'
    )
    assigned_by = models.ForeignKey(
        Registrar, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_issues'
    )
    assigned_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(
        Registrar,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_issues'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Issue #{self.id} - {self.title}"

    def assign_to_lecturer(self, registrar, lecturer):
        if self.status != self.ISSUE_STATUS.Open:
            raise ValueError("Only 'open' issues can be assigned.")
        self.assigned_to = lecturer
        self.assigned_by = registrar
        self.assigned_at = timezone.now()
        self.status = self.ISSUE_STATUS.Assigned             
        self.save()

    def resolve_issue(self, registrar):
        if self.status != self.ISSUE_STATUS.Assigned:
            raise ValueError("Only 'assigned' issues can be resolved.")
        
        self.resolved_by = registrar
        self.resolved_at = timezone.now()
        self.status = self.ISSUE_STATUS.Resolved  # Set status to 'resolved'
        self.save()

    class Meta:
        ordering = ['-created_at']

class College(models.Model):  
    name = models.CharField(max_length=100)
    registrar = models.ForeignKey(Registrar, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    