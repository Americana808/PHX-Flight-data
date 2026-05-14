# ✈️ PHX Flight Data Scraper & Tracker

A web application that scrapes live departure data from Phoenix Sky Harbor International Airport (PHX) and displays it through a modern React frontend. Built for real-time use at a PHX kiosk.

---

## Features

- **Live Data Scraping** - Pulls current American Airlines departure info from skyharbor.com using Selenium
- **Split-Flap UI** - Mechanical departure board aesthetic with per-character flap tiles
- **Scrape Button** - Trigger a fresh scrape on demand from the browser
- **Auto-Refresh** - Automatically re-fetches data every 30 minutes
- **Flight Links** - Each flight number links to a Google search for quick lookup
- **Dark & Light Themes** - Toggle between charcoal/cream and parchment/ink
- **Mobile Responsive** - Card-based layout on small screens, full table on desktop

---

## Technologies

- **Python / Flask** - REST API backend
- **Selenium + webdriver-manager** - Headless Chrome scraping
- **React + Vite** - Frontend
- **Tailwind CSS** - Styling
- **Gunicorn + Nginx** - Production server

---

## Project Structure

```
PHX-Flight-data/
├── webapp.py              # Flask API (GET /api/flights, POST /api/scrape)
├── skyharbot.py           # Selenium scraper - writes to flights.json
├── flights.json           # Cached flight data
├── requirements.txt       # Python dependencies
├── nginx.conf             # Nginx config for VPS deployment
├── phx-flights.service    # Systemd service for Gunicorn
├── deploy.md              # Full VPS deployment guide
└── frontend/              # React + Vite app
    ├── src/
    │   └── components/
    │       └── FlightBoard.jsx
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Clone the repo

```bash
git clone https://github.com/Americana808/PHX-Flight-data.git
cd PHX-Flight-data
```

### Backend

```bash
pip install -r requirements.txt
python webapp.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` - API calls are proxied to Flask on port 5000.

---

## Deployment

See [deploy.md](deploy.md) for the full VPS setup guide (Ubuntu + Nginx + Gunicorn + Let's Encrypt).

---

## Live Demo

[skyharbot.work](https://skyharbot.work)

---

## Real-World Usage

Actively used at a Phoenix Sky Harbor International Airport kiosk to monitor real-time American Airlines departures at gates A22, A24-A30. Replaces manual flight checks and helps staff obtain accurate travel for store hours.
