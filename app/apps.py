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

            print("[Sudo] --> 201")
            admin.save()

            parallelism()

        return super().ready()


def parallelism():
    import threading
    from .generators import Automation

    try:
        thread = threading.Thread(target=lambda: Automation().initialize_db())
        thread.start()
    except Exception as e:
        print("[MultiThreading Error]  ==>  ", e)
        try:
            print("[Task Running] in main Thread]")
            Automation().initialize_db()
        except:
            print("[Failed] running task fails")
