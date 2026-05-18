"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/async.ts
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function countdown(element) {
    for (let i = 5; i >= 0; i--) {
      element.textContent = `${i}\u2026`;
      await delay(1e3);
    }
    element.textContent = "Go!";
  }
  async function fetchTodo(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  }
  function fetchWithTimeout(url, ms) {
    return Promise.race([
      fetch(url).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      }),
      delay(ms).then(() => {
        throw new Error("Timeout");
      })
    ]);
  }
  async function fetchParallel() {
    const now = performance.now();
    const todos = await Promise.all(Array.from({ length: 10 }, (_, i) => fetchTodo(i + 1)));
    const elapsed = performance.now() - now;
    const container = document.createElement("div");
    container.innerHTML = `<h3>Todos fetched in parallel (took ${elapsed.toFixed(2)}ms)</h3>`;
    document.getElementById("output").appendChild(container);
  }
  async function fetchSequential() {
    const now = performance.now();
    const todos = [];
    for (let i = 1; i <= 10; i++) {
      const todo = await fetchTodo(i);
      todos.push(todo);
    }
    const elapsed = performance.now() - now;
    const container = document.createElement("div");
    container.innerHTML = `<h3>Todos fetched sequentially (took ${elapsed.toFixed(2)}ms)</h3>`;
    document.getElementById("output").appendChild(container);
  }
  var init_async = __esm({
    "src/async.ts"() {
      "use strict";
    }
  });

  // src/functions.ts
  async function renderTodos() {
    const container = document.createElement("div");
    container.innerHTML = "<h3>Todos from API</h3>";
    document.getElementById("output").appendChild(container);
    for (const id of [1, 2, 3]) {
      const todo = await fetchTodo(id);
      const p = document.createElement("p");
      p.textContent = `${todo.completed ? "\u2705" : "\u2B1C"} ${todo.title}`;
      container.appendChild(p);
    }
  }
  function show(label, value) {
    const output = document.getElementById("output");
    const line = document.createElement("p");
    line.textContent = `${label}: ${String(value)}`;
    output.appendChild(line);
  }
  function greet(name, times) {
    return `Hello, ${name}! `.repeat(times).trim();
  }
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = seconds % 60;
    if (h === 0 && m === 0) return `${s}s`;
    if (h === 0) return `${m}m ${s}s`;
    return `${h}h ${m}m ${s}s`;
  }
  var init_functions = __esm({
    "src/functions.ts"() {
      "use strict";
      init_async();
    }
  });

  // src/blog.ts
  function summarize(post) {
    return post.title + " (" + (post.category ? post.category.name : "Uncategorised") + ") \u2014 " + post.body.slice(0, 50) + "...";
  }
  function filterByCategory(posts, categoryName) {
    return posts.filter((post) => post.category?.name.toLowerCase() === categoryName.toLowerCase());
  }
  function sortPosts(posts, by) {
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
  function validatePost(data) {
    if (typeof data !== "object" || data === null) {
      return { ok: false, reason: "Data is not an object" };
    }
    const postData = data;
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
      const category = postData.category;
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
    return { ok: true, post: postData };
  }
  var init_blog = __esm({
    "src/blog.ts"() {
      "use strict";
    }
  });

  // src/data/POSTS.ts
  var POSTS;
  var init_POSTS = __esm({
    "src/data/POSTS.ts"() {
      "use strict";
      POSTS = [
        {
          id: 1,
          title: "Hello TypeScript",
          slug: "hello-ts",
          body: "TypeScript is JavaScript with types. It compiles to plain JS.",
          pubDate: "2025-01-01",
          category: { id: 1, name: "Tech", slug: "tech" }
        },
        {
          id: 2,
          title: "CSS Grid",
          slug: "css-grid",
          body: "CSS Grid is a two-dimensional layout system for the web.",
          pubDate: "2025-01-15",
          category: { id: 2, name: "Frontend", slug: "frontend" }
        },
        {
          id: 3,
          title: "Django REST",
          slug: "django-rest",
          body: "Build a REST API with Django and serve JSON to any client.",
          pubDate: "2025-02-01",
          category: { id: 1, name: "Tech", slug: "tech" }
        }
      ];
    }
  });

  // src/shape.ts
  function area(shape) {
    switch (shape.kind) {
      case "circle":
        return Math.PI * shape.radius ** 2;
      case "rectangle":
        return shape.width * shape.height;
      case "triangle":
        return shape.base * shape.height / 2;
    }
  }
  function svgEl(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, String(v));
    }
    return el;
  }
  function renderShape(shape) {
    switch (shape.kind) {
      case "circle":
        return svgEl("circle", { cx: 60, cy: 60, r: shape.radius, fill: "steelblue" });
      case "rectangle":
        return svgEl("rect", { x: 10, y: 30, width: shape.width, height: shape.height, fill: "coral" });
      case "triangle":
        const points = [
          { x: 60 - shape.base / 2, y: 60 + shape.height / 2 },
          { x: 60 + shape.base / 2, y: 60 + shape.height / 2 },
          { x: 60, y: 60 - shape.height / 2 }
        ];
        return svgEl("polygon", { points: points.map((p) => `${p.x},${p.y}`).join(" "), fill: "seagreen" });
    }
  }
  function createGallery() {
    const gallery = document.createElement("div");
    const shapes = [
      { kind: "circle", radius: 50 },
      { kind: "rectangle", width: 100, height: 60 },
      { kind: "triangle", base: 100, height: 80 }
    ];
    for (const shape of shapes) {
      const container = document.createElement("div");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "120");
      svg.setAttribute("height", "120");
      svg.setAttribute("viewBox", "0 0 120 120");
      svg.appendChild(renderShape(shape));
      container.appendChild(svg);
      const areaText = document.createElement("p");
      areaText.textContent = `Area: ${area(shape).toFixed(2)}`;
      container.appendChild(areaText);
      gallery.appendChild(container);
    }
    return gallery;
  }
  var init_shape = __esm({
    "src/shape.ts"() {
      "use strict";
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_async();
      init_functions();
      init_blog();
      init_POSTS();
      init_shape();
      var counter = document.createElement("h2");
      document.getElementById("output").appendChild(counter);
      countdown(counter);
      var testCases = [
        [0, "0s"],
        [5, "5s"],
        [62, "1m 2s"],
        [3661, "1h 1m 1s"],
        [86400, "24h 0m 0s"]
      ];
      var table = document.createElement("table");
      table.innerHTML = "<tr><th>Input</th><th>Expected</th><th>Got</th><th>\u2713</th></tr>";
      for (const [input, expected] of testCases) {
        const got = formatDuration(input);
        const pass = got === expected;
        const row = document.createElement("tr");
        row.innerHTML = `<td>${input}</td><td>${expected}</td><td>${got}</td>
                     <td>${pass ? "\u2705" : "\u274C"}</td>`;
        if (!pass) row.classList.add("error");
        table.appendChild(row);
      }
      document.getElementById("output").appendChild(table);
      show("greet", greet("World", 2));
      show("clamp(15, 0, 10)", clamp(15, 0, 10));
      show("clamp(-5, 0, 10)", clamp(-5, 0, 10));
      renderTodos();
      fetchWithTimeout("https://jsonplaceholder.typicode.com/todos/1", 5e3).then((todo) => show("fetchWithTimeout success on 5000ms", todo.title)).catch((err) => show("fetchWithTimeout error on 5000ms", err.message));
      fetchWithTimeout("https://jsonplaceholder.typicode.com/todos/1", 1).then((todo) => show("fetchWithTimeout success on 1ms", todo.title)).catch((err) => show("fetchWithTimeout error on 1ms", err.message));
      fetchParallel();
      fetchSequential();
      function renderPostCard(post) {
        const card = document.createElement("article");
        card.innerHTML = `<h3>${post.title}</h3><p>${summarize(post)}</p>`;
        return card;
      }
      var output = document.getElementById("output");
      for (const post of POSTS) {
        output.appendChild(renderPostCard(post));
      }
      var filteredPosts = filterByCategory(POSTS, "tech");
      var filteredSection = document.createElement("div");
      filteredSection.innerHTML = `<h3>Tech posts: ${filteredPosts.map((p) => p.title).join(", ")}</h3>`;
      var sortOptionSelector = document.createElement("select");
      sortOptionSelector.innerHTML = `
    <option value="title">Sort by title</option>
    <option value="date">Sort by date</option>
    <option value="category">Sort by category</option>
`;
      sortOptionSelector.addEventListener("change", (event) => {
        const sortBy = event.target.value;
        const sorted = sortPosts(POSTS, sortBy);
        filteredSection.innerHTML = `<h3>Posts sorted by ${sortBy}: ${sorted.map((p) => p.title).join(", ")}</h3>`;
      });
      output.appendChild(sortOptionSelector);
      output.appendChild(filteredSection);
      var gallery = createGallery();
      output.appendChild(gallery);
      var postValidationSection = document.createElement("div");
      postValidationSection.innerHTML = "<h3>Validate a Post</h3>";
      var postInput = document.createElement("textarea");
      postInput.placeholder = "Paste post JSON here...";
      postInput.rows = 10;
      postInput.cols = 50;
      postValidationSection.appendChild(postInput);
      var validationResult = document.createElement("p");
      var validateButton = document.createElement("button");
      validateButton.textContent = "Validate";
      validateButton.addEventListener("click", () => {
        const input = postInput.value;
        let data;
        try {
          data = JSON.parse(input);
          const result = validatePost(data);
          if (!result.ok) {
            validationResult.textContent = `\u274C Invalid Post: ${result.reason}`;
            return;
          } else {
            const card = renderPostCard(result.post);
            postValidationSection.appendChild(card);
          }
          validationResult.textContent = "\u2705 Valid Post";
        } catch (err) {
          validationResult.textContent = `\u274C Invalid JSON: ${err instanceof Error ? err.message : String(err)}`;
          return;
        }
      });
      postValidationSection.appendChild(validateButton);
      postValidationSection.appendChild(validationResult);
      output.appendChild(postValidationSection);
    }
  });
  require_main();
})();
//# sourceMappingURL=main.js.map
