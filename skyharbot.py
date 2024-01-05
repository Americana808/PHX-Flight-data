from selenium import webdriver
from selenium.webdriver.common.by import By
from tabulate import tabulate

# EMAIL IMPORTS
from email.message import EmailMessage
import ssl
import smtplib

from datetime import datetime

hour = datetime.now().strftime("%#I %p")

em = EmailMessage()
email_sender = ''
email_password = ''
email_receiver = ''


url = 'https://www.skyharbor.com/flights/?AD=D&search='

driver = webdriver.Chrome()
driver.get(url)
driver.implicitly_wait(2)

element_with_data_airline = driver.find_elements(by=By.XPATH, value="//tr[@data-ad='D' and @data-airline='American Airlines']")

gates = ["A22", "A24", "A25", "A26", "A27", " A28", "A29", "A30"]

flightList = []
i = 0

for element in element_with_data_airline:
    airline = element.get_attribute("data-airline")
    time = element.get_attribute("data-scheduled")
    gate = element.get_attribute("data-gate")
    estimated = element.get_attribute("data-estimated")
    city = element.get_attribute("data-city")
    if gate in gates:
        if time and time[0].isdigit():
            flightList.append([])
            flightList[i].append(city[len(city)-4:len(city)-1])
            flightList[i].append(time)
            flightList[i].append(gate)
            flightList[i].append(estimated)
            i += 1

headers = ['city', 'time', 'gate', 'actual']
table = tabulate(flightList, headers=headers, tablefmt="table")
# possibly format body to include the totals flights left and the when the last flgiht is.
body = table

em['From'] = email_sender
em['To'] = email_receiver
em['Subject'] = '{} flights'.format(hour)# !!! INSERT TIME AND DATE !!!
em.set_content(body)

context = ssl.create_default_context()
with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
    smtp.login(email_sender, email_password)
    smtp.sendmail(email_sender, email_receiver, em.as_string())