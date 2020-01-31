from rest_framework import serializers
from .models import *

class CountrySerializer(serializers.ModelSerializer):
  class Meta:
    model = Countries
    fields = ('countryID', 'iso', 'name', 'nicename')

class StateSerializer(serializers.ModelSerializer):
  class Meta:
    model = States
    fields = ('stateID', 'name', 'countryID')

class DistrictSerializer(serializers.ModelSerializer):
  class Meta:
    model = Districts
    fields = ('districtID', 'name', 'stateID')

class AddressSerializer(serializers.ModelSerializer):
  districtID=DistrictSerializer()
  stateID=StateSerializer()
  countryID=CountrySerializer()
  class Meta:
    model = Address
    fields= ('addressID','line1','line2','city','districtID','stateID','pincode','latitude','longitude','countryID')

class CodeGroupSerializer(serializers.ModelSerializer):
  class Meta:
    model = codeGroup
    fields= ('codeGroupID','codeGroupName')

class CodeSerializer(serializers.ModelSerializer):
  codeGroupID=CodeGroupSerializer()
  class Meta:
    model =code
    fields =('codeID','codeGroupID','codeName')

class SchoolSerializers(serializers.ModelSerializer):
  schoolTypeCodeID=CodeSerializer()
  addressID=AddressSerializer()
  class Meta:
    model = school
    fields = ('schoolID', 'schoolName','schoolTypeCodeID','addressID','UDISEcode','tag','phone')

class SchoolClassSerializers(serializers.ModelSerializer):
  class Meta:
    model =schoolClass
    fields =('schoolClassID','schoolID','classNumber')
