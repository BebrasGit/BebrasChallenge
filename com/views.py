from django.shortcuts import render
from UserManagement.pagination import CustomPagination
# Create your views here.
from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
# Create your views here.


class PageView(ListCreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SchoolSerializers
    pagination_class = CustomPagination
    queryset = school.objects.all()
