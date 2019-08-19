import React from 'react';

// VerseProperties contain backing information for the Verse component.
// Should be instantiated from the Extensions level and passed into any instance of Verse.
export class VerseProperties {
    // @param isEnabled {bool} the current enabled status of this extension in settings
    // @param quote {string} the quoted verse to be primarilly displayed
    // @param reference {string} information to reference the source of quote (i.e., book chapter:verse)
    constructor(isEnabled, quote, reference) {
        this.isEnabled = isEnabled
        this.isLoaded = quote !== undefined
        if (this.isLoaded) {
            this.quote = quote
            this.reference = reference
        }
    }
}

// Verse displays information for the Verse extension.
// It should render every hour, though is only expected to change once a day.
export class Verse extends React.Component {
    render() {
        if (!this.props.isLoaded || !this.props.isEnabled) {
            return null
        }

        return (
            <div id="verse" className="extension">
                <div className="wrapper">
                    <div className="quote">"{this.props.quote}"</div>
                    <div className="reference">- {this.props.reference}</div>
                </div>
            </div>
        );
    }
}