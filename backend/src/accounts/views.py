from inertia import inertia
from pydantic import BaseModel


class LoginProps(BaseModel):
    login_url: str
    message: str


@inertia("accounts/login")
def login(request):
    return LoginProps(
        login_url="/_allauth/browser/v1/auth/login",
        message="Hello World",
    ).model_dump()
