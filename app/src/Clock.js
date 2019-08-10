import React from 'react';
import { getDisplayTime, getDateString } from './shared'

class ClockProperties {
    constructor(isEnabled, time) {
        this.isEnabled = isEnabled
        this.isLoaded = time !== undefined
        this.time = time
    }
}

class Clock extends React.Component {
    render() {
        if (!this.props.isLoaded || !this.props.isEnabled) {
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

export { Clock, ClockProperties }