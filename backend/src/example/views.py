from inertia import InertiaResponse


def example1(request):
    return InertiaResponse(
        request,
        "example/example-1/index",
        props={
            "message": "Hello from example1!",
            "description": "This is an example page.",
        },
    )


def example2(request):
    return InertiaResponse(
        request,
        "example/example-2/index",
    )
