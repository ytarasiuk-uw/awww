import os
from urllib.parse import unquote_plus
import socket

import time
from datetime import datetime

import threading

VISITOR_COUNT = 0

MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
}

LOCK = threading.Lock()


def read_file(path):
    public_root = os.path.abspath("public")
    print(path)  #!!!
    abs_path = os.path.abspath(os.path.join("public", path.lstrip("/")))

    if not abs_path.startswith(public_root + os.sep):
        return b"<h1>403 Forbidden</h1>", "403 Forbidden", "text/html"

    ext = os.path.splitext(abs_path)[1].lower()
    mime = MIME_TYPES.get(ext, "application/octet-stream")

    try:
        with open(abs_path, "rb") as f:
            return f.read(), "200 OK", mime
    except FileNotFoundError:
        return b"<h1>404 Not Found</h1>", "404 Not Found", "text/html"


def parse_post_body(request_data: str):
    # The body is separated from headers by a blank line
    parts = request_data.split("\r\n\r\n", 1)
    if len(parts) < 2:
        return {}
    body: str = parts[1]
    if body == "":
        return {}
    # TODO: Split body by '&', then each pair by '='.
    # Apply unquote_plus() to both key and value — browsers encode
    # spaces as '+' and special chars as %XX (e.g. "Hello+World%21").
    # Return a dict like {"name": "Alice", "email": "..."}
    return {
        unquote_plus(entry.split("=")[0]): unquote_plus(entry.split("=")[1])
        for entry in body.split("&")
    }


def parse_request(client_connection):
    request_data = client_connection.recv(1024).decode("utf-8")
    if not request_data:
        return "", ""

    first_line = request_data.split("\n")[0]
    path = first_line.split()[1]

    body = parse_post_body(request_data)

    print(f"--- Received Request ---\nPath: {path}\n------------------------")

    return path, body


def generate_response(content: str, status_code="200 OK", mime="text/html"):
    if isinstance(content, str):
        content = content.encode()

    status_line = f"HTTP/1.1 {status_code}\r\n"
    headers = (
        f"Content-Type: {mime}\r\n"
        f"Cache-Control: no-store, must-revalidate\r\n"
        f"Content-Length: {len(content)}\r\n"
    )
    sep = "\r\n"

    response_str = (status_line + headers + sep).encode() + content
    return response_str


# ----------------------
#   Response Handlers
# ----------------------


def handle_home(path, body):
    return read_file("/index.html")


def handle_submit(path, body):

    content, status, mime = read_file("/submit.html")

    if body:
        name = body.get("name", "N/A")
        email = body.get("email", "N/A")
        message = body.get("message", "").strip()

        html_text = content.decode("utf-8")

        html_text = html_text.replace("{{name}}", name)
        html_text = html_text.replace("{{email}}", email)
        html_text = html_text.replace("{{message}}", message)

        content = html_text.encode("utf-8")

    return content, status, mime


ROUTES = {"/": handle_home, "/submit": handle_submit}


# Response maker
def respond(path, body, client_connection):
    global VISITOR_COUNT

    if path in ROUTES:
        handler_function = ROUTES[path]
        content, status, mime = handler_function(path, body)
    else:
        content, status, mime = read_file(path)

    response = generate_response(content, status, mime)

    with LOCK:
        VISITOR_COUNT += 1
        print(f"Visitor count: {VISITOR_COUNT}")

    client_connection.sendall(response)
    client_connection.close()


def server_init():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    server_socket.bind(("localhost", 8000))
    server_socket.listen(5)

    print("Server running on http://localhost:8000 ...")
    return server_socket


def main():
    global VISITOR_COUNT

    server_socket = server_init()

    threads = []

    while True:
        client_connection, client_address = server_socket.accept()
        print(f"Connection received from {client_address}!")

        path, body = parse_request(client_connection)

        t = threading.Thread(
            target=respond,
            args=(
                path,
                body,
                client_connection,
            ),
        )
        threads.append(t)
        t.start()

        if VISITOR_COUNT > 100:
            break

    for t in threads:
        t.join()


if __name__ == "__main__":
    main()
