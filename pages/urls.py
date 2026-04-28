from django.conf import settings
from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
    path("greet/<str:name>/", views.greet, name="greet"),
    path("projects/", views.projects, name="projects"),
    path("error/", views.error, name="error"),
    path("guestbook/", views.guestbook, name="guestbook"),
    path("api-demo/", views.api_demo, name="api-demo"),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns