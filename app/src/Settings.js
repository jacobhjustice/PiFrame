import React from 'react';
import ReactDOM from 'react-dom';
import {server} from './shared'
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
    constructor (isEnabled, zip, apiKey) {
        this.isEnabled = isEnabled
        this.zip = zip
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
    constructor(settingsProperties, isOpen, closeCallback, updateCallback) {
        this.settingsProperties = settingsProperties
        this.isOpen = isOpen
        this.closeCallback = closeCallback
        this.updateCallback = updateCallback
    }
}

// TODO rename settings" and treat contents as "SettingsButton" and "SettingsModal"
class SettingsButton extends React.Component {
    getModalProps() {
        return new ModalProperties(this.props.settings, this.state.isOpen, this.closeModal, this.props.updateCallback)
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
        
        this.state = props.settingsProperties
    }

    render() {
        if (!this.props.isOpen) {
            return null
        }

        return(
            <div id="settingsModal">

                <div class="modalContent">
                    {/* Clock Settings */}
                    <div class="extensionWrapper">
                        <div class="extensionHeader">Clock Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                Feature Enabled
                                <input type="checkbox"  defaultChecked={this.props.settingsProperties.clock.isEnabled} ref={(input) => this.clockIsEnabled = input} />
                            </label>
                        </div>
                    </div> 

                    <div class="extensionWrapper">
                        <div class="extensionHeader">Verse Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                Feature Enabled
                                <input type="checkbox"  defaultChecked={this.props.settingsProperties.verse.isEnabled} ref={(input) => this.verseIsEnabled = input} />
                            </label>
                        </div>
                    </div> 

                    <div class="extensionWrapper">
                        <div class="extensionHeader">Weather Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                Feature Enabled
                                <input type="checkbox" defaultChecked={this.props.settingsProperties.weather.isEnabled} ref={(input) => this.weatherIsEnabled = input} />
                            </label>
                            <label>
                                Zip Code
                                <input  type="number" defaultValue={this.props.settingsProperties.weather.zip}  ref={(input) => this.weatherZip = input}  />
                            </label>
                            <label>
                                Weather Map API Key
                                <input defaultValue={this.props.settingsProperties.weather.apiKey}  ref={(input) => this.weatherAPIKey = input}  />
                            </label>
                        </div>
                    </div> 
                    <div class="extensionWrapper">
                        <div class="extensionHeader">Photos Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                Feature Enabled
                                <input type="checkbox" defaultChecked={this.props.settingsProperties.photos.isEnabled} ref={(input) => this.photosIsEnabled = input} />
                            </label>
                            <label>
                                Flicker API Key
                                <input defaultValue={this.props.settingsProperties.photos.apiKey}  ref={(input) => this.photosAPIKey = input}  />
                            </label>
                            <label>
                                Flicker Secret API Key
                                <input defaultValue={this.props.settingsProperties.photos.apiSecret}  ref={(input) => this.photosAPISecret = input}  />
                            </label>
                            <label>
                                Flicker Account ID
                                <input defaultValue={this.props.settingsProperties.photos.apiUser}  ref={(input) => this.photosAPIUser = input}  />
                            </label>
                            <label>
                                Displayed Albums
                                {/* TODO display albums with option to enable/disable */}
                            </label>
                        </div>
                    </div> 
                </div>


                <div class="buttonWrapper">
                    <div class ="button denial big" onClick={this.props.closeCallback}>
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
        // Any future settings should be added to this JSON payload
        // the JSON class properties should match that found in /server/extensions.py and the settings.json file
        let settings = {
            Clock: {
                isEnabled: this.clockIsEnabled.checked
            },
            Verse: {
                isEnabled: this.verseIsEnabled.checked
            },
            Weather: {
                isEnabled: this.weatherIsEnabled.checked,
                zip: this.weatherZip.value,
                apiKey: this.weatherAPIKey.value
            },
            Photos: {
                isEnabled: this.photosIsEnabled.checked,
                apiKey: this.photosAPIKey.value,
                apiSecret: this.photosAPISecret.value,
                apiUser: this.photosAPIUser.value,
                albumSet: null
            }
        }
        // TODO ADD SUPPORT FOR ALBUMS
        fetch(server + 'settings/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings)
        })
        .then(res => res.json()) 
        .then(
            (result) => {
                this.props.updateCallback(result)
                this.props.closeCallback()
             },
             (error) => {
                 console.log(error)
             }
         )
    }
}

// class SettingsModalGenericContentProperties {
//     constructor(isEnabled, name, additionalComponents) {
//         this.isEnabled = isEnabled
//         this.name = name
//         this.additionalComponents = additionalComponents
//     }
// }

// class SettingsModalGenericContent extends React.Component {
//     constructor(props) {
//         super(props)
//     }

//     render() {
//         return(

//         );
//     }
// }

// class SettingsModalWeatherContent extends React.Component {
//     constructor(props) {
//         super(props)
//     }

//     render () {
//         let content = new SettingsModalGenericContent(this.getPropsForContent())
//         return content.render();
//     }

//     getPropsForContent() {
//         return new SettingsModalGenericContentProperties(true, "Photos", this.getWeatherSpecificComponent())
//     }

//     getWeatherSpecificComponent() {
//         return(
//             <div>
//                 <input onChange={this.setState({})} />
//             </div>
//         );
//     }
// }