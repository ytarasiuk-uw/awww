export interface Category {
    id:   number;
    name: string;
    slug: string;
}

export interface Post {
    id:       number;
    title:    string;
    slug:     string;
    body:     string;
    pubDate:  string;
    category: Category | null;
}

export interface Comment {
    id:      number;
    author:  string;
    body:    string;
    created: string;
}

export function summarize(post: Post): string {
    return post.title + " (" + (post.category ? post.category.name : "Uncategorised") + ") — " + post.body.slice(0, 50) + "...";
}

export function filterByCategory(posts: Post[], categoryName: string): Post[] {
  return posts.filter(post => post.category?.name.toLowerCase() === categoryName.toLowerCase());
}

export function sortPosts(posts: Post[], by: "title" | "date" | "category"): Post[] {
  const sorted = [...posts];
  sorted.sort((a, b) => {
    if (by === "title") {
      return a.title.localeCompare(b.title);
    }
    if (by === "date") {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    }
    if (by === "category") {
      const categoryA = a.category?.name || "";
      const categoryB = b.category?.name || "";
      return categoryA.localeCompare(categoryB);
    }
    return 0;
  });
  return sorted;
}

// Validate a post object. Check that:
//   - data is an object (not null)
//   - id is a number
//   - title, slug, body, pubDate are strings
//   - category is null or an object with id (number), name (string), slug (string)
interface Valid { ok: true; post: Post };
interface Invalid { ok: false; reason: string };
type ValidationResult = Valid | Invalid;

export function validatePost(data: unknown): ValidationResult {
  if (typeof data !== "object" || data === null) {
      return { ok: false, reason: "Data is not an object" };
  }

  const postData = data as Partial<Post>;

  if (typeof postData.id !== "number") {
      return { ok: false, reason: "id is not a number" };
  }

  if (typeof postData.title !== "string") {
      return { ok: false, reason: "title is not a string" };
  }
  if (typeof postData.slug !== "string") {
      return { ok: false, reason: "slug is not a string" };
  }
  if (typeof postData.body !== "string") {
      return { ok: false, reason: "body is not a string" };
  }
  if (typeof postData.pubDate !== "string") {
      return { ok: false, reason: "pubDate is not a string" };
  }

  if (postData.category !== null && typeof postData.category !== "object") {
      return { ok: false, reason: "category is not an object or null" };
  }

  if (postData.category) {
      const category = postData.category as Partial<Category>;
      if (typeof category.id !== "number") {
          return { ok: false, reason: "category.id is not a number" };
      }
      if (typeof category.name !== "string") {
          return { ok: false, reason: "category.name is not a string" };
      }
      if (typeof category.slug !== "string") {
          return { ok: false, reason: "category.slug is not a string" };
      }
  }

  return { ok: true, post: postData as Post };
}