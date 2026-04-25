#!/usr/bin/env python3
"""
Local dev server that simulates Vercel's cleanUrls + redirects.

Use this instead of `python3 -m http.server` to test the site exactly as
Vercel will serve it in production:
  - /case/nwn   serves case/nwn.html
  - /about     serves about.html
  - /resume    301-redirects per vercel.json
  - /projects.html, /experience.html, /project-viewer.html?... follow vercel.json redirects

Usage:
  python3 serve.py            # serves on http://localhost:8000
  python3 serve.py 3000       # custom port
"""
import http.server
import json
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).parent.resolve()
VERCEL_JSON = ROOT / "vercel.json"

REDIRECTS = []
if VERCEL_JSON.exists():
    try:
        REDIRECTS = json.loads(VERCEL_JSON.read_text()).get("redirects", [])
    except Exception as e:
        print(f"Warning: couldn't parse vercel.json: {e}")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self._handle_redirects():
            return
        self._rewrite_clean_url()
        super().do_GET()

    def _handle_redirects(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        for r in REDIRECTS:
            if r["source"] != path:
                continue
            # Match optional query-string `has` clauses (Vercel routing semantics)
            matched = True
            for h in r.get("has", []):
                if h.get("type") != "query":
                    continue
                key = h["key"]
                val = h.get("value")
                if key not in query:
                    matched = False
                    break
                if val and val not in query.get(key, []):
                    matched = False
                    break
            if not matched:
                continue
            code = 301 if r.get("permanent") else 302
            self.send_response(code)
            self.send_header("Location", r["destination"])
            self.end_headers()
            return True
        return False

    def _rewrite_clean_url(self):
        parsed = urlparse(self.path)
        path = parsed.path
        last = path.rsplit("/", 1)[-1]
        # Skip rewrites for paths with extensions or root
        if "." in last or path == "/":
            return
        full = ROOT / path.lstrip("/")
        # Directory with index.html → serve the index directly (Vercel trailingSlash: false)
        if full.is_dir():
            idx = full / "index.html"
            if idx.is_file():
                self.path = path.rstrip("/") + "/index.html"
                if parsed.query:
                    self.path += "?" + parsed.query
            return
        # /foo → foo.html
        if path.endswith("/"):
            return
        html_file = ROOT / (path.lstrip("/") + ".html")
        if html_file.is_file():
            self.path = path + ".html"
            if parsed.query:
                self.path += "?" + parsed.query

    def log_message(self, fmt, *args):
        # Compact log: "GET /path -> 200"
        print(f"{self.command} {self.path} -> {args[1]}")


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Serving {ROOT}", flush=True)
    print(f"  URL:        http://localhost:{port}/", flush=True)
    print(f"  cleanUrls:  enabled (e.g., /case/nwn -> case/nwn.html)", flush=True)
    print(f"  redirects:  {len(REDIRECTS)} loaded from vercel.json", flush=True)
    print(f"\nPress Ctrl+C to stop.\n", flush=True)
    # Threaded so a hung browser connection doesn't block other requests
    server = http.server.ThreadingHTTPServer(("", port), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
