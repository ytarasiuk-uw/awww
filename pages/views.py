from django.shortcuts import render
import datetime

def home(request):
    context = {
        "page_title": "My Page",
        "heading": "This page shows the time.",
        "server_time": datetime.datetime.now()
    }
    return render(request, "pages/home.html", context)

def about(request):
    context = {
        "skills": [
            "Python",
            "HTTP",
            "HTML",
            "CSS",
        ]
    }
    return render(request, "pages/about.html", context)

def greet(request, name):
    context = {
        "name": name
    }
    return render(request, "pages/greet.html", context)

ALL_PROJECTS = [
    {"name": "Socket Server",    "lang": "Python",     "year": 2025, "done": True},
    {"name": "HTML Profile",     "lang": "HTML",       "year": 2025, "done": True},
    {"name": "CSS Layout",       "lang": "CSS",        "year": 2025, "done": True},
    {"name": "Django App",       "lang": "Python",     "year": 2025, "done": False},
    {"name": "REST API",         "lang": "Python",     "year": 2024, "done": True},
    {"name": "React Dashboard",  "lang": "JavaScript", "year": 2024, "done": True},
    {"name": "SQL Queries Lab",  "lang": "SQL",        "year": 2024, "done": True},
    {"name": "CLI Tool",         "lang": "Python",     "year": 2023, "done": True},
]

def projects(request):
    q = request.GET.get("q", "")
    # TODO: if q is non-empty, filter ALL_PROJECTS so only entries whose name
    #       or lang contains q (case-insensitive) are kept; otherwise show all
    project_list = ALL_PROJECTS  # replace this line
    done_count = project_list.count()
    context = {
        "project_list": project_list,
        "done_count": done_count,
        "q": q
        # TODO: pass project_list, done_count, and q
    }
    return render(request, "pages/projects.html", context)
