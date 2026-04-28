from rest_framework import serializers
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Comment
        fields = ["id", "author", "email", "body", "created"]
        # Make sure author/body match whether they are required in your models

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    
    # This mimics your old `post.category.name` behavior
    category = serializers.StringRelatedField() 

    class Meta:
        model  = Post
        fields = ["id", "title", "slug", "body", "pub_date", "category", "comments"]

# Fixed: Standard Serializers don't use Meta classes!
class PostListResponseSerializer(serializers.Serializer):
    posts = PostSerializer(many=True)

class CommentListResponseSerializer(serializers.Serializer):
    comments = CommentSerializer(many=True)