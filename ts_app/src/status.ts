// An enum compiles to a real JavaScript object.
import type { Post } from "./blog";

export enum PostStatus {
    Draft     = "draft",
    Published = "published",
    Archived  = "archived",
}

// A union type: the value must be one of these strings.
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequest {
    method:  HttpMethod;
    path:    string;
    body?:   unknown;    // ? makes the field optional
}

// A type guard narrows a wide type to a specific one.
export function isPost(value: unknown): value is Post {
    return (
        typeof value === "object" &&
        value !== null &&
        "title" in value &&
        "slug"  in value
    );
}

export function describeRequest(req: ApiRequest): string {
    const hasBody = req.body !== undefined;
    return `${req.method} ${req.path}${hasBody ? " (has body)" : ""}`;
}