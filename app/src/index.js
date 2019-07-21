import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var server = "http://127.0.0.1:5000/"

class Timer extends React.Component {
    constructor() {
        super()
        this.state = {
            time: new Date(),
        }

        this.months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        // Update the clock every second
        setInterval(this.setState({
            time: new Date()
        }), 1000)
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
        fetch(server +"verse")
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

class Frame extends React.Component {
    render() {
        return (
            <div id="frame">
                <Timer />
                <Verse />
            </div>
        
        ); 
    }
    constructor() {
        super()
        fetch(server + "settings")
        .then(res => res.json()) 
        .then(
            (result) => {
               console.log(result)
               this.getImages()
            },
            (error) => {
                console.log(error)
            }
        )
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
  