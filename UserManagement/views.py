from django.shortcuts import render
from rest_framework.authtoken.models import Token
from .models import *
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, Http404, JsonResponse
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status,permissions
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListCreateAPIView, ListAPIView
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import update_last_login
from knox.views import LoginView as KnoxLogin, LogoutView as KnoxLogout, LogoutAllView as knoxLogoutAll
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from knox.settings import knox_settings
from django.utils.timezone import localtime,now
from datetime import *
from .pagination import *
from django_filters.rest_framework import DjangoFilterBackend
import json
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Create your views here.




def index(request):
    return render (request, "build/index.html")


class LoginView(KnoxLogin):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        # print(serializer)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        if user!= None:
            update_last_login(None, user)
            # print(type(user))
            s = UserSerializer(user).data['userID']
            # print(s)
            # print((usr_userRole.objects.filter(userID=s)).values('roleID'))
            s1 = (usr_userRole.objects.filter(userID=s)).values('roleID')
            if s1 :
                s2=s1[0]['roleID']
                if (s2==1 ):
                    return Response({
                        "user": UserSerializer(user).data,
                        "token": AuthToken.objects.create(user)[1],
                        "expiry" : knox_settings.TOKEN_TTL
                    })
                else:
                    return Response("User is not an Admin")
            else:
                return Response("User is not an Admin")
        else:
            return Response("Invalid User")


class LogoutView(KnoxLogout):
    authentication_classes = (TokenAuthentication, )
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # django_logout(request)
        request._auth.delete()
        return Response(status=204)


class InsertView(APIView):
     authentication_classes = (TokenAuthentication, )
     permission_classes = (permissions.IsAuthenticated,)

     def post(self, request):
        serializer = UserISerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return HttpResponseRedirect("")

class UpdateView(APIView):
    # authentication_classes = (TokenAuthentication, )
    # permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,**kwargs):
         id = usr_userRole.objects.get(userRoleID = kwargs['userRoleID'])
         print(kwargs['userRoleID'])
         serializers = UserMISerializer(instance=id, data = request.data,partial=True)
         print(serializers)
         serializers.is_valid(raise_exception=True)
         print("no exception")
         serializers.save(modified_on = datetime.now().date() )
         print(datetime.now().date())
         return Response(serializers.data)

class UserView(APIView):
    # authentication_classes = (TokenAuthentication, )
    # permission_classes = (permissions.IsAuthenticated,)

    def get(self,request):
        employee1 = usr_userRole.objects.all()
        serializer = UserRoleSerializer(employee1,many=True)
        return Response(serializer.data)

class SingleUserView(APIView):
    # authentication_classes = (TokenAuthentication, )
    # permission_classes = (permissions.IsAuthenticated,)

    def get(self,request,**kwargs):
        employee1 = usr_userRole.objects.filter(userRoleID = kwargs['userID'])
        print (kwargs)
        # print (request)
        serializer = UserRoleSerializer(employee1,many=True)
        print (serializer.data)
        return Response(serializer.data)


class PageView(ListCreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRoleSerializer
    pagination_class = CustomPagination
    queryset = usr_userRole.objects.all()

class FilterViewset(ListAPIView):

   queryset = usr_userRole.objects.filter(userID__loginID__contains="",userID__gender__contains="F",userID__modified_on__contains="",userID__created_by__contains="",roleID__roleName__contains="")
   serializer_class = UserRoleSerializer
   permission_classes = (permissions.AllowAny,)
   # filter_backends = [DjangoFilterBackend]
   # filterset_fields = ( 'loginID','gender','modified_on', 'created_by','roleName')
   filterset_fields = ( 'userID','roleID')


class InsertMView(APIView):

    authentication_classes = (TokenAuthentication, )
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # print(request.data)
        serializer = UserMISerializer(data=request.data)
        # print(serializer)
        serializer.is_valid(raise_exception=True)
        # print("after valid call")
        serializer.save()
        # print("after save")
        return HttpResponseRedirect("")


# class PageSView(ListCreateAPIView):
#     serializer_class = SchoolSerializers
#     pagination_class = CustomPagination
#     queryset = school.objects.all()
#
# class GetSchoolsView(APIView):
#     def get(self,request):
#         lists = school.objects.all()
#         serializer = SchoolSerializers(lists,many=True)
#         return Response(serializer.data)

class ResetPasswordView(APIView):

    def reset_password(self, user, request):
        print("def reset pass")
        c = {
            'email': user.email,
            'domain': request.META['HTTP_HOST'],
            'site_name': 'Bebras Admin',
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'user': user,
            'token': default_token_generator.make_token(user),
            'protocol': 'http',
        }
        subject_template_name = 'Password Reset';
        print("uid " + c['uid'])
        print('token ' + c['token'])
        fromaddr = "dmshreya2018@gmail.com"
        toaddr = user.loginID
        mail = MIMEMultipart()

        mail['From'] = fromaddr
        mail['To'] = toaddr
        mail['Subject'] = subject_template_name
        body = "You're receiving this email because you requested a password reset for your user account at " + c['site_name'] + ".\n\n" + \
               "Please go to the following page and choose a new password:\n" + \
                " http://localhost:3000/#/resetPassword/?uidb64="+c['uid'] + "&token=" + c['token'] + \
               "\n\n\nYour username, in case you've forgotten:" + c['email'] + \
                "\n\nThanks for using our site!" + \
                "\n\n\nThe " + c['site_name'] + " team"
        mail.attach(MIMEText(body, 'plain'))
        # server = socket.getaddrinfo('smtp.gmail.com', 587)
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(fromaddr, 'digital_marketing')
        text = mail.as_string()
        server.sendmail(fromaddr, toaddr, text)
        server.quit()

    def post(self, request, *args, **kwargs):
        print((request.data))
        associated_users = usr_user.objects.filter(loginID=request.data['emailID'])
        print(associated_users)
        if associated_users.exists():
            for user in associated_users:
                self.reset_password(user, request)
            return Response("Email sent to the registered email id")
        else:
            return Response("Error")

class ConfirmResetPasswordView(APIView):

    def post(self, request, uidb64=None, token=None, *arg, **kwargs):

        print("in post confirm reset password view")
        print("request data: ")
        print(request.data)
        print("uidb " + uidb64)
        print("token " + token)
        UserModel = get_user_model()
        print(UserModel)
        assert uidb64 is not None and token is not None  # checked by URLconf
        try:
            uid = urlsafe_base64_decode(uidb64)
            print('uid :' )
            print(uid)
            user = UserModel._default_manager.get(pk=uid)
            print('user :')
            print(user)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            id = usr_user.objects.get(loginID=user)
            serializers = PasswordResetSerializer(id, data=request.data, partial=True)
            serializers.is_valid(raise_exception=True)
            saved = serializers.save(modified_on=datetime.now().date())
            if saved:
                return Response("Success")
            else:
                return Response('Password reset has not been successful.')

        else:
            return Response('The reset password link is no longer valid.')

class RoleListView(APIView):

     def get(self,request):
        employee1 = usr_role.objects.all()
        serializer = RoleMSerializer(employee1,many=True)
        return Response(serializer.data)
