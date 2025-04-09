from django.urls import path, re_path

from . import views

urlpatterns = [
    path("example1", views.example1, name="example1"),
    path("example2", views.example2, name="example2"),
    re_path(r"^example2/.*$", views.example2, name="redirect_to_example2"),
]
