from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.contrib.auth.forms import (
    AdminPasswordChangeForm,
    UserChangeForm,
    UserCreationForm,
)
from guardian.admin import (
    AdminGroupObjectPermissionsForm,
    AdminUserObjectPermissionsForm,
    GuardedModelAdmin,
    GuardedModelAdminMixin,
)

from .models import User


@admin.register(User)
class UserAdmin(
    GuardedModelAdminMixin,
    DefaultUserAdmin,
):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    )
    list_filter = ("is_staff", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

    class Meta:
        verbose_name = "ユーザー"
        verbose_name_plural = "ユーザー"
