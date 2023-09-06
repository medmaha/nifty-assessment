import random

from datetime import datetime, timedelta
from django.db import transaction

from .models import Manager, Branch, TransferHistory, Company, Region


# Function to generate TransferHistory data
def generate_transfer_history_data():
    transfer_histories = []
    branches = Branch.objects.all()

    for manager in Manager.objects.all():
        from_branch = random.choice(branches)
        to_branch = random.choice(branches)

        # Generate a random transfer_date greater than from_branch's posting_date
        from_branch_posting_date = from_branch.posted_date
        transfer_date = from_branch_posting_date + timedelta(
            days=random.randint(1, 365)
        )

        transfer_history_data = {
            "manager": manager,
            "to_branch": to_branch,
            "from_branch": from_branch,
            "transfer_date": transfer_date,
            "remarks": f"Transfer from {from_branch.name} to {to_branch.name}",
        }

        transfer_histories.append(TransferHistory(**transfer_history_data))

    # Use a transaction to create and save the TransferHistory records in bulk
    with transaction.atomic():
        TransferHistory.objects.bulk_create(transfer_histories)
        print("TransferHistory records created successfully.")


def generate_branch_data():
    branches = []
    for company_info in high_profile_companies:
        company_name = company_info["name"]
        company_location = company_info["location"]

        # Create 2 branches for each high-profile company
        _r = random.choice([2, 5, 3, 1, 6])
        for _ in range(_r):
            branch_name = f"{company_name} Branch {_ + 1}"
            branch_region, _ = Region.objects.get_or_create(name=company_info["region"])
            manager = Manager.objects.order_by("?").first()  # Random manager selection
            branch_data = {
                "name": branch_name,
                "company": Company.objects.get(name=company_name),
                "region": branch_region,
                "manager": manager,
                "posted_date": mutate_time(),  # You can set this to a specific date if needed
            }
            branches.append(Branch(**branch_data))

        # Use a transaction to create and save the branches in bulk
        with transaction.atomic():
            Branch.objects.bulk_create(branches)


def generate_managers():
    managers = []
    for person in manager_names:
        manager = Manager()
        try:
            name, surname, middle, gender = person.split(" ")
            manager.middle_name = middle
        except:
            name, surname, gender = person.split(" ")

        manager.first_name = name
        manager.last_name = surname
        manager.phone = g_phone()
        manager.gender = gender

        managers.append(manager)


def g_phone():
    double = random.choice([False, True, False, False])

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
    year = 1998 + random.randrange(1, random.choice([10, 23]))
    month = 0 + random.randrange(1, 10)
    day = 0 + random.randrange(2, 25)
    hour = 0 + random.randrange(1, 24)
    minute = random.randrange(0, 60)
    date = datetime(year, month, day, hour, minute)
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


high_profile_companies = [
    {
        "name": "Nitfy ICT Solutions",
        "location": "Brusubi",
        "street_name": "Off Demba Doo Highway",
        "street_number": "1",
        "region": "WCR",
    },
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


for manager in Manager.objects.all():
    # Generate a random transfer_date greater than from_branch's posting_date
    domain = random.choice(["gmail", "outlook", "yahoo", "gmail"])
    manager.email = (
        manager.first_name
        + manager.middle_name
        + manager.last_name
        + f"@{domain}.com"
    )
    manager.email = manager.email.lower()
    manager.save()
