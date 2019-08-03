import React from 'react';
import ReactDOM from 'react-dom';
const images = require.context('../public/img/icon', true);

export { SettingsButton, SettingsProperties }

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
        this.albumList = albumList
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.apiUser = apiUser
    }
}

class SettingsProperties {
    constructor (clockSettings, photosSettings, verseSettings, weatherSettings) {
        this.clockSettings = clockSettings
        this.photosSettings = photosSettings
        this.verseSettings = verseSettings
        this.weatherSettings = weatherSettings
        this.isOpen = false
    }
}

class SettingsButton extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let modal = new SettingsModal(this.props)
        return(
            <div id="settingsButton" onClick={this.openModal()}>
                <img src={images('./settings.svg') }/>
                <div className="header">Settings</div>
                {modal.render()}
            </div>
        );
    }

    openModal() {
        this.props.isOpen = true
    }
}

class SettingsModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.props.isOpen) {
            return null
        }
        
    }
}