import React from 'react';
import ReactDOM from 'react-dom';

export { CurrentWeather, CurrentWeatherProperties }

class CurrentWeatherProperties {
    constructor(temperature) {
        this.temperature = temperature
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
            <div id="currentWeather">
                <h4>{this.props.temperature}</h4>
            </div>
        );
    }
}


