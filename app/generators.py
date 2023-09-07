import random

from datetime import datetime, timedelta
from django.db import transaction

from .models import Manager, Branch, TransferHistory, Company, Region

from django.db.models import Q

# Function to generate TransferHistory data


def generate_transfers():
    transfer_histories = []

    FROM_BRANCHES = []

    for manager in Manager.objects.filter(branch__gt=0):
        from_branch = random.choice(
            Branch.objects.filter(manager=manager).exclude(code__in=FROM_BRANCHES)
        )
        if not from_branch:
            continue

        branch = random.choice(Branch.objects.filter(~Q(manager=manager)))

        if not branch:
            continue

        to_branch = Branch()
        to_branch.name = branch.name
        to_branch.company = branch.company
        to_branch.manager = manager
        to_branch.posted_date = branch.posted_date
        to_branch.region = branch.region

        from_branch.save()

        # Generate a random transfer_date greater than from_branch's posting_date
        from_branch_posting_date = from_branch.posted_date

        def generate_transfer_date(index=3):
            year = from_branch_posting_date.year + random.randrange(1, 5)

            if year > 2022:
                if not index:
                    return
                return generate_transfer_date(index - 1)

            month = random.randrange(1, 12)
            day = random.randrange(1, 25)
            transfer_date = datetime(year, month, day)

            return transfer_date

        transfer_date = generate_transfer_date()
        if not transfer_date:
            continue

        FROM_BRANCHES.append(from_branch.code)

        to_branch.posted_date = transfer_date
        to_branch.save()

        from_branch.manager = None
        from_branch.save()

        manager.branch_code = to_branch.code
        manager.save()

        def generate_random_remarks(from_branch, to_branch):
            # List of possible transfer reasons or remarks
            transfer_reasons = [
                f"The manager has been transferred from {from_branch} to {to_branch}.",
                f"The manager's relocation: {from_branch} to {to_branch}.",
                f"Change of branch assignment: {from_branch} to {to_branch}.",
                f"Promotion to {to_branch}: {from_branch} to {to_branch}.",
                "Internal Transfer within the organization.",
                "Managerial Change due to strategic reasons.",
                "Branch Shift for operational purposes.",
                "Departmental Rotation for career development.",
            ]

            # Select a random remark from the list
            random_remark = random.choice(transfer_reasons)

            return random_remark

        remarks = generate_random_remarks(from_branch, to_branch)

        transfer_history_data = TransferHistory(
            manager=manager,
            to_branch=to_branch,
            from_branch=from_branch,
            transfer_date=transfer_date,
            posting_date=from_branch.posted_date,
            remarks=remarks,
        )

        transfer_histories.append(transfer_history_data)

    # Use a transaction to create and save the TransferHistory records in bulk
    with transaction.atomic():
        TransferHistory.objects.bulk_create(transfer_histories)
        print("[Done] --> Transfer History")


def generate_branches():
    coords = [" East ", " West ", " North ", " South ", " "]

    for company_info in high_profile_companies:
        company_branches_count = random.choice([2, 5, 3, 4, 6])
        for _ in range(company_branches_count):
            while True:
                try:
                    company_location = gambian_locations.pop(
                        random.randrange(0, len(gambian_locations) - 1)
                    )
                    break
                except:
                    pass
            branch = Branch()
            branch.name = (
                f"{company_location}{random.choice(coords)}Branch {_ + 1}".capitalize()
            )
            branch.company = Company.objects.order_by("?").first()
            branch.region, _ = Region.objects.get_or_create(name=company_info["region"])
            branch.manager = Manager.objects.order_by("?").first()
            branch.posted_date = mutate_time()

            print(branch.posted_date)

            branch.save()
            branch.manager.branch_code = branch.code
            branch.manager.save()

    print("[Done] --> Branches")


def generate_managers():
    managers = []
    for person in manager_names:
        _manager = Manager()
        try:
            name, surname, middle, gender = person.split(" ")
            _manager.middle_name = middle
        except:
            name, surname, gender = person.split(" ")

        _manager.first_name = name
        _manager.last_name = surname
        _manager.phone = g_phone()
        _manager.gender = gender
        _manager.email = (name + surname + "@gmail.com").lower()
        managers.append(_manager)

    with transaction.atomic():
        Manager.objects.bulk_create(managers)
        print("[Done] --> Managers")


def generate_companies():
    companies = []
    for company in high_profile_companies:
        _company = Company()

        _company.name = company["name"]
        _company.town = random.choice(gambian_locations)
        _company.street_name = company["street_name"]
        _company.street_number = company["street_number"]
        _company.phone_number = g_phone()
        _company.region = Region.objects.get_or_create(name=company["region"])[0]

        companies.append(_company)

    with transaction.atomic():
        Company.objects.bulk_create(companies)
        print("[Done] --> Companies")


def g_phone():
    double = False

    def make():
        start = random.choice(["3", "2", "7", "9", "6", "5", "4"])
        phone = (
            f"(+220 {start}{random.randrange(100, 900)} {random.randrange(100, 900)})"
        )
        return phone

    if double:
        return f"{make()} / {make()}"
    return make()


def mutate_time():
    year = 1998 + random.randrange(1, 17)
    month = 0 + random.randrange(1, 10)
    day = 0 + random.randrange(2, 25)
    date = datetime(year, month, day)
    return date


manager_names = [
    "Kebba Jallow male",
    "Fatoumata Sanyang M female",
    "Lamin Touray male",
    "Mariama Drammeh female",
    "Sulayman Camara male",
    "Aminata Saine Gaye female",
    "Modou Manneh Lamin male",
    "Isatou Darboe female",
    "Ousman Sarr Dem male",
    "Yassin Bojang female",
    "Binta Sallah Ndow female",
    "Samba Ceesay Ba male",
    "Ndey Joof female",
    "Musa Gomez male",
    "Adama Sisoho male",
    "Bakary Sowe male",
    "Kadijatou Dibba female",
    "Baboucarr Jaiteh male",
    "Ndey Touray Amie female",
    "Ebrima Colley male",
    "Nyima Sillah female",
    "Ebrima Darboe male",
    "Adama Camara Awa female",
    "Momodou Ceesay male",
    "Ndey Saidy Haddy female",
]

gambian_locations = [
    "Banjul",
    "Serekunda",
    "Brikama",
    "Bakau",
    "Farafenni",
    "Lamin",
    "Gunjur",
    "Soma",
    "Kanifing",
    "Kerewan",
    "Janjanbureh",
    "Kuntaur",
    "Barra",
    "Essau",
    "Sutukoba",
    "Mansa Konko",
    "Kiang",
    "Brufut",
    "Bijilo",
    "Kotu",
    "Kololi",
    "Kotokonko",
    "Tanji",
    "Tujereng",
    "Foni",
    "Sibanor",
    "Kudang",
    "Bureng",
    "Sutukung",
    "Tumani Tenda",
    "Denton Bridge",
    "Mandinari",
    "Soma Bantang",
    "Kaur",
    "Kantora",
    "Basse Santa Su",
    "Pakalinding",
    "Kwinella",
    "Juffureh",
    "Kanilai",
    "Tendaba",
    "Kani Kunda",
    "Njau",
    "Wassu",
    "Sankandi",
    "Georgetown",
    "Jambanjelly",
    "Sutukung",
    "Kafuta",
    # Add more Gambian locations as needed
]

high_profile_companies = [
    {
        "name": "Jah Oil Company Gambia Limited",
        "location": "Serrekunda",
        "street_name": "Kombo Sillah Drive",
        "street_number": "23",
        "region": "WCR",
    },
    {
        "name": "Gam Telecommunications (Gamtel)",
        "location": "kanifing",
        "street_name": "Westfield",
        "street_number": "72",
        "region": "KMC",
    },
    {
        "name": "Standard Chartered Bank Gambia",
        "location": "Latri Kunda",
        "street_name": "Latrikunda German",
        "street_number": "92",
        "region": "WCR",
    },
    {
        "name": "Africell Gambia",
        "location": "Kanifing",
        "street_name": "Kairaba Avenue",
        "street_number": "34",
        "region": "WCR",
    },
    {
        "name": "QCell Gambia",
        "location": "Kanifing",
        "street_name": "Kairaba Avenue",
        "street_number": "45",
        "region": "BJL",
    },
    {
        "name": "Zenith Bank Gambia",
        "location": "Banjul",
        "street_name": "Dobson Street",
        "street_number": "10",
        "region": "BJL",
    },
    {
        "name": "Trust Bank Gambia",
        "location": "Banjul",
        "street_name": "Badou Lowe Street",
        "street_number": "7",
        "region": "BJL",
    },
    {
        "name": "Gam Petroleum (GNPC)",
        "location": "Brusubi",
        "street_name": "Kombo Sillah Drive",
        "street_number": "15",
        "region": "BJL",
    },
]


# for branch in Branch.objects.all():
#     company_name = branch.name.split(" Branch")[0]
#     company = Company.objects.filter(name__icontains=company_name).first()
#     branch.company = company
#     branch.save()


# Company.objects.filter().delete()
# Manager.objects.filter().delete()
# TransferHistory.objects.filter().delete()
# Branch.objects.filter().delete()

# generate_companies()
# generate_managers()
# generate_branches()
# generate_transfers()
# generate_transfers()
