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

class ModalProperties {
    constructor(settingsProperties, isOpen, closeCallback) {
        this.settingsProperties = settingsProperties
        this.isOpen = isOpen
        this.closeCallback = closeCallback
    }
}

// TODO rename settings" and treat contents as "SettingsButton" and "SettingsModal"
class SettingsButton extends React.Component {
    getModalProps() {
        return new ModalProperties(this.props, this.state.isOpen, this.closeModal)
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: props.isOpen
        }
    }

    render() {
        let modal = new SettingsModal(this.getModalProps())
        return(
            <div id="settingsButton"  >
                <div id="buttonElement" class="button" onClick={this.openModal}>
                    <img src={images('./settings.svg') }/>
                    <div className="header">Settings</div>                
                </div>
                {modal.render()}
            </div>
        );
    }

    openModal = () => {
        this.setState({
            isOpen: true
        });
    }

    closeModal = () => {
        this.setState({
            isOpen: false
        })
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

        return(
            <div id="settingsModal">

                <div class="modalContent">
                    <SettingsModalPhotosContent/>
                </div>


                <div class="buttonWrapper">
                    <div class ="button big" onClick={this.props.closeCallback}>
                        <div className="header">Cancel</div>               
                    </div>
                    <div class ="button approval big" onClick={this.saveSettings}>
                        <div className="header">Save</div>               
                    </div>
                </div>

            </div>
        );
        
    }

    saveSettings = () => {

    }
}

class SettingsModalGenericContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div class="extensionWrapper">
                <div class="extensionHeader">LA LA LA</div>
                {/* this.props.extensionName */}
                <input type="checkbox" />
            </div> 
        );
    }
}

class SettingsModalPhotosContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render () {
        return(
            <div>
            <SettingsModalGenericContent>
            <SettingsModalGenericContent />

            </SettingsModalGenericContent>
            </div>


        );
    }
}