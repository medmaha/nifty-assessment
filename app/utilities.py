def query_params(url: str):
    params = {}
    url_list = url.split("?")

    if len(url_list) < 2:
        return params
    queries = url_list[1].split("&")

    for query in queries:
        key, value = query.split("=")
        if key and value:
            params[key] = value

    return params
