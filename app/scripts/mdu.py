from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import sys
import json

my_url = 'http://mdu.ac.in/Admin/EventPage.aspx?id=1024'
uClient = uReq(my_url)
page_html = uClient.read()
uClient.close()

page_soup = soup(page_html, "html.parser")
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
