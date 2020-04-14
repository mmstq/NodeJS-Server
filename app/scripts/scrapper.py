from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import sys

my_url = 'http://uietmdu.com/Pages/NoticeArchived'
uClient = uReq(my_url)
page_html = uClient.read()
uClient.close()

page_soup = soup(page_html, "html.parser")
containers = page_soup.findAll("tr")
containers.pop(0)
notices = []
for container in containers:
  notice = container.findAll('th')
  link = notice[2].a['href']+''
  if '/complete/' in link:
    link = 'uietmdu.com'+link
  data = {'index':int(notice[0].text),'title': notice[2].text.strip(), 'date':notice[1].text, 'link':link}
  notices.append(data)
print(notices)
sys.stdout.flush()

