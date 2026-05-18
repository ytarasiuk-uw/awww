import { fetchTodo } from "./async";

export async function renderTodos(): Promise<void> {
    const container = document.createElement("div");
    container.innerHTML = "<h3>Todos from API</h3>";
    document.getElementById("output")!.appendChild(container);

    for (const id of [1, 2, 3]) {
        const todo = await fetchTodo(id);
        const p = document.createElement("p");
        p.textContent = `${todo.completed ? "✅" : "⬜"} ${todo.title}`;
        container.appendChild(p);
    }
}

export function show(label: string, value: unknown): void {
    const output = document.getElementById("output")!;
    const line = document.createElement("p");
    line.textContent = `${label}: ${String(value)}`;
    output.appendChild(line);
}

export function greet(name: string, times: number): string {
    return `Hello, ${name}! `.repeat(times).trim();
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h === 0 && m === 0) return `${s}s`;
    if (h === 0) return `${m}m ${s}s`;
    return `${h}h ${m}m ${s}s`;
}