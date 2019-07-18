import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Timer extends React.Component {
    constructor() {
        super()
        this.state = {
            time: new Date(),
        }
        // Update the clock every second
        setInterval(() => this.setState({
            time: new Date(),
        }), 1000)
    }

    render() {
        return (
           <h2>{this.parseTime()}</h2>
        )
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

    get
}

class Frame extends React.Component {
    render() {
      return (
        <Timer/>
      );
    }
  }

ReactDOM.render(
    <Frame />,
    document.getElementById('root')
  );
  