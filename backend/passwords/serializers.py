from rest_framework import serializers
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
        fields = ["id", "created_at", "last_modified", "title", "description", "master_password"]


class TagSerializerList(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "vault", "title"]


class PasswordAccountSerializerList(serializers.ModelSerializer):
    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    class Meta:
        model = PasswordAccount
        fields = ["id", "created_at", "last_modified", "vault", "password", "website_or_app", "username_or_email", "note"]


class PasswordClassicSerializerList(serializers.ModelSerializer):
    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    class Meta:
        model = PasswordClassic
        fields = ["id", "created_at", "last_modified", "vault", "password", "used_for", "note"]


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
class VaultSerializerDetails(serializers.ModelSerializer):
    account_passwords = PasswordAccountSerializerList(many=True, read_only=True)
    classic_passwords = PasswordClassicSerializerList(many=True, read_only=True)
    tags = TagSerializerList(many=True, read_only=True)

    def validate_master_password(self, master_password):
        if master_password is not None:
            if len(master_password) < 8:
                raise serializers.ValidationError("Master password should have a length equal or greater than 8.")
        return master_password

    def validate_title(self, title):
        print(self.instance.title, title)
        if title is not None and title != self.instance.title:
            others = Vault.objects.filter(title=title)
            if others:
                raise serializers.ValidationError("The title of the vault should be unique.")
        return title

    class Meta:
        model = Vault
        fields = ["id", "created_at", "last_modified", "title", "description", "master_password", "account_passwords",
                  "classic_passwords", "tags"]


class TagSerializerDetails(serializers.ModelSerializer):
    tagged_passwords = TagPasswordSerializer(many=True, read_only=True, exclude_fields=["tag"])
    vault = VaultSerializerList(read_only=True)

    class Meta:
        model = Tag
        fields = ["id", "vault", "title", "tagged_passwords"]


class PasswordAccountSerializerDetails(serializers.ModelSerializer):
    vault = VaultSerializerList(read_only=True)
    tags = TagPasswordSerializer(many=True, read_only=True, source="tagpassword_set", exclude_fields=["password"])

    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    class Meta:
        model = PasswordAccount
        fields = ["id", "created_at", "last_modified", "vault", "password", "website_or_app", "username_or_email", "note", "tags"]


class PasswordClassicSerializerDetails(serializers.ModelSerializer):
    vault = VaultSerializerList(read_only=True)

    def validate_password(self, password):
        if password is not None:
            if len(password) < 5:
                raise serializers.ValidationError("Password should have a length equal or greater than 5.")
        return password

    class Meta:
        model = PasswordClassic
        fields = ["id", "created_at", "last_modified", "vault", "password", "used_for", "note"]


class VaultOrderSerializerList(serializers.ModelSerializer):
    avg_password_length = serializers.FloatField()

    class Meta:
        model = Vault
        fields = ["id", "created_at", "last_modified", "title", "description", "master_password", "avg_password_length"]


class OrderPasswordsByTagsSerializer(serializers.ModelSerializer):
    count_tags = serializers.FloatField()

    class Meta:
        model = PasswordAccount
        fields = ["id", "created_at", "last_modified", "vault", "password", "website_or_app", "username_or_email", "note", "count_tags"]
