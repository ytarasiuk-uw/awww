from django import forms
from .models import Comment, Post

class CommentForm(forms.ModelForm):
    class Meta:
        model  = Comment
        fields = ["author", "email", "body"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 4}),
        }
        labels = {
            "author": "Your Name",
        }

    def clean_author(self):
        self.cleaned_data["author"] = self.cleaned_data["author"].strip()
        author = self.cleaned_data["author"]
        if not author:
            raise forms.ValidationError("Author name is required.")
        if len(author) < 2:
            raise forms.ValidationError("Author name must be at least 2 characters long.")
        return author

    def clean_body(self):
        body = self.cleaned_data["body"]
        if len(body) > 1000:
            raise forms.ValidationError("Comment body must be at most 1000 characters long.")
        return body

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "slug", "body", "category"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 10}),
        }