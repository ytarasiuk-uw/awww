interface Circle    { kind: "circle";    radius: number; }
interface Rectangle { kind: "rectangle"; width: number; height: number; }
interface Triangle  { kind: "triangle";  base: number; height: number; }
type Shape = Circle | Rectangle | Triangle;

export function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}

export function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el as SVGElement;
}

export function renderShape(shape: Shape): SVGElement {
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
      return svgEl("polygon", { points: points.map(p => `${p.x},${p.y}`).join(" "), fill: "seagreen" });
  }
}

export function createGallery(): HTMLElement {
  const gallery = document.createElement("div");
  const shapes: Shape[] = [
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

// 3. Create an array of shapes and render them as an SVG gallery in the page.
//    Below each shape, display "Area: <value>".
//
// Hint: SVG elements must be created with document.createElementNS, and their
// attributes must be set with setAttribute (not direct property assignment):
//
//   // Wrap shapes in an <svg> container with an explicit viewBox:
//   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   svg.setAttribute("width", "120");
//   svg.setAttribute("height", "120");
//   svg.setAttribute("viewBox", "0 0 120 120");
//   svg.appendChild(svgEl("circle", { cx: 60, cy: 60, r: 50, fill: "steelblue" }));