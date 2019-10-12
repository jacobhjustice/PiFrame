# PiFrame verse.py
# Scrape's BibleGateway for its verse of the day for the "Verse" extension.

import requests, json
from bs4 import BeautifulSoup

def get():
    doc = requests.get("https://www.biblegateway.com/", timeout=10)
    soup = BeautifulSoup(doc.text)
    votd = soup.findAll("div", {"class": "votd-box"})[0]
    quote = votd.findAll("p")[0].text
    reference = votd.findAll("a")[0].text
    data = {
        "quote": quote,
        "reference": reference
    }
    jsonString = json.dumps(data)
    return jsonString
