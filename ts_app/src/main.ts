import { countdown, fetchWithTimeout, fetchParallel, fetchSequential } from "./async";
import { show, greet, clamp, formatDuration, renderTodos } from "./functions";
import type { Todo } from "./async";

import { summarize, filterByCategory, sortPosts, validatePost } from "./blog";
import type { Post } from "./blog";
import { POSTS } from "./data/POSTS";

import { createGallery } from "./shape";

const counter = document.createElement("h2");
document.getElementById("output")!.appendChild(counter);
countdown(counter);

const testCases: Array<[number, string]> = [
    [0, "0s"], [5, "5s"], [62, "1m 2s"],
    [3661, "1h 1m 1s"], [86400, "24h 0m 0s"],
];

const table = document.createElement("table");
table.innerHTML = "<tr><th>Input</th><th>Expected</th><th>Got</th><th>✓</th></tr>";
for (const [input, expected] of testCases) {
    const got = formatDuration(input);
    const pass = got === expected;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${input}</td><td>${expected}</td><td>${got}</td>
                     <td>${pass ? "✅" : "❌"}</td>`;
    if (!pass) row.classList.add("error");
    table.appendChild(row);
}

document.getElementById("output")!.appendChild(table);
show("greet", greet("World", 2));
show("clamp(15, 0, 10)", clamp(15, 0, 10));   // → 10
show("clamp(-5, 0, 10)", clamp(-5, 0, 10));   // → 0

renderTodos();

fetchWithTimeout<Todo>("https://jsonplaceholder.typicode.com/todos/1", 5000)
    .then(todo => show("fetchWithTimeout success on 5000ms", todo.title))
    .catch(err => show("fetchWithTimeout error on 5000ms", err.message));
fetchWithTimeout<Todo>("https://jsonplaceholder.typicode.com/todos/1", 1)
    .then(todo => show("fetchWithTimeout success on 1ms", todo.title))
    .catch(err => show("fetchWithTimeout error on 1ms", err.message));

fetchParallel();

fetchSequential();

// Render each post as a card
function renderPostCard(post: Post): HTMLElement {
    const card = document.createElement("article");
    card.innerHTML = `<h3>${post.title}</h3><p>${summarize(post)}</p>`;
    return card;
}

const output = document.getElementById("output")!;
for (const post of POSTS) {
    output.appendChild(renderPostCard(post));
}

// Show filtered results
const filteredPosts = filterByCategory(POSTS, "tech");
const filteredSection = document.createElement("div");
filteredSection.innerHTML = `<h3>Tech posts: ${filteredPosts.map(p => p.title).join(", ")}</h3>`;

// Create a <select> element for sorting options and handle the "change" event to re-sort and re-render the post cards.
const sortOptionSelector = document.createElement("select");
sortOptionSelector.innerHTML = `
    <option value="title">Sort by title</option>
    <option value="date">Sort by date</option>
    <option value="category">Sort by category</option>
`;

// Attach an event listener
sortOptionSelector.addEventListener("change", (event) => {
    const sortBy = (event.target as HTMLSelectElement).value as "title" | "date" | "category";
    const sorted = sortPosts(POSTS, sortBy);

    filteredSection.innerHTML = `<h3>Posts sorted by ${sortBy}: ${sorted.map(p => p.title).join(", ")}</h3>`;
});

output.appendChild(sortOptionSelector);
output.appendChild(filteredSection);

const gallery = createGallery();
output.appendChild(gallery);

// Add a <textarea> to the page. When the user pastes JSON and clicks a
// "Validate" button:
//   - Parse the JSON (handle parse errors)
//   - Run validatePost on the result
//   - If it succeeds, display "✅ Valid Post" and render the card
//   - If it fails, display "❌ Invalid: <reason>"

const postValidationSection = document.createElement("div");
postValidationSection.innerHTML = "<h3>Validate a Post</h3>";

const postInput = document.createElement("textarea");
postInput.placeholder = "Paste post JSON here...";
postInput.rows = 10;
postInput.cols = 50;
postValidationSection.appendChild(postInput);

const validationResult = document.createElement("p");

const validateButton = document.createElement("button");
validateButton.textContent = "Validate";
validateButton.addEventListener("click", () => {
    const input = postInput.value;
    let data: unknown;
    try {
        data = JSON.parse(input);
        const result = validatePost(data);
        if (!result.ok) {
            validationResult.textContent = `❌ Invalid Post: ${result.reason}`;
            return;
        } else {
            // If valid, render the post card
            const card = renderPostCard(result.post);
            postValidationSection.appendChild(card);
        }
        validationResult.textContent = "✅ Valid Post";
    } catch (err) {
        validationResult.textContent = `❌ Invalid JSON: ${err instanceof Error ? err.message : String(err)}`;
        return;
    }
});
postValidationSection.appendChild(validateButton);

postValidationSection.appendChild(validationResult);
output.appendChild(postValidationSection);