from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import sys
import json
# import time
# import random
# from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.chrome.options import Options


my_url = 'http://mdu.ac.in/Admin/EventPage.aspx?id=1024'
uClient = uReq(my_url)
page_html = uClient.read()
uClient.close()

page_soup = soup(page_html, "lxml")
# chrome_options = Options()
# chrome_options.add_argument('--no-sandbox')
# chrome_options.add_argument('--headless')
# driver = webdriver.Chrome(options=chrome_options)

# driver.get("http://mdu.ac.in/admin/EventPage.aspx?id=1024")
# scr1 = driver.find_element_by_class_name('dxgvCSD')
# print(scr1.text)
# for i in range(5):
#   driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", scr1)
#   time.sleep(random.randint(500, 1000)/1000)
containers = page_soup.findAll("tr", {"class":"dxgvDataRow_iOS"})
notices = []
for container in containers:
  notice = container.findAll('td')
  link = 'http://mdu.ac.in'+notice[4].a['href']
  data = {"index":int(notice[0].text),"title": notice[1].text.strip(), "date":notice[3].text, "link":link}
  notices.append(data)
print(json.dumps(notices))
sys.stdout.flush()


