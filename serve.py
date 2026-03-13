import http.server
import socketserver
import os
import sys

port = int(os.environ.get("PORT", 3000))
directory = os.path.dirname(os.path.abspath(__file__))
os.chdir(directory)

handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", port), handler) as httpd:
    print(f"Serving on port {port}")
    httpd.serve_forever()
