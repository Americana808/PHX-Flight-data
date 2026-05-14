# scrape_flights.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import json
import os

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

url = 'https://www.skyharbor.com/flights/?AD=D&search='
driver.get(url)
driver.implicitly_wait(2)

elements = driver.find_elements(by=By.XPATH, value="//tr[@data-ad='D' and @data-airline='American Airlines']")

gates = ["A22", "A24", "A25", "A26", "A27", "A28", "A29", "A30"]

flights = []
for el in elements:
    airline = el.get_attribute("data-airline")
    time = el.get_attribute("data-scheduled")
    gate = el.get_attribute("data-gate")
    estimated = el.get_attribute("data-estimated")
    city = el.get_attribute("data-city")

    flightNumber = el.get_attribute("data-flight")

    if gate in gates and time and time[0].isdigit():
        flights.append({
            "city": city[-4:-1],
            "time": time,
            "gate": gate.strip(),
            "actual": estimated,
            "flight": flightNumber.strip() if flightNumber else None,
        })

driver.quit()

# Save locally
save_path = os.path.join(os.path.dirname(__file__), "flights.json")
with open(save_path, "w") as f:
    json.dump(flights, f)
