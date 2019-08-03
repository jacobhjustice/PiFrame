import React from 'react';
import ReactDOM from 'react-dom';
const images = require.context('../public/img/icon', true);

export { SettingsButton, SettingsProperties, ClockSettings, VerseSettings, WeatherSettings, PhotosSettings }

class ClockSettings {
    constructor (isEnabled) {
        this.isEnabled = isEnabled
    }
}

class VerseSettings  {
    constructor (isEnabled) {
        this.isEnabled = isEnabled
    }
}

class WeatherSettings {
    constructor (isEnabled, zipcode, apiKey) {
        this.isEnabled = isEnabled
        this.zipcode = zipcode
        this.apiKey = apiKey
    }
}

class PhotosSettings {
    constructor (isEnabled, albumList, apiKey, apiSecret, apiUser) {
        this.isEnabled = isEnabled
        this.albumSet = albumList
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.apiUser = apiUser
    }
}

class SettingsProperties {
    constructor (clockSettings, photosSettings, verseSettings, weatherSettings) {
        this.clock = clockSettings
        this.photos = photosSettings
        this.verse = verseSettings
        this.weather = weatherSettings
    }
}

class SettingsButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: props.isOpen
        }
    }

    render() {
        let modal = new SettingsModal(this.props, this.state.isOpen)
        return(
            <div id="settingsButton"  onClick={this.openModal}>
                <img src={images('./settings.svg') }/>
                <div className="header">Settings</div>
                {modal.render()}
            </div>
        );
    }

    openModal = () =>{
        console.log(this)
        this.setState({
            isOpen: true
        });
    }
}

class SettingsModal extends React.Component {
    constructor(props, isOpen) {
        super(props)
        console.log(isOpen)
        this.state = {isOpen: isOpen}
    }

    render() {
        if (!this.state.isOpen) {
            return null
        }
        console.log("OPEN")

        return(
            <div id="settingsModal">

            </div>
        );
        
    }
}