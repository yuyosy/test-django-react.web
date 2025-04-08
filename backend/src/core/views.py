from inertia import InertiaResponse
from pydantic import BaseModel


class TopPageProps(BaseModel):
    message: str


def top_page(request):
    props = TopPageProps(
        message="props message",
    )
    return InertiaResponse(request, "core/top/index", props=props.model_dump())
