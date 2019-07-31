import React from 'react';
import ReactDOM from 'react-dom';

export { CurrentWeather, CurrentWeatherProperties }

class CurrentWeatherProperties {
    constructor(temperature, icon) {
        this.temperature = temperature
        this.icon = icon
    }

}

class CurrentWeather extends React.Component {
    constructor(props) {
        super(props)
        // let gt = new CurrentWeatherProperties()
        // console.log(gt)
        // this.props.current = propsa
    }

    render() {
        return (
            <div id="currentWeather" class="currentDetailsContent">
                <img class="currentWeatherContents" img src={this.props.icon} />
                <div class="header currentWeatherContents">{this.props.temperature}&deg; F</div>
            </div>
        );
    }
}


