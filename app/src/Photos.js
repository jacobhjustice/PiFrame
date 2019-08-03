import React from 'react';
import ReactDOM from 'react-dom';
import Img from 'react-image'

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
        return (
            <div id="photo">
                <div class="wrapper"><img src={this.props.photo} /></div>
            </div>
        ); 
    }
}