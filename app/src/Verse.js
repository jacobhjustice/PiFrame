import React from 'react';

class VerseProperties {
    constructor(isEnabled, quote, reference) {
        this.isEnabled = isEnabled
        this.isLoaded = quote !== undefined
        if (this.isLoaded) {
            this.quote = quote
            this.reference = reference
        }
    }
}

class Verse extends React.Component {
    render() {
        if (!this.props.isLoaded || !this.props.isEnabled) {
            return null
        }

        return (
            <div id="verse">
                <div className="wrapper">
                    <div className="quote">"{this.props.quote}"</div>
                    <div className="reference">- {this.props.reference}</div>
                </div>
            </div>
        );
    }
}

export { Verse, VerseProperties }