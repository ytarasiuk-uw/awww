import type { Post } from "../blog";

export const POSTS: Post[] = [
    {
        id: 1, title: "Hello TypeScript", slug: "hello-ts",
        body: "TypeScript is JavaScript with types. It compiles to plain JS.",
        pubDate: "2025-01-01",
        category: { id: 1, name: "Tech", slug: "tech" },
    },
    {
        id: 2, title: "CSS Grid", slug: "css-grid",
        body: "CSS Grid is a two-dimensional layout system for the web.",
        pubDate: "2025-01-15",
        category: { id: 2, name: "Frontend", slug: "frontend" },
    },
    {
        id: 3, title: "Django REST", slug: "django-rest",
        body: "Build a REST API with Django and serve JSON to any client.",
        pubDate: "2025-02-01",
        category: { id: 1, name: "Tech", slug: "tech" },
    },
];