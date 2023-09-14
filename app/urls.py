from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    #
    path("companies", views.companies, name="companies"),
    path("companies/<id>", views.company_details, name="company_details"),
    #
    path("managers", views.managers, name="managers"),
    path("managers/<id>", views.manager_details, name="manager_details"),
    #
    path("branches", views.branches, name="branches"),
    path("transfer-histories", views.transfer_histories, name="transfer-histories"),
    path("query", views.search_results, name="search_results"),
    path("paginate", views.paginate_results, name="paginate"),
    path("download/<doc>", views.downloader, name="pdf_downloader"),
]
