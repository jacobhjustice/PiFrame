import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import  { CurrentWeather, CurrentWeatherProperties, WeatherForecast, WeatherForecastProperties, WeatherForecastItemProperties } from './Weather'
import  { Clock, ClockProperties } from './Clock'
import  { Photos, PhotosProperties } from './Photos'
import  { Verse, VerseProperties } from './Verse'
import  { SettingsButton, SettingsProperties, ClockSettings, VerseSettings, WeatherSettings, PhotosSettings  } from './Settings'
import { evaluateIfUpdateRequired, server } from './shared'


const images = require.context('../public/img/', true);

// Extensions drives each extension within the application
// It has two responsibilities: to maintain each extension's state, and to implement settings/results from the server.
// By letting Extensions maintain/update each extension individually, we can drive the entire app from one timer.
// This allows us to sync up updates, and also control the flow of requests better.
// Extensions doesn't need to worry about Settings; those are passed into it's props.
class Extensions extends React.Component {
    componentDidMount() {
        this.frameSetup()        
    }

    frameSetup() {
        // Each second, each extension can be updated.
        // This global timer drives all events that happen, whether ever second, hour, or day.
        // There are two options that can be used to update:
        // 1) Use some "lastUpdated" value within an extension's properties.
        //    This could be a time checked against the current time. 
        //    If a sufficient amount of time has passed, then update the extension accordingly.
        // 2) Update the extension at a given time.
        //    This could be each second update, on the minute, at midnight, etc.
        // Either option is equally viable, and really depends on the extension that is being used.
        // State should only be set once at the end of this intereval block.
        // If properties are being update, set the new properties, otherwise use the current ones
        this.interval = setInterval(() => {
            let currentTime = new Date()

            // Clock: Every second
            let clockProps = new ClockProperties(this.props.settings.clock.isEnabled, currentTime)

            // Photos: Every 6 seconds
            let photosProps = this.state.Photos
            if (evaluateIfUpdateRequired(new Date(), photosProps.timeOfInstantiation, 6000)) {
                photosProps = new PhotosProperties(this.props.settings.photos.isEnabled, this.getPhoto())
            }
            
            // Run on the minute (i.e., seconds == 0)
            if (currentTime.getSeconds() == 0) {
                let fullForecastForWeather = false

                // Run on the hour (i.e., minutes == 0)
                if (currentTime.getMinutes() == 0) { 
                    fullForecastForWeather = true
                    this.getVerse()
                    
                    // Run at midnight (i.e., hours ==0)
                    if (currentTime.getHours() == 0) {
                        this.getImages()
                    }
                }
                this.getWeather(fullForecastForWeather)
            }

            // Update renderings
            this.setState({
                Clock: clockProps,
                Photos: photosProps
            })
        }, 1000) 

        // TODO fetch photos?
        this.getWeather(true)
        this.getVerse()
    }


    // If the properties get updated, we have recieved an update in settings
    // If settings are updated, we want to do a full re-render based on our new settings.
    componentDidUpdate(oldProps) {
        if(oldProps.settings !== this.props.settings) {
            clearInterval(this.interval);
            this.frameSetup()
        }
    }

    render() {
        let currentWeather = new CurrentWeather(this.state.CurrentWeather)
        let weatherForecast = new WeatherForecast(this.state.WeatherForecast)
        let photos = new Photos(this.state.Photos)
        let verse = new Verse(this.state.Verse)
        let clock = new Clock(this.state.Clock)

        return (
            <div id="extensions">
                <div id ="currentDetails">
                    {clock.render()}
                    {currentWeather.render()}
                </div>
                {verse.render()}
                {photos.render()}
                {weatherForecast.render()}
            </div>
        ); 
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }  

    constructor(props) {
        super(props)

        let defaultCurrentWeatherProps = new CurrentWeatherProperties(this.props.settings.weather.isEnabled)
        let defaultForecastWeatherProps = new WeatherForecastProperties(this.props.settings.weather.isEnabled)
        let defaultClockProps = new ClockProperties(this.props.settings.clock.isEnabled, new Date())
        let photosProps = new PhotosProperties(this.props.settings.photos.isEnabled)
        let verseProps = new VerseProperties(this.props.settings.verse.isEnabled)
        this.currentPhoto = 0
        this.currentAlbum = 0
        this.state = {
            photo: undefined,
            CurrentWeather: defaultCurrentWeatherProps, 
            WeatherForecast: defaultForecastWeatherProps,
            Clock: defaultClockProps,
            Photos: photosProps,
            Verse: verseProps,
        } 
    }

    // TODO Add empty/loading screen
    // TODO refactor this to photos.js (how should data be sent to this? util function? Photo Manager class?)
    getPhoto() {
        let settings = this.props.settings
        if(settings == undefined || settings.photos == undefined) {
            return undefined
        }
        var albums = settings["photos"]["albumSet"]["albums"]
        var album = !!albums ? albums[this.currentAlbum] : undefined
        if(album == undefined) {
            this.currentAlbum = 0
            return undefined 
        }

        if(!album.isEnabled) {
            this.currentAlbum = (this.currentAlbum + 1) % albums.length
            return undefined
        }

        var photo = !!album["photos"] ? album["photos"][this.currentPhoto] : undefined
        if(photo == undefined) {
            this.currentAlbum  = (this.currentAlbum + 1) % albums.length
            this.currentPhoto = 0
            return undefined
        }

        this.currentAlbum = (this.currentAlbum + 1) % albums.length
        this.currentPhoto = (this.currentPhoto + 1) % album["photos"].length
        var photo = album.path + "/" + photo.name + ".jpg"

        return images(`./` + photo)
    }

    // TODO call getImages periodically?
    getImages() {
        fetch(server + "images")
        .then(res => res.json()) 
        .then(
            (result) => {
               console.log(result)
            },
            (error) => {
                console.log(error)
            }
        )
    }

    getWeather(includeForecast) {
        fetch(server + "weather/" + (includeForecast ? "1" : "0"))
            .then(res => res.json()) 
            .then(
                (result) => {               
                    // If not enabled, set state to default weather
                    if (result.isNotEnabled) {
                        this.setState({ 
                            CurrentWeather: new CurrentWeatherProperties(this.props.settings.weather.isEnabled),
                            WeatherForecast: new WeatherForecastItemProperties(this.props.settings.weather.isEnabled)
                         });
                         return 
                    }

                    let currentWeather = new CurrentWeatherProperties(
                    this.props.settings.weather.isEnabled,
                    result.location,
                    result.sunrise,
                    result.sunset,
                    result.currentResponse.temperature,
                    result.currentResponse.humidity,
                    result.currentResponse.iconURL,
                )
                let forecastWeather = this.state.WeatherForecast
                if (includeForecast) {
                   let  forecasts = []
                    result.todaysForecast.forEach((data) => {
                        forecasts.push(new WeatherForecastItemProperties(data.temperature, data.time, data.iconURL))
                    })
                    // TODO add daily forecast
                    forecastWeather = new WeatherForecastProperties(this.props.settings.weather.isEnabled, forecasts)
                }
                this.setState({ 
                    CurrentWeather: currentWeather,
                    WeatherForecast: forecastWeather
                 });
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    getVerse() {
        fetch(server + "verse")
        .then(res => res.json()) 
        .then(
            (result) => {
                // If not enabled, set state to default verse
                if (result.isNotEnabled) {
                    this.setState({ 
                        Verse: new VerseProperties(this.props.settings.verse.isEnabled),
                    });
                    return
                }
                  
                let verse = new VerseProperties(
                    this.props.settings.verse.isEnabled,
                    result.quote,
                    result.reference
                )
                this.setState({ Verse: verse })
            },
            (error) => {
                console.log(error)
            }
        )
    }
  }

// Frame is the top level within the application.
// It splits into two responsibilities: Settings and Extensions.
// Extensions allows for the rendering of each feature within the page.
// Settings is the backing of a user's options for those extensions.
// Settings are passed as a property down to Extensions.
// Any settings modification requires reload of all features, so modifying the settings 
// results in a re-render of Extensions.
class Frame extends React.Component {
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

    settingsUpdateCallback = (result) => {
        let userSettings = this.parseSettingsResponseToObject(result)
        this.setState({
            Settings: userSettings,
            versionSinceMount: this.state.versionSinceMount++
        })
    }

    render() {
        if (!this.state.isLoaded) {
            return null
        }
        return(
            <div id="frame">
                <Extensions key={this.state.versionSinceMount} settings={this.state.Settings}/>
                <SettingsButton settings={this.state.Settings} updateCallback={this.settingsUpdateCallback} />  
            </div>
        );
    }

    parseSettingsResponseToObject(response) {
        let settings = JSON.parse(response)

        // TODO strong type the albumSet
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

ReactDOM.render(
    <Frame />,
    document.getElementById('root')
);
  