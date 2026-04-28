from django.http import HttpResponseRedirect
from django.shortcuts import render
import datetime

from django.urls import reverse

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
    message = ""
    if request.method == "POST":
        message = request.POST.get("note", "")
    context = {
        "name": name,
        "message": message
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
    print(f".{q}.")
    if q:
        q_lower = q.lower()
        project_list = [project for project in ALL_PROJECTS if q_lower in project['name'].lower() or q_lower in project['lang'].lower()]
    else:
        project_list = ALL_PROJECTS
    done_count = len([project for project in project_list if project['done']])
    context = {
        "project_list": project_list,
        "done_count": done_count,
        "q": q
    }
    return render(request, "pages/projects.html", context)

def error(request):
    message = request.GET.get(
        "message", "An unknown error occurred. Please try again later.")
    
    error_status = request.GET.get(
        "error_status", "Error")
    
    context = {
        "error_message": message,
        "error_status": error_status
    }
    return render(request, "pages/error.html", context)

GUESTBOOK_ENTRIES = []

def guestbook(request):
    if request.method == "POST":
        name = request.POST.get("name", "Unnamed")
        message = request.POST.get("message", "")
        if name and message:
            GUESTBOOK_ENTRIES.append({
                "name": name, 
                "message": message
            })
            return HttpResponseRedirect(reverse("guestbook"))
        
    context = {
        "entries": GUESTBOOK_ENTRIES
    }
    return render(request, "pages/guestbook.html", context)

def api_demo(request):
    return render(request, "pages/api-demo.html")