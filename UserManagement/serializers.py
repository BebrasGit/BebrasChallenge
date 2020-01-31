from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import exceptions
from datetime import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = usr_user
        fields = ('userID','loginID','username','gender','birthdate','modified_on','modified_by','created_by','created_on','phone','is_active')


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = usr_role
        fields = ('roleID', 'roleName')

class UserRoleSerializer(serializers.ModelSerializer):

    userID = UserSerializer(read_only=True)
    roleID = RoleSerializer(read_only=True)

    class Meta:
        model = usr_userRole
        fields = ('userRoleID', 'userID','roleID')


class UserISerializer(serializers.ModelSerializer):
    # owner = serializers.HiddenField(
    #     default=serializers.CurrentUserDefault()
    # )
    class Meta:
        model = usr_user
        fields = ('userID','loginID','username','password','birthdate','gender','modified_on','modified_by','created_by','is_active')


    def create(self, validated_data):
        # print("werty")
        password = validated_data.pop('password', None)
        created_by = validated_data.pop('created_by', None)
        username = validated_data.pop('username', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.username = username
        instance.created_by = username
        instance.save()
        return instance

    def update(self,instance,validated_data):
        instance.loginID = validated_data.get('loginID',instance.loginID)
        instance.username = validated_data.get('username',instance.username)
        instance.password = validated_data.get('password',instance.password)
        instance.birthdate = validated_data.get('birthdate',instance.birthdate)
        instance.gender = validated_data.get('gender',instance.gender)
        instance.modified_on = datetime.now().date()
        instance.modified_by =validated_data.get('username',instance.username)
        instance.is_active = '01'
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    loginID = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        loginID = data.get("loginID", "")
        password = data.get("password", "")

        if loginID and password:
            user = authenticate(loginID=loginID, password=password)
            if user:
                if user.is_active:
                    data["user"] = user
                else:
                    msg = "User is deactivated."
                    data["user"] = ""
                    raise exceptions.ValidationError(msg)
            else:
                msg = "Unable to login with given credentials."
                data["user"] = ""
                print(data)
                raise exceptions.ValidationError(msg)

        else:
            msg = "Must provide username and password both."
            data["user"] = ""
            raise exceptions.ValidationError(msg)

        return data


class UserMSerializer(serializers.ModelSerializer):
    class Meta:
        model = usr_user
        fields = ('loginID','username','password','birthdate','gender','email','phone','created_by','modified_by','modified_on','is_active')

class RoleMSerializer(serializers.ModelSerializer):
    class Meta:
        model = usr_role
        fields = ('roleName',)

class UserMISerializer(serializers.ModelSerializer):
    userID = UserMSerializer()
    roleID = RoleMSerializer()

    # loginID = serializers.CharField()
    # password = serializers.CharField()
    # birthdate = serializers.DateField()
    # gender = serializers.CharField()

    class Meta:
        model = usr_userRole
        fields = '__all__'

    def create(self, validated_data):
        # print("in create")
        User_data = validated_data.pop('userID')
        role_data = validated_data.pop('roleID')
        print(role_data)
        roleID = usr_role.objects.get(roleName=role_data['roleName'])
        password = User_data['password']
        # print(password)

        x = usr_user(**User_data)
        if password is not None:
            x.set_password(password)
        # print(User_data['password'])
        x.save()
        # contact = usr_user.objects.create(**x)
        user = usr_userRole.objects.create(userID=x,roleID = roleID, **validated_data)
        return user


    def update(self, instance, validated_data):
        print("hiiiiiiii")
        User_data = validated_data.pop('userID')
        Role_data = validated_data.pop('roleID')
        # print("UserData "+ User_data['loginID'])
        user = (instance.userID)
        role = (instance.roleID)
        user.loginID = User_data.get('email',user.email)
        user.username = User_data.get('username',user.username)
        user.birthdate = User_data.get('birthdate',user.birthdate)
        user.gender = User_data.get('gender',user.gender)
        user.email = User_data.get('email',user.email)
        user.phone = User_data.get('phone',user.phone)
        user.modified_on = datetime.now().date()
        user.modified_by = User_data.get('modified_by',user.modified_by)
        user.is_active = User_data.get('is_active',user.is_active)
        user.save()
        role.roleName = Role_data.get('roleName',role.roleName)
        role.save()
        return instance



class PasswordResetSerializer(serializers.ModelSerializer):
    class Meta:
        model = usr_user
        fields = ('loginID','password')

    def update(self, instance, validated_data):
        instance.password = validated_data.get('password', instance.password)
        instance.set_password(instance.password)
        instance.save()
        return instance
