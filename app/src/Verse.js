import React from 'react';
import ReactDOM from 'react-dom';

export { Verse, VerseProperties }


class VerseProperties {
    constructor(isEnabled, quote, reference) {
        this.isEnabled = isEnabled
        this.isLoaded = quote != undefined
        if (this.isLoaded) {
            this.quote = quote
            this.reference = reference
        }
    }
}

class Verse extends React.Component {
    constructor(props) {
        super(props)
    }

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