import random

from datetime import datetime
from django.db import transaction

from .models import Manager, Branch, TransferHistory, Company, Region

from django.db.models import Q

# Function to generate TransferHistory data


def generate_transfers():
    transfer_histories = []

    FROM_BRANCHES = []

    _managers = Manager.objects.filter()
    for manager in _managers:
        from_branch: Branch = random.choice(Branch.objects.filter())
        branch = random.choice(Branch.objects.filter(~Q(manager=manager)))

        if not branch:
            continue

        if branch.manager == manager:
            continue

        to_branch = Branch()
        _coord = random.choice([" west ", " east ", " north ", " south", " ", " ", " "])

        to_branch.name = (
            f"{random.choice(gambian_locations)}{_coord}Branch {random.randrange(1, 3)}"
        )
        to_branch.company = branch.company
        to_branch.manager = manager
        to_branch.posted_date = branch.posted_date
        to_branch.region = branch.region

        from_branch.manager = manager
        from_branch.save()

        # Generate a random transfer_date greater than from_branch's posting_date
        year = from_branch.posted_date.year

        transfer_date = create_transfer_date(year)
        if not transfer_date:
            continue

        FROM_BRANCHES.append(from_branch.code)

        to_branch.posted_date = transfer_date
        to_branch.save()

        from_branch.manager = None
        from_branch.save()

        manager.branch_code = to_branch.code
        manager.save()

        remarks = create_random_remarks(from_branch, to_branch)

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
        t = TransferHistory.objects.bulk_create(transfer_histories)
        print("[Done] --> Transfer History", len(t))


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
            branch.company = random.choice(Company.objects.all())
            branch.region, _ = Region.objects.get_or_create(name=company_info["region"])
            branch.manager = Manager.objects.order_by("?").first()
            branch.posted_date = create_random_datetime()

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
        _manager.phone = random_phone_number()
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
        _company.phone_number = random_phone_number()
        _company.region = Region.objects.get_or_create(name=company["region"])[0]

        companies.append(_company)

    with transaction.atomic():
        Company.objects.bulk_create(companies)
        print("[Done] --> Companies")


def random_phone_number():
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


def create_random_datetime():
    year = 1998 + random.randrange(1, 17)
    month = 0 + random.randrange(1, 10)
    day = 0 + random.randrange(2, 25)

    date = datetime(year, month, day)
    return date


def create_transfer_date(from_year, index=3):
    year = from_year + random.randrange(1, 5)

    if year > 2022:
        if not index:
            return
        return create_transfer_date(index - 1)

    month = random.randrange(1, 12)
    day = random.randrange(1, 25)
    transfer_date = datetime(year, month, day)

    return transfer_date


def create_random_remarks(from_branch, to_branch):
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


def random_managers_mixed():
    managers = []
    first_names = []
    last_names = []
    for person in manager_names:
        try:
            name, surname, middle, gender = person.split(" ")
            _g = Manager.objects.filter(first_name=name).first()
            if _g:
                gender = _g.gender
            last_names.append((middle, surname, gender))
        except:
            name, surname, gender = person.split(" ")
            _g = Manager.objects.filter(first_name=name).first()
            if _g:
                gender = _g.gender
            last_names.append((None, surname, gender))

        first_names.append(name)

    random.shuffle(first_names)
    random.shuffle(last_names)

    zip_mapped = zip(first_names, last_names)

    for first_name, data in zip_mapped:
        middle_name, last_name, _gender = data
        _manager = Manager()
        _manager.first_name = first_name
        _manager.last_name = last_name
        _manager.middle_name = middle_name or ""
        _manager.phone = random_phone_number()
        _manager.gender = _gender
        _manager.email = (first_name + last_name + "@gmail.com").lower()
        _manager.save()
        managers.append(_manager)

    print("[Done] Managers mixed -", len(managers))

    return managers


class Automation:
    def __init__(self):
        pass

    def initialize_db(self):
        self.reset_db()
        generate_companies()

        generate_managers()
        random_managers_mixed()

        generate_branches()
        generate_transfers()

        generate_transfers()
        generate_transfers()

        self.dispatch_branches()

    def reset_db(self):
        Company.objects.filter().delete()
        Manager.objects.filter().delete()
        TransferHistory.objects.filter().delete()
        Branch.objects.filter().delete()

    def dispatch_branches(self, index=3):
        if not index:
            return

        branches = Branch.objects.get_queryset().filter(manager=None)
        if branches.count() < 1:
            return

        managers = Manager.objects.filter(branch=None, branch_code__in=["", None])
        if managers.count() < 1:
            managers = random_managers_mixed()  # create 25 new random managers

        for branch, manager in zip(branches, managers):
            if manager.branch and manager.branch_code:
                print("[Error]")
                continue

            branch.manager = manager
            manager.branch_code = branch.code

            manager.save()
            branch.save()

        if (branches.count() - len(managers)) > 0:
            self.dispatch_branches(index - 1)


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
