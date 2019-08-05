import React from 'react';
import ReactDOM from 'react-dom';

export { Photos, PhotosProperties }

class PhotosProperties {
    constructor(isEnabled, photo) {
        this.isEnabled = isEnabled
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
        if (!this.props.isLoaded || !this.props.isEnabled) {
            return null
        }

        return (
            <div id="photo">
                <div className="wrapper"><img src={this.props.photo} /></div>
            </div>
        ); 
    }
}