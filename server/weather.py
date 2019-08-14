# PiFrame weather.py
# Manages weather data as well as forecast for the "Weather" Extension
# Uses Open Weather API https://openweathermap.org/api
import requests, settings, json, datetime

# Request URLS for weather
currentWeatherRequestURL = lambda zip, apiKey : ("http://api.openweathermap.org/data/2.5/weather?zip=%s&appid=%s&units=imperial" % (zip, apiKey))
forecastWeatherRequestURL = lambda zip, apiKey : ("http://api.openweathermap.org/data/2.5/forecast?zip=%s&appid=%s&units=imperial" % (zip, apiKey))
weatherIconURL = lambda iconCode : "http://openweathermap.org/img/wn/%s@2x.png" % (iconCode)

# WeatherResponse is a serializable response containing requested weather information
class WeatherResponse:
    def __init__(self, location, sunrise, sunset, currentResponse, todayForecast, upcomingForecast):
        self.location = location
        self.sunrise = sunrise
        self.sunset = sunset
        self.currentResponse = currentResponse
        self.todaysForecast = todayForecast
        self.upcomingForecasts = upcomingForecast

    def toJSON(self):
        return json.dumps(self, default=lambda weather: weather.__dict__)
    
# WeatherResponseItem represents a single weather log
class WeatherResponseItem:
    def __init__(self, iconURL, epochTime, temperature, minTemperature, maxTemperature, humidity):
        self.iconURL = iconURL
        self.temperature = round(temperature, 0)
        self.minTemperature = round(minTemperature, 0)
        self.maxTemperature = round(maxTemperature, 0)
        self.humidity = humidity
        self.time = epochTime

# getWeatherResponseItemFromData is used to create a WeatherResponseItem object from a dictionary of weather data
# param :data: a dictionary of information from the API call
# param :timeStamp: the datetime that the weather information corresponds to
# return :WeatherResponseItem: the response item created with data
def getWeatherResponseItemFromData(data, timeStamp):
    iconURL = weatherIconURL(data["weather"][0]["icon"])
    temperature = data["main"]["temp"]
    maxTemp = data["main"]["temp_max"]
    minTemp = data["main"]["temp_min"]
    humidity = data["main"]["humidity"]
    time = int(timeStamp.timestamp())
    return WeatherResponseItem(iconURL, time, temperature, minTemp, maxTemp, humidity)

# getWeather queries the weather API for the client. By default, the current data is retrieved.
# param :includeForecast: a boolean value that indicates if forecast data should be included in the request
# return :WeatherResponse: the results of the weather query/parse
def getWeather(includeForecast, settings):
    zip = settings.zip
    apiKey = settings.apiKey
    print(apiKey)


    # If API key is not set, let the user know
    if apiKey == None or apiKey == "":
        return '{"error": "API"}'

    url = currentWeatherRequestURL(zip, apiKey)
    response = requests.get(url)

    # Make sure request was completed
    if response.status_code != 200:
        return '{"error": "REQUEST"}'
    
    data = response.json()

    location = data["name"]
    sunset = data["sys"]["sunset"]
    sunrise = data["sys"]["sunrise"]
    timeStamp = datetime.datetime.now()

    current = getWeatherResponseItemFromData(data, timeStamp)

    todayForecast = []
    upcomingForecast = []
    if includeForecast:
        url = forecastWeatherRequestURL(zip, apiKey)
        response = requests.get(url)

        # If request wasn't completed, skip to end and return what we have
        if response.status_code == 200:
            data = response.json()
            currentDay = timeStamp.day
            entriesForCurrentDay = []
            for update in data["list"]:
                dt = datetime.datetime.fromtimestamp(update["dt"])
                dataDay = dt.day
                responseItem = getWeatherResponseItemFromData(update, dt)

                # Keep a list of weather for a given day
                entriesForCurrentDay.append(responseItem)

                # Should record forecasts for the next 24 hours
                if len(todayForecast) < 8:
                    todayForecast.append(responseItem)

                # Once we move to a new day add the normalized information to our upcomingForecast list 
                # Note, only the next 4 full days are recorded, not including the current day
                if currentDay != dataDay and len(upcomingForecast) < 5:
                    if len(entriesForCurrentDay) == 8:
                        entryFromDaysForecast = parseAveragesForDaysForecast(entriesForCurrentDay)
                        upcomingForecast.append(entryFromDaysForecast)
                    entriesForCurrentDay = []
                    currentDay = dataDay

    # Return our results
    returnObj = WeatherResponse(location, sunrise, sunset, current, todayForecast, upcomingForecast)
    return returnObj.toJSON()

# parseAveragesForDaysForecast goes over all 8 weather entries for a given day and creates one entry for the full day.
# This means taking the over all max and min temperatures, as well as the average temperature and humidity
# return :WeatherResponseItem: The consolidated response item
def parseAveragesForDaysForecast(entriesForCurrentDay):
    temp = 0
    humidity = 0
    max_temp = -1000
    min_temp = 1000
    time = entriesForCurrentDay[0].time
    for entry in entriesForCurrentDay:
        temp += entry.temperature
        humidity += entry.humidity
        max_temp = entry.maxTemperature if entry.maxTemperature > max_temp else max_temp
        min_temp = entry.minTemperature if entry.minTemperature < min_temp else min_temp
    temp = temp / 8
    humidity = humidity / 8
    return WeatherResponseItem("", time, temp, min_temp, max_temp, humidity)