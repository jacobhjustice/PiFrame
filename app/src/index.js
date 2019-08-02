import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import  { CurrentWeather, CurrentWeatherProperties } from './CurrentWeather'
import  { Clock, ClockProperties } from './Clock'

import Img from 'react-image'
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

class Photo extends React.Component {
    render() {
        return (
            <div id="photo">
                <div class="wrapper"><img src={this.props.url} /></div>
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

class Frame extends React.Component {
    render() {
        return (
            <div id="frame">
                <div id ="currentDetails">
                    <Clock  isLoaded={this.state.Clock.isLoaded} time={this.state.Clock.time}/>
                    <CurrentWeather isLoaded={this.state.CurrentWeather.isLoaded} humidity={this.state.CurrentWeather.humidity} sunrise={this.state.CurrentWeather.sunrise} sunset={this.state.CurrentWeather.sunset} location={this.state.CurrentWeather.location} temperature={this.state.CurrentWeather.temperature} icon={this.state.CurrentWeather.icon}/>
                </div>
                <Verse />
                <Photo url={this.state.photo}/>
                <Weather isEnabled={true}   />
            </div>
        
        ); 
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            // TODO make so that this happens quicker on load
            this.setState({
                isLoaded: true,
                photo: this.state.isLoaded ? this.getPhoto() : undefined
            })}, 2000)
        
        this.interval = setInterval(() => {
            this.setState({
                Clock: new ClockProperties(new Date()),
            })
        }, 1000) 
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    constructor() {
        super()

        let defaultWeatherProps = new CurrentWeatherProperties()
        let defaultClockProps = new ClockProperties(new Date())

        this.currentPhoto = 0
        this.currentAlbum = 0
        this.settings = undefined
        this.state = {
            isLoaded: false,
            photo: undefined,
            CurrentWeather: defaultWeatherProps, 
            Clock: defaultClockProps,
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

    afterLoad() {
        
    }

    // TODO Add empty/loading screen
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
  