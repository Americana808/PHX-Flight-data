import skyharbot
from datetime import datetime
import time

checkHours = ["3 PM", "5 PM"]
while True:
    currentTime = datetime.now().strftime("%#I %p")
    if currentTime in checkHours:
        skyharbot
    time.sleep(3600)