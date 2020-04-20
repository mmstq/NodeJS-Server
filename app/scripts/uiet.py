from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import sys
import json

my_url = 'http://uietmdu.com/Pages/NoticeArchived'
uClient = uReq(my_url)
page_html = uClient.read()
uClient.close()

page_soup = soup(page_html, "html.parser")
containers = page_soup.findAll("tr")
containers.pop(0)
notices = []
for i in range(30):
  notice = containers[i].findAll('th')
  link = notice[2].a['href']+''
  if '/complete/' in link:
    address = link.split('/')
    link = 'http://uietmdu.com/Files/'+address[2]+'.pdf'
  data = {"index":int(notice[0].text),"title": notice[2].text.strip(), "date":notice[1].text, "link":link.strip()}
  notices.append(data)
print(json.dumps(notices))
sys.stdout.flush()
