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
        return (
            <div id="verse" class={this.props.isLoaded ? "" : "hidden"}>
                <div class="wrapper">
                    <div class="quote">"{this.props.quote}"</div>
                    <div class="reference">- {this.props.reference}</div>
                </div>
            </div>
        );
    }
}