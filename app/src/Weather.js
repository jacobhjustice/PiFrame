import React from 'react';
import { getDisplayTime, getDateString } from './shared'
const images = require.context('../public/img/icon', true);

// CurrentWeatherProperties contain backing information for the CurrentWeather component.
// Should be instantiated from the Extensions level and passed into any instance of CurrentWeather.
export class CurrentWeatherProperties {
    // @param isEnabled {bool} the current enabled status of this extension in settings
    // @param error {string} if error is not null, then an error occurred during data retrieval
    // @param location {string} the location (city) corresponding to the zip-code stored in settings for weather
    // @param sunriseEpoch {number} estimated value of the current day's sunrise in seconds with 0 being the epoch value
    // @param sunriseEpoch {number} estimated value of the current day's sunset in seconds with 0 being the epoch value
    // @param temperature {number} current temperature value in farenheit
    // @param humidity {number} current percentage of humidity in the air
    // @param icon {string} URL of the icon that represents the current weather
    constructor(isEnabled, error, location, sunriseEpoch, sunsetEpoch, temperature, humidity, icon) {
        this.isEnabled = isEnabled
        this.error = error
        this.isLoaded = this.error != null || temperature !== undefined
        if (this.isLoaded) {
            this.location = location
            this.sunrise = new Date(sunriseEpoch*1000)
            this.sunset = new Date(sunsetEpoch*1000)
            this.temperature = temperature
            this.humidity = humidity
            this.icon = icon
        }
    }
}

// CurrentWeather displays information for the current section of the Weather extension.
// It should render each minute within extensions with data for the current weather.
export class CurrentWeather extends React.Component {
    render() {
        if (!this.props.isLoaded || !this.props.isEnabled  || this.props.error != null) {
            return null
        }

        return (
            <div id="currentWeather" className="currentDetailsContent">
                <div className="lineWrapper">
                    <div className="header">{this.props.location}</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline" src={this.props.icon} alt="" />
                    <div className="subtitle inline">{this.props.temperature}&deg; F</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline weatherIcon" src={images(`./sunrise.png`)} alt="Sunrise" />
                    <div className="subtitle2 inline">{getDisplayTime(this.props.sunrise, false)}</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline weatherIcon" src={images(`./sunset.png`)} alt="Sunset" />
                    <div className="subtitle2 inline">{getDisplayTime(this.props.sunset, false)}</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline weatherIcon" src={images(`./humidity.png`)} alt="Humidity" />
                    <div className="subtitle2 inline">{this.props.humidity}%</div>
                </div>
            </div>
        );
    }
}

// WeatherForecastItemProperties contain information for each individual WeatherForecastItem
// Should be instantiated from the Extensions level and used to create WetherForecastItems for the WeatherForecastProperties
export class WeatherForecastItemProperties {
    // @param temperature {number} estimated target temperature value in farenheit
    // @param timeEpoch {number} The gien time of this forecast in seconds with 0 being the epoch value
    // @param icon {string} URL of the icon that represents the target weather
    constructor(temperature, timeEpoch, icon) {
        this.isLoaded = temperature !== undefined 
        if (this.isLoaded) {
            this.temperature = temperature
            this.icon = icon
            this.time = new Date(timeEpoch*1000)
        }
    }
}

// WeatherForecastItem displays information for an individual forecast within the upcoming section of the Weather extension.
// It should render within the rendering of WeatherForecast
class WeatherForecastItem extends React.Component {
    render() {
        return(
            <div className="weatherForecastItem" key={this.props.time}>
                <div className="left itemWrapper">
                    <img src={this.props.icon} alt="" />
                </div>
                <div className="right itemWrapper">
                    {getDisplayTime(this.props.time, false)}
                    {getDateString(this.props.time, false)}
                    <div className="header"> {this.props.temperature}&deg; F</div>                    
                </div> 
            </div>
        );
    }
}

// WeatherForecastProperties contain backing information for the WeatherForecast component.
// Should be instantiated from the Extensions level and passed into any instance of WeatherForecast.
export class WeatherForecastProperties {
    // @param isEnabled {bool} the current enabled status of this extension in settings
    // @param error {string} if error is not null, then an error occurred during data retrieval    
    // @param dailyForecasts {array[WeatherForecastItemProperties]} list of all properties used to render each WeatherForecastItem
    constructor (isEnabled, error, dailyForecasts) {
        this.isEnabled = isEnabled
        this.error = error
        this.isLoaded = this.error != null || (dailyForecasts !== undefined && dailyForecasts.length === 8)
        if (this.isLoaded) {
            this.dailyForecasts = dailyForecasts
        }
    }
}

// WeatherForecast displays information for the upcoming section of the Weather extension.
// It should render each hour within extensions with expected data for the upcoming weather.
export class WeatherForecast extends React.Component {
    render() {
        if (!this.props.isLoaded || !this.props.isEnabled) {
            return null
        }

        if (this.props.error != null) {
            return (
                <div id="weatherForecast">
                    <div class="center error">{this.props.error === "UNKNOWN" ? <div>An error has occured and could not fetch weather. Please make sure you are connected to the internet.</div> : <div>An error has occurred and could not fetch weather. Please be sure that your API key is correct from <a href='https://openweathermap.org'>the weather service</a>.</div>}</div>
                </div>
            )
        }
        let forecasts = []
        this.props.dailyForecasts.forEach((forecast) => {
            let item = new WeatherForecastItem(forecast)
            forecasts.push(item.render())
        })

        return(
            <div id="weatherForecast">
                {forecasts}
            </div>
        );
    }
}