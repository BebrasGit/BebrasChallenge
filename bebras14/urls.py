"""bebras14 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path
from UserManagement import views
from com import views as cviews
from rest_framework.schemas import get_schema_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/',views.LoginView.as_view()),
    path('api/logout/',views.LogoutView.as_view()),
    path('api/v1/create',views.InsertView.as_view()),
    re_path('api/v1/update/(?P<userRoleID>\d+)/$',views.UpdateView.as_view()),
    re_path('GetData/(?P<userID>\d+)/$',views.SingleUserView.as_view()),
    path('apiGet/',views.UserView.as_view()),
    path('viewUsers/',views.PageView.as_view()),
    path('api/insert/',views.InsertMView.as_view()),
    path('viewSchools/',cviews.PageView.as_view()),
    path('reset_password_confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',views.ConfirmResetPasswordView.as_view(),name='reset_password_confirm'),
    path('reset_password/',views.ResetPasswordView.as_view()),
    path('rolelist/',views.RoleListView.as_view()),
    path('filters/',views.FilterViewset.as_view()),

]
