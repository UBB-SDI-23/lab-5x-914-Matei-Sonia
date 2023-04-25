from django.db import models


class Vault(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=200, blank=True, default="")
    master_password = models.CharField(max_length=200, blank=False)


class Tag(models.Model):
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="tags")
    title = models.CharField(max_length=30, blank=False)


class PasswordAccount(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    password = models.CharField(max_length=200, blank=False)
    website_or_app = models.CharField(max_length=100, blank=False)
    note = models.CharField(max_length=200, blank=True, default="")
    username_or_email = models.CharField(max_length=100, blank=False)
    tags = models.ManyToManyField(Tag, through="TagPassword")
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="account_passwords")


class PasswordClassic(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    password = models.CharField(max_length=200, blank=False)
    used_for = models.CharField(max_length=200, blank=False)
    note = models.CharField(max_length=200, blank=True, default="")
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="classic_passwords")


class TagPassword(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=200, blank=True, default="")
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="tagged_passwords")
    password = models.ForeignKey(PasswordAccount, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['tag', 'password'], name='unique_tag_account')
        ]
