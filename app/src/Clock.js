import React from 'react';
import ReactDOM from 'react-dom';
import { getDisplayTime, getDateString } from './shared'

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
    }

    render() {
        if (!this.props.isLoaded) {
            return null
        }

        return (
            <div id="clock" className="currentDetailsContent">
                <div className="header">
                    {getDisplayTime(this.props.time, true)}
                </div>
                <div className="subtitle">{getDateString(this.props.time, true)}</div>
            </div>
        );
    }
}