from django.shortcuts import redirect, render, get_object_or_404

from django.contrib.auth.decorators import login_required, user_passes_test

from django.urls import reverse
from django.db.models import Count

from blog.forms import CommentForm, PostForm
from blog.models import Category, Post
from django.db.models import Count, F

POSTS = [
    {"pk": 1, "title": "Hello Django",    "body": "My first post."},
    {"pk": 2, "title": "URL Routing",     "body": "How include() works."},
    {"pk": 3, "title": "Template Tricks", "body": "Extends and blocks."},
]

def post_list(request):
    posts = (Post.objects.select_related("category")
                .annotate(comment_count=Count("comments")))
    categories = Category.objects.all()
    context = {
        "posts": posts,
        "categories": categories,
    }
    return render(request, "blog/post-list.html", context)

def post_detail(request, slug):
    post     = get_object_or_404(Post, slug=slug)

    if request.method == "GET":
        Post.objects.filter(pk=post.pk).update(view_count=F("view_count") + 1)
        post.refresh_from_db(fields=["view_count"])

    comments = post.comments.filter(active=True)
    form     = CommentForm()

    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment      = form.save(commit=False)
            comment.post = post
            comment.save()
            return redirect("blog:post-detail", slug=post.slug)

    return render(request, "blog/post-detail.html", {
        "post": post, "comments": comments, "form": form,
    })

def category_posts(request, slug):
    category = get_object_or_404(Category, slug=slug)
    posts = (Post.objects.filter(category=category)
                    .annotate(comment_count=Count("comments")))
    return render(request, "blog/post-list.html", {
        "posts": posts,
        "categories": Category.objects.all(),
        "active_category": category,
    })


@login_required
@user_passes_test(lambda u: u.is_staff)
def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save()
            return redirect("blog:post-detail", slug=post.slug)
    else:
        form = PostForm()
    return render(request, "blog/post-create.html", {"form": form})