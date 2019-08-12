import React from 'react';
import {server} from './shared'
const images = require.context('../public/img/icon', true);

// ClockSettings contains all settings for the Clock extension
// It exists as a member of the SettingsProperties class
export class ClockSettings {
    // @param isEnabled {bool} enabled status of the extension
    constructor (isEnabled) {
        this.isEnabled = isEnabled
    }
}

// VerseSettings contains all settings for the Verse extension
// It exists as a member of the SettingsProperties class
export class VerseSettings  {
    // @param isEnabled {bool} enabled status of the extension
    constructor (isEnabled) {
        this.isEnabled = isEnabled
    }
}

// WeatherSettings contains all settings for the Weather extension
// It exists as a member of the SettingsProperties class
export class WeatherSettings {
    // @param isEnabled {bool} enabled status of the extension
    // @param zip {string} the zipcode to pull weather for
    // @param apiKey {string} the key to access weather map API for the user
    constructor (isEnabled, zip, apiKey) {
        this.isEnabled = isEnabled
        this.zip = zip
        this.apiKey = apiKey
    }
}

// PhotosSettings contains all settings for the Photos extension
// It exists as a member of the SettingsProperties class
export class PhotosSettings {
    // @param isEnabled {bool} enabled status of the extension
    // @param albumList {Object} the current AlbumSet as far as settings knows (used for enabled statuses)
    // @param apiKey {string} the key to access flickr API for the user
    // @param apiSecret {string} the secret key to access flickr API for the user
    // @param apiUser {string} the account id of the user matching th egiven API key
    // @param albumSet {Object} the current list of albums as far as settings knows (used for enabled statuses)
    constructor (isEnabled, apiKey, apiSecret, apiUser, albumSet) {
        this.isEnabled = isEnabled
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.apiUser = apiUser
        this.albumSet = albumSet
    }
}

// SettingsProperties is a wrapper that contains settings for all extensions
// Any extension should exist as a property within SettingsProperties
export class SettingsProperties {
    // @param clockSettings {ClockSettings} active settings for Clock extension
    // @param photosSettings {PhotosSettings} active settings for Photos extension
    // @param verseSettings {VerseSettings} active settings for Verse extension
    // @param weatherSettings {WeatherSettings} active settings for Weather extension
    constructor (clockSettings, photosSettings, verseSettings, weatherSettings) {
        this.clock = clockSettings
        this.photos = photosSettings
        this.verse = verseSettings
        this.weather = weatherSettings
    }
}

// ModalProperties serves to transfer properties to be used in populating the SettingsModal
// Should be instantiated from the Settings level and passed into any instance of SettingsModal.
class ModalProperties {
    constructor(settingsProperties, isOpen, closeCallback, updateCallback) {
        this.settingsProperties = settingsProperties
        this.isOpen = isOpen
        this.closeCallback = closeCallback
        this.updateCallback = updateCallback
    }
}

// Settings serves as a wrapper for the SettingsModal with a button to toggle display
export class Settings extends React.Component {

    // getModalProps uses the current properties/state on the object in order to create properties for an instance of SettingsModal
    // @return {ModalProperties} the properties to be used on any active SettingsModal
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
            <div id="settings"  >
                <div id="settingsButton" className="button" onClick={this.openModal}>
                    <img src={images('./settings.svg') } alt=""/>
                    <div className="header">Settings</div>                
                </div>
                {modal.render()}
            </div>
        );
    }

    // openModal changes renders the SettingsModal by updating state
    openModal = () => {
        this.setState({
            isOpen: true
        });
    }

    // closeModal is passed into the SettingsModal to update the Settings state to close
    closeModal = () => {
        this.setState({
            isOpen: false
        })
    }
}

// SettingsModal contains all UI for the user to interact with their current settings
class SettingsModal extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isProcessing: false
        }
    }

    render() {
        if (!this.props.isOpen) {
            return null
        }

        return(
            <div id="settingsModal">

                <div className="modalContent">
                    {/* Clock Settings */}
                    <div className="extensionWrapper">
                        <div className="extensionHeader">Clock Settings</div>
                        <div className="extensionContentWrapper">
                            <label>
                                <div className="right-align">Feature Enabled</div>
                                <div className="left-align"><input type="checkbox"  defaultChecked={this.props.settingsProperties.clock.isEnabled} ref={(input) => this.clockIsEnabled = input} /></div>
                            </label>
                        </div>
                    </div> 

                    {/* Verse Settings */}
                    <div className="extensionWrapper">
                        <div className="extensionHeader">Verse Settings</div>
                        <div className="extensionContentWrapper">
                            <label>
                                <div className="right-align">Feature Enabled</div>
                                <div className="left-align"><input type="checkbox"  defaultChecked={this.props.settingsProperties.verse.isEnabled} ref={(input) => this.verseIsEnabled = input} /></div>
                            </label>
                        </div>
                    </div> 

                    {/* Weather Settings */}
                    <div className="extensionWrapper">
                        <div className="extensionHeader">Weather Settings</div>
                        <div className="extensionContentWrapper">
                            <label>
                                <div className="right-align">Feature Enabled</div>
                                <div className="left-align"><input type="checkbox" defaultChecked={this.props.settingsProperties.weather.isEnabled} ref={(input) => this.weatherIsEnabled = input} /></div>
                            </label>
                            <label>
                                <div className="right-align">Zip Code</div>
                                <div className="left-align"><input  type="number" defaultValue={this.props.settingsProperties.weather.zip}  ref={(input) => this.weatherZip = input}  /></div>
                            </label>
                            <label>
                                <div className="right-align">Weather Map API Key</div>
                                <div className="left-align"><input defaultValue={this.props.settingsProperties.weather.apiKey}  ref={(input) => this.weatherAPIKey = input}  /></div>
                            </label>
                        </div>
                    </div> 

                    {/* Photos Settings */}
                    <div className="extensionWrapper">
                        <div className="extensionHeader">Photos Settings</div>
                        <div className="extensionContentWrapper">
                            <label>
                                <div className="right-align">Feature Enabled</div>
                                <div className="left-align"><input type="checkbox" defaultChecked={this.props.settingsProperties.photos.isEnabled} ref={(input) => this.photosIsEnabled = input} /></div>
                            </label>
                            <label>
                                <div className="right-align">Flickr API Key</div>
                                <div className="left-align"><input defaultValue={this.props.settingsProperties.photos.apiKey}  ref={(input) => this.photosAPIKey = input}  /></div>
                            </label>
                            <label>
                                <div className="right-align">Flickr Secret API Key</div>
                                <div className="left-align"><input defaultValue={this.props.settingsProperties.photos.apiSecret}  ref={(input) => this.photosAPISecret = input}  /></div>
                            </label>
                            <label>
                                <div className="right-align">Flickr Account ID</div>
                                <div className="left-align"><input defaultValue={this.props.settingsProperties.photos.apiUser}  ref={(input) => this.photosAPIUser = input}  /></div>
                            </label>
                            <div className="extensionSubheader">
                                Displayed Albums
                            </div>
                            {this.getAlbumSettingsComponents()}

                        </div>
                    </div> 
                    {/* Any future extension should be added here, mimicking the format from above */}
                </div>


                <div className="buttonWrapper">
                    <div className={!this.state.isProcessing ? "" : "no-display"}>

                        <div className="button denial big" onClick={this.props.closeCallback}>
                            <div className="header">Cancel</div>               
                        </div>
                        <div className="button approval big" onClick={this.saveSettings}>
                            <div className="header">Save</div>               
                        </div>
                    </div>
                    <div className={this.state.isProcessing ? "" : "no-display"}>
                        <div className="processing">Processing...</div>
                    </div>
                </div>

            </div>
        );
    }

    // getAlbumSettingsComponents is called to create components for each album 
    // @return {Component} a toggleable setting reflecting the enabled status of an album
    getAlbumSettingsComponents() {
        let components = []
        this.props.settingsProperties.photos.albumSet.albums.forEach(album => {
            components.push(
                <label key={album.id}>
                    <div className="right-align">{album.name}</div>
                    <div className="left-align"><input type="checkbox" defaultChecked={album.isEnabled}  ref={(input) => this["album_" + album.id] = input}  /></div>
                </label>
            )
        });
        return components
    }

    // saveSettings is the function called when the save button is pressed.
    // It is responsible for converting the status of each component into a JSON payload for the server to process.
    // Once the server processes the new settings, this settings object is passed back to the Frame component via callback function
    // The save event ultimately leads to a reload of each extension. 
    saveSettings = () => {
        // Albums can be set to enabled or disabled, but are not added
        // So iterate over what we have currently, and set according to the user-inputted settings
        let newAlbumSet = this.props.settingsProperties.photos.albumSet
        newAlbumSet.albums.forEach(album => {
            let albumEnabledElement = this["album_" + album.id]
            if (albumEnabledElement !== undefined) {
                album.isEnabled = albumEnabledElement.checked
            }
        });

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
                albumSet: newAlbumSet
            }
        }

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
                this.setState({
                    isProcessing: false
                })
                this.props.updateCallback(result)
                this.props.closeCallback()
             },
             (error) => {
                 console.log(error)
                 this.setState({
                    isProcessing: false
                })
             }
         )
    }
}