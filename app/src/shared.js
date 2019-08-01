import React from 'react';
import ReactDOM from 'react-dom';

export function getDisplayTime(date, isBlinkingOnSecond) {
    if (date == undefined) {
        return 
    }
    return (
    <div>
        {((date.getHours() + 11) % 12 + 1 < 10 ? "0" : "") + ((date.getHours() + 11) % 12 + 1)}
        <div class={(isBlinkingOnSecond && date.getSeconds() % 2 == 0 ? "hidden" : "") + " inline"}>:</div>
        {(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}
        {date.getHours() >= 12 ? " PM" : " AM"}
    </div>)
}