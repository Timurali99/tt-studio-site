import http.server, os

PORT = int(os.environ.get("PORT", 8080))
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        # no-cache => браузер каждый раз ревалидирует (Last-Modified/304) — обновления видны сразу
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
