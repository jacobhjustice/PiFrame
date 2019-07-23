import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Img from 'react-image'
const images = require.context('../public/img/', true);


var server = "http://127.0.0.1:5000/"

class Timer extends React.Component {
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: new Date() }), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    constructor() {
        super()
        this.state = {
            time: new Date(),
        }

        this.months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }

    render() {
        return (
            <div id="clock">
                <div class="header">{this.parseTime()}</div>
                <div class="subtitle">{this.months[this.state.time.getMonth()]} {this.state.time.getDate()}, {this.state.time.getFullYear()}</div>
            </div>
        );
    }

    parseTime() {
        var time = this.state.time
        var isPM = time.getHours() >= 12
        var hours =  (time.getHours() + 11) % 12 + 1
        var minutes = time.getMinutes()

        return  (hours < 10 ? "0" : "") + hours  
        + ":" + (minutes < 10 ? "0" : "") + minutes 
        + " " + (isPM ? "PM" : "AM")
    }
}

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

class Frame extends React.Component {
    render() {
        return (
            <div id="frame">
                <Timer />
                <Verse />
                <Photo url={this.state.photo}/>
            </div>
        
        ); 
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            // TODO make so that this happens quicker on load
            this.setState({
                isLoaded: true,
                photo: this.state.isLoaded ? this.getPhoto() : undefined
            })}, 6000)
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    constructor() {
        super()

        this.currentPhoto = 0
        this.currentAlbum = 0
        this.settings = undefined
        this.state = {
            isLoaded: false,
            photo: undefined
        } 

        fetch(server + "settings")
        .then(res => res.json()) 
        .then(
            (result) => {               
               this.settings = JSON.parse(result)
                this.state = {
                    isLoaded: true,
                } 
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
        var album = !!this.settings["albums"] ? this.settings["albums"][this.currentAlbum] : undefined
        if(album == undefined) {
            return undefined 
        }
        var photo = !!album["photos"] ? album["photos"][this.currentPhoto] : undefined
        if(photo == undefined) {
            return undefined
        }

        this.currentAlbum = (this.currentAlbum + 1) % this.settings["albums"].length
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
  }

ReactDOM.render(
    <Frame />,
    document.getElementById('root')
  );
  