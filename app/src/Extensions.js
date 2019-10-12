import React from 'react';
import  { CurrentWeather, CurrentWeatherProperties, WeatherForecast, WeatherForecastProperties, WeatherForecastItemProperties } from './Weather'
import  { Clock, ClockProperties } from './Clock'
import  { Photos, PhotosProperties } from './Photos'
import  { Verse, VerseProperties } from './Verse'
import { server } from './shared'
import { Sync } from './Sync'

// Extensions drives each extension within the application
// It has two responsibilities: to maintain each extension's state, and to implement settings/results from the server.
// By letting Extensions maintain/update each extension individually, we can drive the entire app from one timer.
// This allows us to sync up updates, and also control the flow of requests better.
// Extensions doesn't need to worry about Settings; those are passed into it's props.
export class Extensions extends React.Component {
    componentDidMount() {
        this.frameSetup()        
    }

    // frameSetup is called if either...
    // 1) the component is mounted for the initial time
    // 2) settings were updated
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

            // Photos: Should use existing properties, but increment the timer. Every 6th second, the manager get a new photo.
            let photosProps = this.state.Photos
            photosProps.tick = (this.state.Photos.tick + 1) % 6
            
            // Run on the minute (i.e., seconds === 0)
            if (currentTime.getSeconds() === 0) {
                let fullForecastForWeather = false

                // Run on the hour (i.e., minutes === 0)
                if (currentTime.getMinutes() === 0) { 
                    fullForecastForWeather = true
                    this.getVerse()
                    
                    // Run at midnight (i.e., hours ===0)
                    if (currentTime.getHours() === 0) {
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

        this.getWeather(true)
        this.getVerse()

        // Images are not retrieved on startup since they are cached
    }

    componentDidUpdate(oldProps) {
        // If the properties get updated, we have recieved an update in settings
        // If settings are updated, we want to do a full re-render based on our new settings.
        if(oldProps.settings !== this.props.settings) {
            clearInterval(this.interval);
            this.setDefaults()
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
                <Sync updateCallback={this.syncCallback} isHidden={this.state.syncHidden} />
            </div>
        ); 
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }  

    // setDefaults sets each expected property in the state to default (empty) values
    // It is intended that these values are changed after fetching data from the server
    setDefaults() {
        let defaultCurrentWeatherProps = new CurrentWeatherProperties(this.props.settings.weather.isEnabled, null)
        let defaultForecastWeatherProps = new WeatherForecastProperties(this.props.settings.weather.isEnabled, null)
        let defaultClockProps = new ClockProperties(this.props.settings.clock.isEnabled, new Date())
        let photosProps = new PhotosProperties(this.props.settings.photos.isEnabled)
        let verseProps = new VerseProperties(this.props.settings.verse.isEnabled)
        this.currentPhoto = 0
        this.currentAlbum = 0
        this.setState({
            CurrentWeather: defaultCurrentWeatherProps, 
            WeatherForecast: defaultForecastWeatherProps,
            Clock: defaultClockProps,
            Photos: photosProps,
            Verse: verseProps,
        })
    }

    // syncCallback is passed into sync and is called when a user presses the button.
    // When called, all extensions will recieve a "Hard Reload". Some may be programmed to only update under this circumstance, such as Photos
    syncCallback = () => {
        this.setState({
            syncHidden: true
        })
        this.setDefaults()
        this.getWeather(true)
        this.getVerse()
        this.getImages()
        setTimeout(() => {
            this.setState({
                syncHidden: false
            })
        }, 5000);
    }

    constructor(props) {
        super(props)
 
        let defaultCurrentWeatherProps = new CurrentWeatherProperties(this.props.settings.weather.isEnabled, null)
        let defaultForecastWeatherProps = new WeatherForecastProperties(this.props.settings.weather.isEnabled, null)
        let defaultClockProps = new ClockProperties(this.props.settings.clock.isEnabled, new Date())
        let photosProps = new PhotosProperties(this.props.settings.photos.isEnabled, null, this.props.settings.photos.albumSet, 1)
        let verseProps = new VerseProperties(this.props.settings.verse.isEnabled)
        this.currentPhoto = 0
        this.currentAlbum = 0

        this.state = {
            CurrentWeather: defaultCurrentWeatherProps, 
            WeatherForecast: defaultForecastWeatherProps,
            Clock: defaultClockProps,
            Photos: photosProps,
            Verse: verseProps,
        }
    }

    // getImages adds photos from flickr to local storage, and returns the albumSet 
    // This is done by calling the images REST endpoint in /server/run.py
    getImages() {
        fetch(server + "images")
        .then(res => res.json()) 
        .then(
            (result) => {
                if (result.isNotEnabled) {
                    let photosProps = new PhotosProperties(false)
                    this.setState({
                        Photos: photosProps
                    })
                    return
                }

                if (result.error != null) {
                    this.setState({
                        Photos: new PhotosProperties(true, result.error)
                    })
                    return
                }

                let images = JSON.parse(result)
                let photosProps = new PhotosProperties(this.props.settings.photos.isEnabled, null, images, 1)
                this.setState({
                    Photos: photosProps
                })
            },
            (error) => {
                console.log(error)
                this.setState({
                    Photos: new PhotosProperties(true, "UNKNOWN")
                })
                return
            }
        )
    }

    // getWeather retrieves the weather data for current weather, and optionally, forecast
    // This is done by calling the weather REST endpoint in /server/run.py
    // @param includeForecast {bool} retrieve forecast in returned data (if false, should ignore any potential data in forecast fields)
    getWeather(includeForecast) {
        fetch(server + "weather/" + (includeForecast ? "1" : "0"))
            .then(res =>  res.json()) 
            .then(
                (result) => {               
                    // If not enabled, set state to default weather
                    if (result.isNotEnabled) {
                        this.setState({ 
                            CurrentWeather: new CurrentWeatherProperties(this.props.settings.weather.isEnabled),
                            WeatherForecast: new WeatherForecastProperties(this.props.settings.weather.isEnabled)
                         });
                         return 
                    }

                    if (result.error) {
                        this.setState({ 
                            CurrentWeather: new CurrentWeatherProperties(true, result.error),
                            WeatherForecast: new WeatherForecastProperties(true, result.error)
                         });
                         return 
                    }

                    let currentWeather = new CurrentWeatherProperties(
                    this.props.settings.weather.isEnabled,
                    null,
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
                    forecastWeather = new WeatherForecastProperties(this.props.settings.weather.isEnabled, null, forecasts)
                }
                this.setState({ 
                    CurrentWeather: currentWeather,
                    WeatherForecast: forecastWeather
                 });
                },
                (error) => {
                    console.log(error)
                    this.setState({ 
                        CurrentWeather: new CurrentWeatherProperties(true, "UNKNOWN"),
                        WeatherForecast: new WeatherForecastProperties(true, "UNKNOWN")
                     });
                     return 
                }
            )
    }

    // getVerse retrieves the Bible verse of the day
    // This is done by calling the verse REST endpoint in /server/run.py
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