import React from 'react';
import ReactDOM from 'react-dom';

export { Verse, VerseProperties }


class VerseProperties {
    constructor(quote, reference) {
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
        if (!this.props.isLoaded) {
            return ""
        }

        return (
            <div id="verse">
                <div class="wrapper">
                    <div class="quote">"{this.props.quote}"</div>
                    <div class="reference">- {this.props.reference}</div>
                </div>
            </div>
        );
    }
}