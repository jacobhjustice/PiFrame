import React from 'react';
import ReactDOM from 'react-dom';
import { getDisplayTime } from './shared'
const images = require.context('../public/img/icon', true);

export { CurrentWeather, CurrentWeatherProperties, WeatherForecast, WeatherForecastProperties }

class CurrentWeatherProperties {
    constructor(location, sunriseEpoch, sunsetEpoch, temperature, humidity, icon) {
        this.isLoaded = temperature != undefined
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
        return (
            <div id="currentWeather" class={(this.props.isLoaded ? "" : "hidden") + " currentDetailsContent"}>
                <div class="lineWrapper">
                    <div class ="header">{this.props.location}</div>
                </div>
                <div class="lineWrapper">
                    <img class="inline" src={this.props.icon} />
                    <div class="subtitle inline">{this.props.temperature}&deg; F</div>
                </div>
                <div class="lineWrapper">
                    <img class ="inline weatherIcon" src={images(`./sunrise.png`)} />
                    <div class="subtitle2 inline">{getDisplayTime(this.props.sunrise, false)}</div>
                </div>
                <div class="lineWrapper">
                    <img class ="inline weatherIcon" src={images(`./sunset.png`)} />
                    <div class="subtitle2 inline">{getDisplayTime(this.props.sunset, false)}</div>
                </div>
                <div class="lineWrapper">
                    <img class ="inline weatherIcon" src={images(`./humidity.png`)} />
                    <div class="subtitle2 inline">{this.props.humidity}%</div>
                </div>
            </div>
        );
    }
}

class WeatherForecastItemProperties {
    constructor(temperature, time, humidity, icon) {
        this.isLoaded = temperature != undefined 
        if (this.isLoaded) {
            this.temperature = temperature
        }
    }
}

class WeatherForecastItem  extends  React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return(
            <div class="weatherForecastItem">
                <div class="left itemWrapper">
                    {/* <img src={this.props.icon} /> */}
                </div>
                <div class="right itemWrapper">
                    {this.props.temperature}
                </div> 
            </div>
        );
    }
}

class WeatherForecastProperties {
    constructor (dailyForecasts) {
        this.isLoaded = dailyForecasts != undefined && dailyForecasts.length == 8
        if (this.isLoaded) {
            // TODO make this of type
            this.dailyForecasts = dailyForecasts
        }
    }
}

class WeatherForecast extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let forecasts = []
        for(var i = 0; i <8; i++){
            let props = new WeatherForecastItemProperties(123)
            let item = new WeatherForecastItem(props)
            forecasts.push(item.render())
        }

        return(
            <div id="weatherForecast">
                {forecasts}
            </div>
        );

    }
}