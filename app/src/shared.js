import React from 'react';
import ReactDOM from 'react-dom';

const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

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

export function getDateString(date, includeYear) {
    let str = months[date.getMonth()]
    str += " "
    str += date.getDate()
    if (includeYear) {
        str += ", "
        str += date.getFullYear()
    }
    return str
}

export function evaluateIfUpdateRequired(nowTime, currentTimeOnProp, maxTimeBeforeUpdate) {
    if (currentTimeOnProp == undefined) {
        return true
    }
    return nowTime - currentTimeOnProp > maxTimeBeforeUpdate
}