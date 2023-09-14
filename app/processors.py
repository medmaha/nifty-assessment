def app_template_processor(request):
    return {"IPP": int(request.session.get("ITEMS_PER_PAGE", 10))}
