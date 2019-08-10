import React from 'react';
import { getDisplayTime, getDateString } from './shared'

// ClockProperties contain backing information for the Clock component.
// Should be instantiated from the Extensions level and passed into any instance of Clock.
class ClockProperties {
    // @param isEnabled {bool} the current enabled status of this extension in settings
    // @param time {DateTime} the current time on render
    constructor(isEnabled, time) {
        this.isEnabled = isEnabled
        this.isLoaded = time !== undefined
        this.time = time
    }
}

// Clock displays information for the Clock extension.
// It should render each second within extensions with the current formatted time.
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