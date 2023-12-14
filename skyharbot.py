from bs4 import BeautifulSoup
from selenium import webdriver 
from selenium.webdriver.chrome.service import Service as ChromeService 
from webdriver_manager.chrome import ChromeDriverManager 

def get_AA_flights():
    flightURL = 'https://www.skyharbor.com/flights/?AD=A&search='
    driver = webdriver.Chrome()
    driver.get(flightURL)
    content = driver.page_source.encode('utf-8').strip()
    flightSoup = BeautifulSoup(content,'lxml')
    info = flightSoup.findAll("tr", class_="filter-item")
    flightInfo = info[0].text.strip()
    print(flightInfo)
    """
    for infor in info:
        print(infor.text.strip())
    """


get_AA_flights()