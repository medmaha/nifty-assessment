from logging import Logger


from typing import Any

from .utilities import query_params


class AppMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        search_params = query_params(request.get_full_path())

        if search_params.get("m-gender"):
            request.session["M_GENDER"] = search_params.get("m-gender")

        if search_params.get("ipp"):
            request.session["ITEMS_PER_PAGE"] = int(search_params.get("ipp"))

        if search_params.get("page"):
            request.session["PAGINATOR_PAGE"] = int(search_params.get("page"))

        request.ITEMS_PER_PAGE = request.session.get("ITEMS_PER_PAGE", 10)
        request.PAGINATOR_PAGE = request.session.get("PAGINATOR_PAGE")
        request.M_GENDER = request.session.get("M_GENDER", "all")

        response = self.get_response(request)

        return response
