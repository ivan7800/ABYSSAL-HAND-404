from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import webbrowser

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

for port in range(8765, 8791):
    try:
        server = ThreadingHTTPServer(("127.0.0.1", port), SimpleHTTPRequestHandler)
        url = f"http://127.0.0.1:{port}"
        print(f"ABYSSAL HAND 404 -> {url}")
        print("Pulsa Ctrl+C para cerrar.")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        server.serve_forever()
        break
    except OSError as exc:
        if getattr(exc, "errno", None) not in (48, 98, 10048):
            raise
else:
    raise SystemExit("No hay un puerto libre entre 8765 y 8790.")
