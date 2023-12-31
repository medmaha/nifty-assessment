import app.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Branch",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                (
                    "code",
                    models.CharField(default=app.models.generate_code, max_length=200),
                ),
                ("posted_date", models.DateField(null=True)),
            ],
            options={
                "verbose_name_plural": "Branches",
                "get_latest_by": "id",
            },
        ),
        migrations.CreateModel(
            name="Company",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("town", models.CharField(max_length=200)),
                ("street_name", models.CharField(max_length=200)),
                ("street_number", models.CharField(max_length=200)),
                ("phone_number", models.CharField(max_length=200)),
                ("po_box_number", models.CharField(max_length=200)),
            ],
            options={
                "verbose_name_plural": "Companies",
            },
        ),
        migrations.CreateModel(
            name="Manager",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("email", models.EmailField(max_length=200)),
                ("first_name", models.CharField(max_length=200)),
                ("last_name", models.CharField(max_length=200)),
                ("phone", models.CharField(blank=True, max_length=200)),
                (
                    "code",
                    models.CharField(default=app.models.generate_code, max_length=200),
                ),
                ("gender", models.CharField(default="Male", max_length=20)),
                (
                    "middle_name",
                    models.CharField(blank=True, default="", max_length=200),
                ),
                (
                    "branch_code",
                    models.CharField(blank=True, default="", max_length=200),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Region",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "code",
                    models.CharField(default=app.models.generate_code, max_length=200),
                ),
                (
                    "name",
                    models.CharField(
                        choices=[
                            ("lrr", "Lower River Region"),
                            ("urr", "Upper River Region"),
                            ("crr", "Central River Region"),
                            ("nbr", "North Bank Region"),
                            ("bjl", "Greater Banjul Division"),
                            ("wcr", "West Coast Region"),
                        ],
                        default=app.models.generate_code,
                        max_length=200,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TransferHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("posting_date", models.DateTimeField()),
                ("transfer_date", models.DateTimeField()),
                ("remarks", models.TextField(default="")),
                (
                    "from_branch",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="manager_from",
                        to="app.branch",
                    ),
                ),
                (
                    "manager",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="app.manager"
                    ),
                ),
                (
                    "to_branch",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="manager_to",
                        to="app.branch",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "TransferHistories",
            },
        ),
        migrations.AddField(
            model_name="branch",
            name="company",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="app.company"
            ),
        ),
        migrations.AddField(
            model_name="branch",
            name="manager",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="app.manager",
            ),
        ),
        migrations.AddField(
            model_name="branch",
            name="region",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.SET_NULL, to="app.region"
            ),
        ),
    ]
