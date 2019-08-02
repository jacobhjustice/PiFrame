import React from 'react';
import ReactDOM from 'react-dom';
import { getDisplayTime } from './shared'



export { Clock, ClockProperties }

class ClockProperties {
    constructor(time) {
        this.isLoaded = time != undefined
        this.time = time
    }
}

class Clock extends React.Component {
    constructor(props) {
        super(props)
        this.months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }

    render() {
        return (
            <div id="clock" class="currentDetailsContent">
                <div class="header">
                    {getDisplayTime(this.props.time, true)}
                </div>
                <div class="subtitle">{this.months[this.props.time.getMonth()]} {this.props.time.getDate()}, {this.props.time.getFullYear()}</div>
            </div>
        );
    }
}