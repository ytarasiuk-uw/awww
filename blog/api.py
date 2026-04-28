from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Post, Comment
from .serializers import CommentListResponseSerializer, PostListResponseSerializer, PostSerializer, CommentSerializer

class PostListView(APIView):
    # This single line replaces all your manual `request.user.is_authenticated` checks!
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        request=None,
        responses={
            200: OpenApiResponse(description="List of posts returned.", response=PostListResponseSerializer),
        },
    )
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        # We can still return the exact dict structure you had before
        return Response({"posts": serializer.data, "from": "api"})

    @extend_schema(
        request=PostSerializer,
        responses={
            201: OpenApiResponse(description="Post created successfully.", response=PostSerializer),
            400: OpenApiResponse(description="Invalid input."),
        },
    )
    def post(self, request):
        # request.data automatically handles json.loads() for you
        serializer = PostSerializer(data=request.data)
        
        # This replaces your manual field-checking (title, slug, body)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class PostDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        request=None,
        responses={
            200: OpenApiResponse(description="Post retrieved successfully.", response=PostSerializer),
            404: OpenApiResponse(description="Post not found."),
        },
    )
    def get(self, request, pk):
        # get_object_or_404 automatically returns your 404 response if missing
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    @extend_schema(
        request=PostSerializer,
        responses={
            200: OpenApiResponse(description="Post updated successfully.", response=PostSerializer),
            400: OpenApiResponse(description="Invalid input."),
            404: OpenApiResponse(description="Post not found."),
        },
    )
    def patch(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        # partial=True tells DRF that it's okay if not all fields are provided
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
            
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=None,
        responses={
            204: OpenApiResponse(description="Post deleted successfully."),
            404: OpenApiResponse(description="Post not found."),
        },
    )
    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PostCommentView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        request=None,
        responses={
            200: OpenApiResponse(description="List of comments for the post.", response=CommentListResponseSerializer),
            404: OpenApiResponse(description="Post not found."),
        },
    )
    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        comments = post.comments.filter(active=True)
        serializer = CommentSerializer(comments, many=True)
        return Response({"comments": serializer.data})

    @extend_schema(
        request=CommentSerializer,
        responses={
            201: OpenApiResponse(description="Comment created successfully.", response=CommentSerializer),
            400: OpenApiResponse(description="Invalid input."),
            404: OpenApiResponse(description="Post not found."),
        },
    )
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        # Note: Your old code accepted raw text: request.body.decode()
        # DRF expects JSON. The client must send: {"body": "My comment text", "author": "..."}
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            # You can pass extra kwargs to save() to auto-fill model fields
            serializer.save(post=post, active=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)