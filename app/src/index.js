import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import  { CurrentWeather, CurrentWeatherProperties } from './CurrentWeather'
import  { Clock, ClockProperties } from './Clock'
import  { Photos, PhotosProperties } from './Photos'
import { evaluateIfUpdateRequired } from './shared'


const images = require.context('../public/img/', true);


var server = "http://127.0.0.1:5000/"

class Verse extends React.Component {
    constructor() {
        super()
        this.getVerse()
        this.state = {
            isLoaded: false,
            quote: "",
            reference: ""
        }
    }


    getVerse() {
        // Fetch the verse from the server and update the state once loaded
        fetch(server + "verse")
        .then(res => res.json()) 
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    quote: result.QUOTE,
                    reference: result.REFERENCE
                });
            },
            (error) => {
                console.log(error)
            }
        )
    }

    render() {
        return (
            <div id="verse">
                <div class="wrapper">
                    <div class="quote">{this.state.isLoaded ? '"' + this.state.quote + '"' : "Loading..." }</div>
                    <div class="reference">{this.state.isLoaded ? "-" + this.state.reference : ""}</div>
                </div>
            </div>
        );
    }
}



class Weather extends React.Component {
    render () {
        return (
            <div></div>
        )
    }

    constructor() {
        super()
        
        
    }
}

// Frame is the top level element within the application.
// It has two responsibilities: to maintain each extension's state, and to implement settings/results from the server.
// By letting Frame maintain/update each extension individually, we can drive the entire app from one timer.
// This allows us to sync up updates, and also control the flow of requests better.
// Since Frame is in charge of Settings, it can also keep each extension independent of each other by keeping secret other extension's settings.
class Frame extends React.Component {
    render() {
        return (
            <div id="frame">
                <div id ="currentDetails">
                    <Clock  isLoaded={this.state.Clock.isLoaded} time={this.state.Clock.time}/>
                    <CurrentWeather isLoaded={this.state.CurrentWeather.isLoaded} humidity={this.state.CurrentWeather.humidity} sunrise={this.state.CurrentWeather.sunrise} sunset={this.state.CurrentWeather.sunset} location={this.state.CurrentWeather.location} temperature={this.state.CurrentWeather.temperature} icon={this.state.CurrentWeather.icon}/>
                </div>
                <Verse />
                <Photos photo={this.state.Photos.photo}/>
                <Weather isEnabled={true}   />
            </div>
        ); 
    }

    componentDidMount() {

        // Each second, extensions in the frame can be updated.
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

            // Clock
            let clockProps = new ClockProperties(currentTime)

            // Photos
            let photosProps = this.state.Photos
            if (evaluateIfUpdateRequired(new Date(), photosProps.timeOfInstantiation, 6000)) {
                photosProps = new PhotosProperties(this.getPhoto())
            }

            // Update renderings
            this.setState({
                Clock: clockProps,
                Photos: photosProps
            })
        }, 1000) 
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    constructor() {
        super()

        this.settings = undefined
        let defaultWeatherProps = new CurrentWeatherProperties()
        let defaultClockProps = new ClockProperties(new Date())
        let photosProps = new PhotosProperties()
        this.currentPhoto = 0
        this.currentAlbum = 0
        this.state = {
            isLoaded: false,
            photo: undefined,
            CurrentWeather: defaultWeatherProps, 
            Clock: defaultClockProps,
            Photos: photosProps
        } 
        this.getWeather(true)

        fetch(server + "settings")
        .then(res => res.json()) 
        .then(
            (result) => {               
               this.settings = JSON.parse(result)
               this.setState({
                    isLoaded: true
                })
            },
            (error) => {
                console.log(error)
            }
        )
    }

    // TODO Add empty/loading screen
    // TODO refactor this to photos.js (how should data be sent to this? util function? Photo Manager class?)
    getPhoto() {
        if(this.settings == undefined) {
            return undefined
        }
        var albums = this.settings["Photos"]["albumSet"]["albums"]
        var album = !!albums ? albums[this.currentAlbum] : undefined
        if(album == undefined) {
            this.currentAlbum = 0
            return undefined 
        }
        var photo = !!album["photos"] ? album["photos"][this.currentPhoto] : undefined
        if(photo == undefined) {
            this.currentAlbum = (this.currentAlbum + 1) % albums.length
            this.currentPhoto = 0
            return undefined
        }

        this.currentAlbum = (this.currentAlbum + 1) % albums.length
        this.currentPhoto = (this.currentPhoto + 1) % album["photos"].length
        var photo = album.path + "/" + photo.name + ".jpg"
        console.log(photo)
        return images(`./` + photo)
    }

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
                console.log(result)
                let currentWeather = new CurrentWeatherProperties(
                    result.location,
                    result.sunrise,
                    result.sunset,
                    result.currentResponse.temperature,
                    result.currentResponse.humidity,
                    result.currentResponse.iconURL,
                )
                this.setState({ CurrentWeather: currentWeather });
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
  