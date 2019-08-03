import React from 'react';
import ReactDOM from 'react-dom';

export { Photos, PhotosProperties }

class PhotosProperties {
    constructor(photo) {
        this.isLoaded = photo != undefined
        if (this.isLoaded) {
            this.timeOfInstantiation = new Date()
            this.photo = photo
        }
    } 
}

class Photos extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.props.isLoaded) {
            return null
        }

        return (
            <div id="photo">
                <div className="wrapper"><img src={this.props.photo} /></div>
            </div>
        ); 
    }
}