# PiFrame weather.py
# Manages weather data as well as forecast for the "Weather" Extension
# Uses Open Weather API https://openweathermap.org/api
import requests, secret, settings, json

# Request URLS for weather
currentWeatherRequestURL = lambda zip, apiKey : ("http://api.openweathermap.org/data/2.5/weather?zip=%s&appid=%s&units=imperial" % (zip, apiKey))
forecastWeatherRequestURL = lambda zip, apiKey : ("api.openweathermap.org/data/2.5/forecast?zip=%s&appid=%s&units=imperial" % (zip, apiKey))
weatherIconURL = lambda iconCode : "http://openweathermap.org/img/%s/10d@2x.png" % (iconCode)

# Class to package the useful information from the weather request
class WeatherResponse:
    def __init__(self, location, currentResponse):
        self.location = location
        self.currentResponse = currentResponse

    def toJSON(self):
        return json.dumps(self, default=lambda weather: weather.__dict__)
    
# Class to package weather information about the current weather
class CurrentWeatherResponse:
    def __init__(self, iconURL, temperature, minTemperature, maxTemperature, sunset, sunrise, humidity):
        self.iconURL = iconURL
        self.temperature = temperature
        self.minTemperature = minTemperature
        self.maxTemperature = maxTemperature
        self.sunset = sunset 
        self.sunrise = sunrise
        self.humidity = humidity

def getWeather(includeForecast):
    url = currentWeatherRequestURL("36830", secret.weather_api_key)
    response = requests.get(url)
    # Make sure request was completed
    if response.status_code != 200:
        return
    
    data = response.json()

    location = data["name"]

    iconURL = weatherIconURL(data["weather"][0]["icon"])
    temperature = data["main"]["temp"]
    maxTemp = data["main"]["temp_max"]
    minTemp = data["main"]["temp_min"]
    humidity = data["main"]["humidity"]
    sunset = data["sys"]["sunset"]
    sunrise = data["sys"]["sunrise"]
    current = CurrentWeatherResponse(iconURL, temperature, minTemp, maxTemp, sunset, sunrise, humidity)
    returnObj = WeatherResponse(location, current)

    if includeForecast:
        url = forecastWeatherRequestURL("36830", secret.weather_api_key)
        response = requests.get(url)
        # If request wasn't completed, skip to end and return what we have
        if response.status_code == 200:
            print("continue")
            # Add logic to collect info for every 3 hours for current day, and then one for the next few days
            

    print(returnObj.toJSON())

getWeather(True)