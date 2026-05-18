function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// async/await makes Promise code read top-to-bottom:
export async function countdown(element: HTMLElement): Promise<void> {
    for (let i = 5; i >= 0; i--) {
        element.textContent = `${i}…`;
        await delay(1000);
    }
    element.textContent = "Go!";
}

export interface Todo {
    userId:    number;
    id:        number;
    title:     string;
    completed: boolean;
}

export async function fetchTodo(id: number): Promise<Todo> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    const data: Todo = await res.json();
    return data;
}

export function fetchWithTimeout<T>(url: string, ms: number): Promise<T> {
    return Promise.race([
        fetch(url).then(res => {
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

export async function fetchParallel(): Promise<void> {
  const now = performance.now();
  const todos = await Promise.all(Array.from({ length: 10 }, (_, i) => fetchTodo(i + 1)));
  const elapsed = performance.now() - now;
  const container = document.createElement("div");
  container.innerHTML = `<h3>Todos fetched in parallel (took ${elapsed.toFixed(2)}ms)</h3>`;
  document.getElementById("output")!.appendChild(container);
}

export async function fetchSequential(): Promise<void> {
  const now = performance.now();
  const todos: Todo[] = [];
  for (let i = 1; i <= 10; i++) {
    const todo = await fetchTodo(i);
    todos.push(todo);
  }
  const elapsed = performance.now() - now;
  const container = document.createElement("div");
  container.innerHTML = `<h3>Todos fetched sequentially (took ${elapsed.toFixed(2)}ms)</h3>`;
  document.getElementById("output")!.appendChild(container);
}