from datetime import datetime
from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q

from .utilities import query_params

from .models import Branch, Company, Manager, TransferHistory


ITEMS_PER_PAGE = 10  # Number of items to displayed per paginated-queryset


# ? Homepage
def index(request):
    companies = Company.objects.filter()
    branches = Branch.objects.filter().distinct()
    transfers = TransferHistory.objects.filter().distinct()
    managers = Manager.objects.filter(branch__gt=0).distinct()

    manager_gender = "all"
    queries = query_params(request.get_full_path())

    if queries.get("m-gender"):
        if "male" == queries["m-gender"]:
            manager_gender = "male"
            managers = managers.filter(gender__iexact="male").order_by("id")
        if "female" == queries["m-gender"]:
            manager_gender = "female"
            managers = managers.filter(gender__iexact="female").order_by("id")

    page = request.GET.get("page")
    companies_paginator = Paginator(companies.order_by("id"), ITEMS_PER_PAGE).get_page(
        page
    )
    branches_paginator = Paginator(branches.order_by("id"), ITEMS_PER_PAGE).get_page(
        page
    )
    managers_paginator = Paginator(managers.order_by("id"), ITEMS_PER_PAGE).get_page(
        page
    )
    transfers_paginator = Paginator(transfers.order_by("id"), ITEMS_PER_PAGE).get_page(
        page
    )

    context = {
        "managers_page": managers_paginator,
        "branches_page": branches_paginator,
        "companies_page": companies_paginator,
        "transfers_page": transfers_paginator,
        "gender": manager_gender,
        "active_tab": "home",
    }

    return render(request, "app/index.html", context)


# ? Companies listing page
def companies(request):
    _companies = Company.objects.all().order_by("id")

    c_paginator = Paginator(_companies, ITEMS_PER_PAGE)
    page = request.GET.get("page")
    c_page = c_paginator.get_page(page)

    context = {"active_tab": "companies", "companies_page": c_page}

    return render(request, "app/companies.html", context)


# ? Managers listing page
def managers(request):
    _managers = Manager.objects.filter(branch__gte=0).distinct()
    gender = "all"

    if request.GET.get("m-gender"):
        if "male" == request.GET["m-gender"]:
            gender = "male"
            _managers = _managers.filter(gender__iexact="male")

        if "female" == request.GET["m-gender"]:
            gender = "female"
            _managers = _managers.filter(gender__iexact="female")

    page = request.GET.get("page")
    paginator = Paginator(_managers.order_by("id"), ITEMS_PER_PAGE)
    managers_page = paginator.get_page(page)

    context = {
        "gender": gender,
        f"managers_page": managers_page,
        "active_tab": "managers",
    }
    return render(request, "app/managers.html", context)


# ? Branches listing page
def branches(request):
    _branches = Branch.objects.filter().order_by("id").distinct()

    page = request.GET.get("page")
    paginator = Paginator(_branches, ITEMS_PER_PAGE)
    managers_page = paginator.get_page(page)

    context = {
        f"branches_page": managers_page,
        "active_tab": "branches",
    }
    return render(request, "app/branches.html", context)


# ? Transfer histories listing page
def transfer_histories(request):
    # Retrieve all transfer histories
    transfers = TransferHistory.objects.all().distinct()

    # Pagination for transfer history
    page = request.GET.get("page")

    transfers_paginator = Paginator(transfers.order_by("id"), ITEMS_PER_PAGE).get_page(
        page
    )

    context = {"active_tab": "transfers", "transfers_page": transfers_paginator}

    # Render the view template
    return render(request, "app/transfer-histories.html", context)


# ? Company Details page
def company_details(request, id):
    # Retrieve the company or return a 404 if not found
    company = get_object_or_404(Company, id=id)

    # Retrieve the branches associated with the company
    branches = Branch.objects.filter(company=company).order_by("id").distinct()

    # Retrieve managers associated with those branches
    managers = (
        Manager.objects.filter(
            branch_code__in=branches.values_list("code"), branch__company=company
        )
        .order_by("id")
        .distinct()
    )

    # Pagination for branches and managers
    page = request.GET.get("page")
    branches_paginator = Paginator(branches, ITEMS_PER_PAGE).get_page(page)
    managers_paginator = Paginator(managers, ITEMS_PER_PAGE).get_page(page)

    context = {
        "company": company,
        "branches_page": branches_paginator,
        "managers_page": managers_paginator,
        "active_tab": "companies",
    }

    return render(request, "app/company-details.html", context)


# ? Manager Details page
def manager_details(request, id):
    manager = get_object_or_404(Manager, id=id)
    transfers = TransferHistory.objects.filter(manager=manager).order_by("id")

    context = {
        "manager": manager,
        "branch": manager.branch,
        "transfers_page": transfers.distinct().order_by("-transfer_date"),
        "active_tab": "managers",
    }

    return render(request, "app/manager-details.html", context)


def search_results(request):
    query = request.GET.get("query")
    model = request.GET.get("model")

    __model = None
    __page_obj_name = "abc"
    __template_partial = ""

    if model.lower() == "companies":
        __page_obj_name = "companies_page"
        __template_partial = "company-list.html"
        __model = Company.objects.filter(
            Q(name__icontains=query) | Q(name__istartswith=query)
        )
    elif model.lower() == "managers":
        __page_obj_name = "managers_page"
        __template_partial = "manager-list.html"
        __model = Manager.objects.filter(
            Q(first_name__icontains=query)
            | Q(last_name__istartswith=query)
            | Q(middle_name__istartswith=query),
            branch__gt=0,
        ).distinct()
    elif model.lower() == "branches":
        __page_obj_name = "branches_page"
        __template_partial = "branch-list.html"
        __model = Branch.objects.filter(
            Q(name__icontains=query) | Q(company__name__istartswith=query)
        )
    elif model.lower() == "transfer":
        __page_obj_name = "transfers_page"
        __template_partial = "transfer-list.html"

        to_date = request.GET.get("to_date")
        from_date = request.GET.get("from_date")

        t_year, t_month, t_day = to_date.split("-")
        f_year, f_month, f_day = from_date.split("-")

        start_date = datetime(int(f_year), int(f_month), int(f_day))
        end_date = datetime(int(t_year), int(t_month), int(t_day))

        __model = TransferHistory.objects.filter(
            transfer_date__gte=start_date, transfer_date__lte=end_date
        )
    if __model:
        page = request.GET.get("page")
        paginator = Paginator(__model.order_by("id"), ITEMS_PER_PAGE)
        paginator_page = paginator.get_page(page)

        context = {
            f"{__page_obj_name}": paginator_page,
        }
    else:
        context = {}

    return render(request, f"app/partials/{__template_partial}", context)


def paginate_results(request):
    page = request.GET.get("page")
    model = request.GET.get("m")

    __model = None
    __page_obj_name = "abc"
    __template_partial = ""

    if model.lower() == "managers":
        __page_obj_name = "managers_page"
        __template_partial = "manager-list.html"
        __model = Manager.objects.filter(branch__gt=0)
    if model.lower() == "branches":
        __page_obj_name = "branches_page"
        __template_partial = "branch-list.html"
        __model = Branch.objects.filter()
    if model.lower() == "company":
        __page_obj_name = "companies_page"
        __template_partial = "company-list.html"
        __model = Company.objects.filter()
    if model.lower() == "transfers":
        __page_obj_name = "transfers_page"
        __template_partial = "transfer-list.html"
        __model = TransferHistory.objects.filter()

    if __model:
        page = request.GET.get("page")
        paginator = Paginator(__model.order_by("id"), ITEMS_PER_PAGE)
        paginator_page = paginator.get_page(page)

        context = {
            f"{__page_obj_name}": paginator_page,
        }
    else:
        context = {}

    return render(request, f"app/partials/{__template_partial}", context)
