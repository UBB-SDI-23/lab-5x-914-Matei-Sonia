import datetime
import re

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from passwords.models import *


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """
    def __init__(self, *args, **kwargs):
        kwargs.pop('fields', None)
        exclude_fields = kwargs.pop('exclude_fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if exclude_fields is not None:
            for field in exclude_fields:
                split = field.split('__')
                to_access = self.fields
                for i in range(len(split)-1):
                    to_access = to_access.get(split[i])
                if isinstance(to_access, serializers.ListSerializer):
                    to_access = to_access.child
                to_access.fields.pop(split[-1])


class UserProfileSerializerDetail(serializers.ModelSerializer):
    def validate_birthday(self, birthday):
        if birthday > datetime.datetime.now().date():
            raise serializers.ValidationError("Birthday is invalid.")
        return birthday

    def validate_gender(self, gender):
        if gender not in ["M", "F", ""]:
            raise serializers.ValidationError("Invalid gender.")
        return gender

    def validate_marital_status(self, marital_status):
        if marital_status not in ["married", "divorced", "single", "relationship", "widowed", ""]:
            raise serializers.ValidationError("Invalid marital status.")
        return marital_status

    class Meta:
        model = UserProfile
        fields = ["bio", "gender", "marital_status", "birthday", "instagram"]


class UserSerializerList(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, write_only=True)
    profile = UserProfileSerializerDetail(read_only=True)

    def validate_password(self, password):
        if not re.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$', password):
            raise serializers.ValidationError("Password should contain at least 1:[a-z], 1:[A-Z], 1:special ch, 1:[0-9] and be grater than 8.")
        return password

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    class Meta:
        model = User
        fields = ["id", "created_at", "last_modified", "username", "email", "is_staff", "is_active", "password", "per_page", "profile"]


class VaultSerializerList(serializers.ModelSerializer):
    def validate_master_password(self, master_password):
        if master_password is not None:
            if len(master_password) < 8:
                raise serializers.ValidationError("Master password should have a length equal or greater than 8.")
        return master_password

    def validate_title(self, title):
        if title is not None:
            others = Vault.objects.filter(title=title)
            if others:
                raise serializers.ValidationError("The title of the vault should be unique.")
        return title

    class Meta:
        model = Vault
        fields = ["id", "created_at", "last_modified", "title", "description", "master_password", "user"]


class TagSerializerList(serializers.ModelSerializer):

    def validate(self, data):
        errors = {}
        try:
            data = super().validate(data)
        except serializers.ValidationError as ve:
            errors = ve.detail

        user = data['user']
        vault = data['vault']
        if vault is not None and user != vault.user:
            raise serializers.ValidationError('Password and vault must have the same user.')

        if errors:
            raise serializers.ValidationError(errors)

        return data

    class Meta:
        model = Tag
        fields = ["id", "vault", "title", "user"]


class PasswordAccountSerializerList(serializers.ModelSerializer):

    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    def validate(self, data):
        errors = {}
        try:
            data = super().validate(data)
        except serializers.ValidationError as ve:
            errors = ve.detail

        user = data['user']
        vault = data['vault']
        if vault is not None and user != vault.user:
            raise serializers.ValidationError('Password and vault must have the same user.')

        if errors:
            raise serializers.ValidationError(errors)

        return data

    class Meta:
        model = PasswordAccount
        fields = ["id", "created_at", "last_modified", "vault", "password", "website_or_app", "username_or_email", "note", "user"]


class PasswordClassicSerializerList(serializers.ModelSerializer):

    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    def validate(self, data):
        errors = {}
        try:
            data = super().validate(data)
        except serializers.ValidationError as ve:
            errors = ve.detail

        user = data['user']
        vault = data['vault']
        if vault is not None and user != vault.user:
            raise serializers.ValidationError('Password and vault must have the same user.')

        if errors:
            raise serializers.ValidationError(errors)

        return data

    class Meta:
        model = PasswordClassic
        fields = ["id", "created_at", "last_modified", "vault", "password", "used_for", "note", "user"]


class TagPasswordSerializer(DynamicFieldsModelSerializer):
    tag = TagSerializerList(read_only=True)
    password = PasswordAccountSerializerList(read_only=True)

    def validate(self, data):
        errors = {}
        try:
            data = super().validate(data)
        except serializers.ValidationError as ve:
            errors = ve.detail

        if "tag" in data and "password" in data:
            tag = data["tag"]
            passw = data["password"]
            if tag.vault != passw.vault:
                errors["vault"] = ["Vault must be the same for both entities."]

        if errors:
            raise serializers.ValidationError(errors)

        return data

    class Meta:
        model = TagPassword
        fields = ["id", "created_at", "description", "tag", "password"]



# opus magnus
class UserSerializerDetails(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, max_length=128)
    profile = UserProfileSerializerDetail()
    # classic_passwords = PasswordClassicSerializerList(many=True, read_only=True)
    # account_passwords = PasswordAccountSerializerList(many=True, read_only=True)
    # tags = TagSerializerList(many=True, read_only=True)
    # vaults = VaultSerializerList(many=True, read_only=True)

    def validate_password(self, password):
        if password == "":
            return self.instance.password
        if not re.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$', password):
            raise serializers.ValidationError("Password should contain at least 1:[a-z], 1:[A-Z], 1:special ch, 1:[0-9] and be grater than 8.")
        return password

    def validate_per_page(self, per_page):
        if per_page < 5:
            raise serializers.ValidationError("The number should be >= 5.")
        return per_page

    def update(self, instance, validated_data):
        if "profile" in validated_data:
            profile_data = validated_data.pop("profile")
            profile_serializer = UserProfileSerializerDetail(instance=self.instance.profile, data=profile_data, partial=True)
            if profile_serializer.is_valid(raise_exception=True):
                profile_serializer.save()
        return User.objects.update_user(instance, **validated_data)

    class Meta:
        model = User
        fields = ["id", "created_at", "last_modified", "username", "password", "email", "profile", "per_page"]


class VaultSerializerDetails(serializers.ModelSerializer):
    account_passwords = PasswordAccountSerializerList(many=True, read_only=True)
    classic_passwords = PasswordClassicSerializerList(many=True, read_only=True)
    user = UserSerializerDetails(read_only=True)
    tags = TagSerializerList(many=True, read_only=True)

    def validate_master_password(self, master_password):
        if master_password is not None:
            if len(master_password) < 8:
                raise serializers.ValidationError("Master password should have a length equal or greater than 8.")
        return master_password

    def validate_title(self, title):
        if title is not None and title != self.instance.title:
            others = Vault.objects.filter(title=title)
            if others:
                raise serializers.ValidationError("The title of the vault should be unique.")
        return title

    class Meta:
        model = Vault
        fields = ["id", "created_at", "last_modified", "title", "description", "master_password", "account_passwords",
                  "classic_passwords", "tags", "user"]


class TagSerializerDetails(serializers.ModelSerializer):
    tagged_passwords = TagPasswordSerializer(many=True, read_only=True, exclude_fields=["tag"])
    user = UserSerializerDetails(read_only=True)
    vault = VaultSerializerList(read_only=True)

    class Meta:
        model = Tag
        fields = ["id", "vault", "title", "tagged_passwords", "user"]


class PasswordAccountSerializerDetails(serializers.ModelSerializer):
    vault = VaultSerializerList(read_only=True)
    user = UserSerializerDetails(read_only=True)
    tags = TagPasswordSerializer(many=True, read_only=True, source="tagpassword_set", exclude_fields=["password"])

    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    class Meta:
        model = PasswordAccount
        fields = ["id", "created_at", "last_modified", "vault", "password", "website_or_app", "username_or_email", "note", "tags", "user"]


class PasswordClassicSerializerDetails(serializers.ModelSerializer):
    user = UserSerializerDetails(read_only=True)
    vault = VaultSerializerList(read_only=True)

    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    class Meta:
        model = PasswordClassic
        fields = ["id", "created_at", "last_modified", "vault", "password", "used_for", "note", "user"]


class VaultOrderSerializerList(serializers.ModelSerializer):
    user = UserSerializerList(read_only=True)
    avg_password_length = serializers.FloatField()

    class Meta:
        model = Vault
        fields = ["id", "created_at", "last_modified", "title", "description", "master_password", "avg_password_length", "user"]


class OrderPasswordsByTagsSerializer(serializers.ModelSerializer):
    user = UserSerializerList(read_only=True)
    count_tags = serializers.FloatField()

    class Meta:
        model = PasswordAccount
        fields = ["id", "created_at", "last_modified", "vault", "password", "website_or_app", "username_or_email", "note", "count_tags", "user"]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        print(user)
        serializer = UserSerializerList(instance=user)
        token['user'] = serializer.data
        return token

