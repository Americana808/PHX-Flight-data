from selenium import webdriver
from selenium.webdriver.common.by import By

url = 'https://www.skyharbor.com/flights/?AD=D&search='

driver = webdriver.Chrome()
driver.get(url)
driver.implicitly_wait(0.5)
'''
//*[@id="flight-grid"]/tbody/tr
//*[@id="flight-grid"]/tbody/tr/td[1]
//*[@id="flight-grid"]/tbody/tr/td[4]
//*[@id="flight-grid"]/tbody/tr/td[6]
'''
element_with_data_airline = driver.find_elements(by=By.XPATH, value="//tr[@data-ad='D' and @data-airline='American Airlines']")

# Get the value of the data-airline attribute
#airline = element_with_data_airline.get_attribute("data-airline")
#time = element_with_data_airline.get_attribute("data-scheduled")

for element in element_with_data_airline:
    airline = element.get_attribute("data-airline")
    time = element.get_attribute("data-scheduled")
    gate = element.get_attribute("data-gate")
    estimated = element.get_attribute("data-estimated")
    print("Data-airline attribute value:", airline, time, gate, estimated)

# Print the value
#print("Data-airline attribute value:", airline, time)
'''
driver = webdriver.Chrome()

driver.get("https://www.selenium.dev/selenium/web/web-form.html")

title = driver.title

driver.implicitly_wait(0.5)

text_box = driver.find_element(by=By.NAME, value="my-text")
submit_button = driver.find_element(by=By.CSS_SELECTOR, value="button")

text_box.send_keys("Selenium")
submit_button.click()

message = driver.find_element(by=By.ID, value="message")
text = message.text

driver.quit()
'''