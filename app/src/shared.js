import React from 'react';
const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

// server is the root of the backing flask server
export const server = "http://127.0.0.1:5000/"

// getDisplayTime converts a DateTime object into a readable 12 hour time string
// @param date {DateTime} the time to display
// @param isBlinkingOnSecond {bool} true indicates that the time should hide the ":" on even seconds
// @param isInline {bool} true indicates the returned div has class "inline"
// @return {string} a div with content of the time formatted in "hh:mm AM/PM" format
export function getDisplayTime(date, isBlinkingOnSecond, isInline) {
    if (date === undefined) {
        return 
    }
    return (
    <div className={isInline ? "inline" : ""}>
        {((date.getHours() + 11) % 12 + 1 < 10 ? "0" : "") + ((date.getHours() + 11) % 12 + 1)}
        <div className={(isBlinkingOnSecond && date.getSeconds() % 2 === 0 ? "hidden" : "") + " inline"}>:</div>
        {(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}
        {date.getHours() >= 12 ? " PM" : " AM"}
    </div>)
}

// getDateString converts a DateTime object into a readable date string 
// @param date {DateTime} the date to parse
// @param includeYear {bool} true indicates the year should be included
// @return {string} the date in "month day{, year}" format
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