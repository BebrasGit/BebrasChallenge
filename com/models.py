from django.db import models

# Create your models here.

class Countries(models.Model):
    countryID=models.AutoField(primary_key=True)
    iso = models.CharField(max_length=2,null=False)
    name = models.CharField(max_length=80)
    nicename = models.CharField(max_length=80)
    iso3 = models.CharField(max_length=3, blank=True, null=True)
    numcode = models.SmallIntegerField(blank=True, null=True)
    phonecode = models.IntegerField()

class States(models.Model):
    stateID=models.AutoField(primary_key=True)
    name = models.CharField(max_length=100,null=False)
    countryID = models.ForeignKey(Countries, db_column='countryID', to_field='countryID',on_delete=models.CASCADE)  # Field name made lowercase.


class Districts(models.Model):
    districtID = models.AutoField(primary_key=True)
    stateID = models.ForeignKey(States, db_column='stateID',on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)


class Address(models.Model):
    addressID = models.AutoField(db_column='AddressID', primary_key=True)  # Field name made lowercase.
    line1 = models.TextField(db_column='Line1', null=False)  # Field name made lowercase.
    line2 = models.TextField(db_column='Line2', null=False)  # Field name made lowercase.
    city = models.CharField(max_length=20, null=False)
    districtID = models.ForeignKey(Districts, db_column='districtID',on_delete=models.CASCADE)  # Field name made lowercase.
    stateID = models.ForeignKey(States, db_column='stateID',on_delete=models.CASCADE) # Field name made lowercase.
    pincode = models.IntegerField()
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    countryID = models.ForeignKey(Countries, db_column='countryID', to_field='countryID',on_delete=models.CASCADE)  # Field name made lowercase.

class codeGroup(models.Model):
    codeGroupID=models.AutoField(db_column='codeGroupID',primary_key=True)
    codeGroupName=models.CharField(db_column='codeGroupName',max_length=100, null=False)

class code(models.Model):
    codeID=models.AutoField(db_column='codeID',primary_key=True)
    codeGroupID=models.ForeignKey(codeGroup, db_column='codeGroupID', to_field='codeGroupID',on_delete=models.CASCADE)  # Field name made lowercase.
    codeName=models.CharField(db_column='codeName',max_length=100, null=False)

class school(models.Model):
    schoolID=models.AutoField(db_column='schoolID',primary_key=True)
    schoolName=models.CharField(db_column='schoolName',max_length=100, null=False)
    schoolTypeCodeID=models.ForeignKey(code, db_column='schoolTypeCodeID', to_field='codeID',on_delete=models.CASCADE)  # Field name made lowercase.
    addressID=models.ForeignKey(Address, db_column='addressID', to_field='addressID',on_delete=models.CASCADE)  # Field name made lowercase.
    UDISEcode=models.CharField(max_length=15)
    tag=models.CharField(max_length=100)
    phone=models.CharField(max_length=10)

class schoolClass(models.Model):
    schoolClassID=models.AutoField(db_column='schoolClassID',primary_key=True)
    schoolID=models.ForeignKey(school, db_column='schoolID', to_field='schoolID',on_delete=models.CASCADE)  # Field name made lowercase.
    classNumber=models.IntegerField(db_column='classNumber', null=False)


