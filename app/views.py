from datetime import datetime
from django.shortcuts import render
from django.core.paginator import Paginator
from django.db.models import Q

from .utilities import query_params

from .models import Branch, Company, Manager, TransferHistory


ITEMS_PER_PAGE = 10  # Number of items to display per page


# Create your views here.
def index(request):
    managers = Manager.objects.filter(branch__gte=0).distinct()
    branches = Branch.objects.all()
    companies = Company.objects.all()
    transfer_histories = TransferHistory.objects.all()
    queries = query_params(request.get_full_path())

    manager_gender = "all"

    if queries.get("m-gender"):
        if "male" == queries["m-gender"]:
            manager_gender = "male"
            managers = managers.filter(gender__iexact="male")
        if "female" == queries["m-gender"]:
            manager_gender = "female"
            managers = managers.filter(gender__iexact="female")

    m_paginator = Paginator(managers, ITEMS_PER_PAGE)
    page = request.GET.get("page")
    m_page = m_paginator.get_page(page)

    b_paginator = Paginator(branches, ITEMS_PER_PAGE)
    page = request.GET.get("page")
    b_page = b_paginator.get_page(page)

    c_paginator = Paginator(companies, ITEMS_PER_PAGE)
    page = request.GET.get("page")
    c_page = c_paginator.get_page(page)

    context = {
        "managers_page": m_page,
        "branches_page": b_page,
        "companies_page": c_page,
        "transfers": transfer_histories,
        "gender": manager_gender,
        "active_tab": "home",
    }

    return render(request, "app/index.html", context)


def companies(request):
    _companies = Company.objects.all()

    c_paginator = Paginator(_companies, ITEMS_PER_PAGE)
    page = request.GET.get("page")
    c_page = c_paginator.get_page(page)

    context = {"active_tab": "companies", "companies_page": c_page}

    return render(request, "app/companies.html", context)


def managers(request):
    _managers = Manager.objects.filter(branch__gte=0)

    gender = "all"

    if request.GET.get("m-gender"):
        if "male" == request.GET["m-gender"]:
            gender = "male"
            _managers = managers.filter(gender__iexact="male")

        if "female" == request.GET["m-gender"]:
            gender = "female"
            managers = managers.filter(gender__iexact="female")

    page = request.GET.get("page")
    paginator = Paginator(_managers, ITEMS_PER_PAGE)
    managers_page = paginator.get_page(page)

    context = {
        "gender": gender,
        f"managers_page": managers_page,
        "active_tab": "managers",
    }
    return render(request, "app/managers.html", context)


def branches(request):
    _branches = Branch.objects.filter()

    page = request.GET.get("page")
    paginator = Paginator(_branches, ITEMS_PER_PAGE)
    managers_page = paginator.get_page(page)

    context = {
        f"branches_page": managers_page,
        "active_tab": "branches",
    }
    return render(request, "app/branches.html", context)


def transfer_histories(request):
    transfers = TransferHistory.objects.all()

    page = request.GET.get("page")
    paginator = Paginator(transfers, ITEMS_PER_PAGE)
    transfers_page = paginator.get_page(page)

    context = {"active_tab": "transfers", "transfers_page": transfers_page}
    return render(request, "app/transfer-histories.html", context)


def company_details(request, id):
    company = Company.objects.filter(id=id).first()
    branches = Branch.objects.filter(company=company)
    managers = Manager.objects.filter(branch__in=branches)

    page = request.GET.get("page")
    b_paginator = Paginator(branches, ITEMS_PER_PAGE).get_page(page)
    m_paginator = Paginator(managers, ITEMS_PER_PAGE).get_page(page)

    context = {
        "company": company,
        "branches_page": b_paginator,
        "managers_page": m_paginator,
        "active_tab": "companies",
    }

    return render(request, "app/company-details.html", context)


def manager_details(request, id):
    manager = Manager.objects.filter(id=id).first()
    transfers = TransferHistory.objects.filter(manager=manager)
    transfer = transfers.latest("transfer_date")
    branch = transfer.to_branch
    try:
        branch.name = branch.name.split(branch.company.name)[1]
    except:
        pass
    branch.posted_date = transfer.transfer_date

    context = {
        "manager": manager,
        "branch": branch,
        "transfers_page": transfers.order_by("-transfer_date"),
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
            | Q(middle_name__istartswith=query)
        )
    elif model.lower() == "branches":
        __page_obj_name = "branches_page"
        __template_partial = "branch-list.html"
        __model = Manager.objects.filter(
            Q(first_name__icontains=query)
            | Q(last_name__istartswith=query)
            | Q(middle_name__istartswith=query)
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
        paginator = Paginator(__model, ITEMS_PER_PAGE)
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
        __model = Manager.objects.filter(branch__gte=0)
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
        paginator = Paginator(__model, ITEMS_PER_PAGE)
        paginator_page = paginator.get_page(page)

        context = {
            f"{__page_obj_name}": paginator_page,
        }
    else:
        context = {}

    return render(request, f"app/partials/{__template_partial}", context)
