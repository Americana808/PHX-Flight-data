# ✈️ PHX Flight Data Scraper & Tracker

A Python-based web application that **scrapes live flight data** from Phoenix Sky Harbor International Airport (PHX) and displays it through a **Flask-powered web interface**. Includes optional automation for **sending periodic flight updates via email** to subscribed users.

---

## Features
- **Live Data Scraping** — Pulls current flight information from PHX airport’s public data.
- **Web Interface** — Flask app with HTML/CSS front-end for easy viewing of flight details.
- **Optional Email Notifications** — Automatically sends flight updates to subscribers. ()
- **Data Formatting** — Cleans and formats scraped data for user-friendly display.
- **Customizable** — Easily update scraping targets or display styles.

---

## Technologies Used
- **Python 3**
- **Flask** — Web framework for serving data.
- **HTML / CSS** — Front-end display.
- **Requests / BeautifulSoup** — Data scraping & parsing.
- **SMTP / smtplib** — Email sending functionality.

---

## Project Structure
```
PHX-Flight-data/
│── app.py               # Main Flask application
│── scraper.py           # Logic for scraping PHX flight data
│── templates/           # HTML templates for Flask
│── static/              # CSS and static assets
│── requirements.txt     # Python dependencies
│── README.md            # Project documentation
```

---

## 🚀 Getting Started

### Clone the repository
```bash
git clone https://github.com/Americana808/PHX-Flight-data.git
cd PHX-Flight-data
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Run the application
```bash
python app.py
```
The app will start locally. Open your browser and go to:
```
http://127.0.0.1:5000
```

---

## Optional Email Notifications
- Feature is disabled by default
- Users can enable it in the code if email notifications if they want to receive scheduled flight status updates
- Configure your email server settings in `app.py` or a `.env` file.

---

## Live Demo
[mport6.pythonanywhere.com](https://mport6.pythonanywhere.com/)

## Real-world usage:
This application is actively used at my current job at a Phoenix Sky Harbor International Airport kiosk to help monitor real-time flights and provide accurate travel information to customers. The system replaces manual checks, streamlining customer service and improving efficiency.

---

## Contributing
Pull requests are welcome! If you find any bugs or want to suggest improvements, open an issue or submit a PR.

---

**Author:** [Marco Portillo](https://github.com/Americana808)  
