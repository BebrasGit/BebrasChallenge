from django.db import models
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,AbstractUser,UserManager as AbstractUserManager
from phonenumber_field.modelfields import PhoneNumberField


class UserManager(BaseUserManager):
    use_in_migrations = True
    def create_user(self,loginID,password,username,gender,birthdate):
        if not username:
            raise ValueError("No username")
        if not loginID:
            raise ValueError("No loginID")
        if not password:
            raise ValueError("No Password")
        if not gender:
            raise ValueError("No gender")
        if not birthdate:
            raise ValueError("No birthdate")

        usr_obj = self.model(loginID=loginID, username=username, gender = gender,birthdate = birthdate)
        usr_obj.set_password(password)
        usr_obj.save()
        return usr_obj

    # def create_superuser(self, loginID,password,username,gender,birthdate):
    #     user = self.create_user(
    #         loginID,
    #         password=password,
    #         username=username,
    #         gender= gender,
    #         birthdate = birthdate,
    #     )
    #     user.staff = True
    #     user.admin = True
    #     user.save(using=self._db)
    #     return user


class usr_user(AbstractBaseUser):
    userID = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    loginID = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=500)
    gender = models.CharField(max_length=6)
    birthdate = models.DateField()
    phone = PhoneNumberField(null=True)
    email = models.CharField(max_length=70)
    created_on = models.DateField(auto_now_add=True)
    created_by = models.CharField(max_length=50, default='default value')
    modified_on = models.DateField(default= timezone.now())
    modified_by = models.CharField(max_length=50, default='default value')
    is_active=models.CharField(max_length=2,default='01')
    # statusCodeID = models.ForeignKey(
    #     (tablename), on_delete=models.CASCADE
    # )
    USERNAME_FIELD = 'loginID'
    REQUIRED_FIELDS = ['username','password','gender','birthdate']
    objects = UserManager()


class usr_role(models.Model):
    roleID = models.IntegerField(primary_key=True)
    roleName = models.CharField(max_length=20)
    roleDescription = models.TextField()

class usr_userRole(models.Model):
    userRoleID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(
        'usr_user', on_delete=models.CASCADE
    )
    roleID = models.ForeignKey(
        'usr_role', on_delete=models.CASCADE
    )
