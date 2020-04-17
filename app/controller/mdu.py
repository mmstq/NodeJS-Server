from bs4 import BeautifulSoup as soup
import sys
import json
import time
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


chrome_options = Options()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--headless')
driver = webdriver.Chrome(options=chrome_options)

driver.get('http://mdu.ac.in/Admin/EventPage.aspx?id=1024')
scr1 = driver.find_element_by_xpath('/html/body/div[2]/form/div[7]/div[2]/div[2]/div[2]/table/tbody/tr/td/div[4]')
driver.execute_script("arguments[0].scrollIntoView(true);", scr1)
time.sleep(0.5)
for i in range(5):
  driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", scr1)
  time.sleep(0.7)

page_soup = soup(driver.page_source, "html.parser")

containers = page_soup.findAll("tr", {"class":"dxgvDataRow_iOS"})
notices = []

for container in containers:
  notice = container.findAll('td')
  link=''
  if notice[4].a.has_attr('href'):
    link = 'http://mdu.ac.in'+notice[4].a['href']
  data = {"index":int(notice[0].text),"title": notice[1].text.strip(), "date":notice[3].text, "link":link}
  notices.append(data)
print(json.dumps(notices))
sys.stdout.flush()


