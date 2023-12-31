from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"

    def ready(self) -> None:
        from django.contrib.auth import get_user_model

        user_model = get_user_model()
        admin = user_model.objects.filter(username="admin", is_superuser=True).exists()

        if not admin:
            admin = user_model.objects.create(username="admin", email="admin@admin.com")
            admin.set_password("admin")
            admin.is_active = True
            admin.is_staff = True
            admin.is_superuser = True

            print("[sudo] --> 201")
            admin.save()

            automate_db()
        return super().ready()


def automate_db():
    # from .automation import Automation

    # Automation().initialize_db()
    pass
