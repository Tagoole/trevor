# permissions.py

from rest_framework import permissions


class IsRegistrar(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'registrar'

class IsLecturer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'lecturer'

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'student'
