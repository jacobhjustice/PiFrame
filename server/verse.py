import requests, json
from bs4 import BeautifulSoup

def get():
    return scrapeBibleGateway()

def scrapeBibleGateway():
    doc = requests.get("https://www.biblegateway.com/")
    # print(doc.text)
    soup = BeautifulSoup(doc.text)
    votd = soup.findAll("div", {"class": "votd-box"})[0]
    quote = votd.findAll("p")[0].text
    reference = votd.findAll("a")[0].text
    data = {
        "QUOTE": quote,
        "REFERENCE": reference
    }
    jsonString = json.dumps(data)
    return jsonString
