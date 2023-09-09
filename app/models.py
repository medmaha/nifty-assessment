from typing import Any
from django.db import models
from django.urls import reverse
from django.utils.text import slugify


def generate_code():
    import secrets

    return secrets.token_hex()


class Company(models.Model):
    name = models.CharField(max_length=200)
    town = models.CharField(max_length=200)
    street_name = models.CharField(max_length=200)
    street_number = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=200)
    po_box_number = models.CharField(max_length=200)

    class Meta:
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name

    @property
    def abs_path(self):
        return reverse("company_details", args=(str(self.pk),))


class Manager(models.Model):
    email = models.EmailField(max_length=200)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)

    phone = models.CharField(max_length=200, blank=True)
    code = models.CharField(max_length=200, default=generate_code)
    gender = models.CharField(default="Male", max_length=20)
    middle_name = models.CharField(max_length=200, default="", blank=True)
    branch_code = models.CharField(max_length=200, default="", blank=True)

    @property
    def name(self):
        return f"{self.first_name} {self.middle_name} {self.last_name}"

    @property
    def company(self):
        if self.branch:
            return self.branch.company

    @property
    def branch(self):
        _b = Branch.objects.filter(manager=self, code=self.branch_code).first()
        return _b

    @property
    def abs_path(self):
        return reverse("manager_details", args=(str(self.pk),))

    def __str__(self):
        return self.name


class Region(models.Model):
    REGIONS = (
        ("lrr", "Lower River Region"),
        ("urr", "Upper River Region"),
        ("crr", "Central River Region"),
        ("nbr", "North Bank Region"),
        ("bjl", "Greater Banjul Division"),
        ("wcr", "West Coast Region"),
    )

    code = models.CharField(max_length=200, default=generate_code)
    name = models.CharField(max_length=200, choices=REGIONS, default=generate_code)

    def __str__(self):
        return self.name.upper()


class BranchManager(models.Manager):
    def filter(self, *args, **kwargs):
        return (
            super()
            .filter(*args, **kwargs)
            .exclude(models.Q(manager=None) | models.Q(company=None))
        )

    def all(self):
        return super().all().exclude(models.Q(manager=None) | models.Q(company=None))


class Branch(models.Model):
    name = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    code = models.CharField(max_length=200, default=generate_code)
    region = models.ForeignKey(Region, null=True, on_delete=models.SET_NULL)
    manager = models.ForeignKey(Manager, null=True, on_delete=models.SET_NULL)
    posted_date = models.DateField(null=True)

    objects = BranchManager()

    class Meta:
        verbose_name_plural = "Branches"
        get_latest_by = "id"

    def __str__(self):
        return self.name + " - " + self.region.name.upper()


class TransferHistory(models.Model):
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE)
    to_branch = models.ForeignKey(
        Branch, on_delete=models.SET_NULL, null=True, related_name="manager_to"
    )
    from_branch = models.ForeignKey(
        Branch, on_delete=models.SET_NULL, null=True, related_name="manager_from"
    )
    posting_date = models.DateTimeField()
    transfer_date = models.DateTimeField()
    remarks = models.TextField(default="")

    class Meta:
        verbose_name_plural = "TransferHistories"

    @property
    def abs_path(self):
        return reverse("manager_details", args=(str(self.pk),))

    def __str__(self) -> str:
        return self.manager.name + " --> " + self.to_branch.name
