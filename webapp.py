from flask import Flask, render_template
import json
import os

app = Flask(__name__)

@app.route("/")
def index():
    try:
        path = os.path.join(os.path.dirname(__file__), "flights.json")
        with open(path) as f:
            flights = json.load(f)
    except Exception:
        flights = []

    return render_template("index.html", flights=flights)

if __name__ == "__main__":
    app.run(debug=True)
