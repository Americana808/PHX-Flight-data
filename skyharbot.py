from selenium import webdriver
from selenium.webdriver.common.by import By

url = 'https://www.skyharbor.com/flights/?AD=D&search='

driver = webdriver.Chrome()
driver.get(url)
driver.implicitly_wait(0.5)

element_with_data_airline = driver.find_elements(by=By.XPATH, value="//tr[@data-ad='D' and @data-airline='American Airlines']")

gates = ["A22", "A24", "A25", "A26", "A27", " A28", "A29", "A30"]

for element in element_with_data_airline:
    airline = element.get_attribute("data-airline")
    time = element.get_attribute("data-scheduled")
    gate = element.get_attribute("data-gate")
    estimated = element.get_attribute("data-estimated")
    city = element.get_attribute("data-city")
    if gate in gates:
        if time and time[0].isdigit():
            print("Data-airline attribute value:", city, time, gate, estimated)
    ###print("Data-airline attribute value:", city, time, gate, estimated)

