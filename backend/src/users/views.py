from inertia import InertiaResponse


def login(request):
    return InertiaResponse(
        request,
        "users/auth/login",
    )
