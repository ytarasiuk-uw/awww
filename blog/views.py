from django.shortcuts import render

POSTS = [
    {"pk": 1, "title": "Hello Django",    "body": "My first post."},
    {"pk": 2, "title": "URL Routing",     "body": "How include() works."},
    {"pk": 3, "title": "Template Tricks", "body": "Extends and blocks."},
]

def post_list(request):
    posts_short = ({"pk": post['pk'], "title": post['title']} for post in POSTS)
    context = {
        "posts": posts_short
    }
    return render(request, "pages/post-list.html", context)

def post_detail(request, pk):
    found_post = (x for x in POSTS if x['pk']==pk)
    context = {
        "post": found_post
    }
    return render(request, "pages/post-detail.html", context)
