import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Timer extends React.Component {
    constructor() {
        super()
        this.state = {
            time: new Date(),
        }

        this.months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]


        // Update the clock every second
        setInterval(() => this.setState({
            time: new Date(),
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
            quote: "Humble yourselves, therefore, under the mighty hand of God, so that at the proper time he may exult you, casting all your anxieties on him because he cares for you",
            reference: "1 Peter 5: 6-7"
        }
    }

    getVerse() {
        // Server request to scrape here
        // Update State
    }


    render() {
        return (
            <div id="verse">
                <div class="wrapper">
                    <div class="quote">"{this.state.quote}"</div>
                    <div class="reference">-  {this.state.reference}</div>
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
  }

ReactDOM.render(
    <Frame />,
    document.getElementById('root')
  );
  