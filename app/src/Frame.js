import React from 'react';
import { Extensions } from './Extensions'
import  { Settings, SettingsProperties, ClockSettings, VerseSettings, WeatherSettings, PhotosSettings  } from './Settings'
import { server } from './shared'

// Frame is the top level within the application.
// It splits into two responsibilities: Settings and Extensions.
// Extensions allows for the rendering of each feature within the page.
// Settings is the backing of a user's options for those extensions.
// Settings are passed as a property down to Extensions.
// Any settings modification requires reload of all features, so modifying the settings 
// results in a re-render of Extensions.
export class Frame extends React.Component {
    constructor() {
        super()

        let settings = new SettingsProperties()
        this.state = {
            versionSinceMount: 0,
            Settings: settings
        }
    }

    componentDidMount() {
        this.getSettings()
    }

    // settingsUpdateCallback is passed into settings and is called whenever a user saves out of the modal
    // It's important this function exists at this level so that we can update state and apply updates to extensions downstream
    // @param result {JSON} the response from the server when saving an update to settings
    settingsUpdateCallback = (result) => {
        let userSettings = this.parseSettingsResponseToObject(result)
        this.setState({
            Settings: userSettings,
            versionSinceMount: this.state.versionSinceMount + 1
        })
    }

    render() {
        if (!this.state.isLoaded) {
            return null
        }
        return(
            <div id="frame">
                <Extensions key={this.state.versionSinceMount} settings={this.state.Settings}/>
                <Settings settings={this.state.Settings} updateCallback={this.settingsUpdateCallback} />  
            </div>
        );
    }

    // parseSettingsResponseToObject takes a JSON object from the server and makes it into an expected SettingsProperties object
    // This is technically not needed due to the lack of type checking in JavaScript, but is useful as a saftey check
    // as it helps encourage explicit additions to the client when adding information to the server.
    // @param response {JSON} the settings object from the server
    // @return {SettingsProperties} the JavaScript object of the responses
    parseSettingsResponseToObject(response) {
        let settings = JSON.parse(response)

        let photoSettings = new PhotosSettings(
            settings.Photos.isEnabled,
            settings.Photos.albumSet,
            settings.Photos.apiKey,
            settings.Photos.apiSecret,
            settings.Photos.apiUser,
            settings.Photos.albumSet
        )

        let clockSettings = new ClockSettings(
            settings.Clock.isEnabled
        )

        let verseSettings = new VerseSettings(
           settings.Verse.isEnabled
        )

        let weatherSettings = new WeatherSettings(
            settings.Weather.isEnabled,
            settings.Weather.zip,
            settings.Weather.apiKey
        )

        return new SettingsProperties(
            clockSettings,
            photoSettings,
            verseSettings,
            weatherSettings
        )
    }

    // getSettings retrieves the settings data for the user
    // This is done by calling the settings REST endpoint in /server/run.py
    getSettings() {
        fetch(server + "settings")
        .then(res => res.json()) 
        .then(
            (result) => {               
                let userSettings = this.parseSettingsResponseToObject(result)

               this.setState({
                    isLoaded: true,
                    Settings: userSettings
                })
            },
            (error) => {
                console.log(error)
            }
        )
    }
}