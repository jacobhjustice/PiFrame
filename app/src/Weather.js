import React from 'react';
import ReactDOM from 'react-dom';
import { getDisplayTime, getDateString } from './shared'
const images = require.context('../public/img/icon', true);

export { CurrentWeather, CurrentWeatherProperties, WeatherForecast, WeatherForecastProperties, WeatherForecastItemProperties }

class CurrentWeatherProperties {
    constructor(isEnabled, location, sunriseEpoch, sunsetEpoch, temperature, humidity, icon) {
        this.isEnabled = isEnabled
        this.isLoaded = temperature !== undefined
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

class CurrentWeather extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.props.isLoaded || !this.props.isEnabled) {
            return ""
        }

        return (
            <div id="currentWeather" className="currentDetailsContent">
                <div className="lineWrapper">
                    <div className="header">{this.props.location}</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline" src={this.props.icon} />
                    <div className="subtitle inline">{this.props.temperature}&deg; F</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline weatherIcon" src={images(`./sunrise.png`)} />
                    <div className="subtitle2 inline">{getDisplayTime(this.props.sunrise, false)}</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline weatherIcon" src={images(`./sunset.png`)} />
                    <div className="subtitle2 inline">{getDisplayTime(this.props.sunset, false)}</div>
                </div>
                <div className="lineWrapper">
                    <img className="inline weatherIcon" src={images(`./humidity.png`)} />
                    <div className="subtitle2 inline">{this.props.humidity}%</div>
                </div>
            </div>
        );
    }
}

class WeatherForecastItemProperties {
    constructor(temperature, time, icon) {
        this.isLoaded = temperature !== undefined 
        if (this.isLoaded) {
            this.temperature = temperature
            this.icon = icon
            this.time = new Date(time*1000)
        }
    }
}

class WeatherForecastItem extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return(
            <div className="weatherForecastItem" key={this.props.time}>
                <div className="left itemWrapper">
                    <img src={this.props.icon} />
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

class WeatherForecastProperties {
    constructor (isEnabled, dailyForecasts, key) {
        this.isEnabled = isEnabled
        this.isLoaded = dailyForecasts !== undefined && dailyForecasts.length === 8
        if (this.isLoaded) {
            this.dailyForecasts = dailyForecasts
        }
    }
}

class WeatherForecast extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.props.isLoaded || !this.props.isEnabled) {
            return null
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