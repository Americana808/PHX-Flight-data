from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import subprocess
import sys

app = Flask(__name__, static_folder="frontend/dist", static_url_path="")
CORS(app)

FLIGHTS_PATH = os.path.join(os.path.dirname(__file__), "flights.json")
SCRAPER_PATH = os.path.join(os.path.dirname(__file__), "skyharbot.py")


@app.route("/api/flights")
def get_flights():
    try:
        with open(FLIGHTS_PATH) as f:
            flights = json.load(f)
        mtime = os.path.getmtime(FLIGHTS_PATH)
        return jsonify({"flights": flights, "last_updated": mtime})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/scrape", methods=["POST"])
def scrape():
    try:
        result = subprocess.run(
            [sys.executable, SCRAPER_PATH],
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0:
            return jsonify({"error": result.stderr}), 500

        with open(FLIGHTS_PATH) as f:
            flights = json.load(f)
        mtime = os.path.getmtime(FLIGHTS_PATH)
        return jsonify({"flights": flights, "last_updated": mtime})
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Scrape timed out after 60 seconds"}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Serve React app for all non-API routes
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    dist = os.path.join(app.static_folder, path)
    if path and os.path.exists(dist):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
