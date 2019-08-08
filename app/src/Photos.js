import React from 'react';
import ReactDOM from 'react-dom';

export { Photos, PhotosProperties }

const images = require.context('../public/img/', true);

class ImageManager {
    constructor(albumSet) {
        if(albumSet != undefined) {
            let albums = [] 
            albumSet.albums.forEach(album => {
                if (album.isEnabled && album.photos.length > 0) {
                    albums.push(album)
                }
            });
    
            this.albums = albums
            this.currentAlbum = 0
            this.currentPhoto = 0
            this.current = undefined
        }
    }

    getPhoto() {
        var album =  this.albums[this.currentAlbum]
        if(album == undefined) {
            this.currentAlbum = 0
            return undefined 
        }

        var photo = album.photos[this.currentPhoto]
        if(photo == undefined) {
            this.currentAlbum  = (this.currentAlbum + 1) % this.albums.length
            this.currentPhoto = 0
            return undefined
        }

        this.currentPhoto = (this.currentPhoto + 1) % this.albums[this.currentAlbum].photos.length
        this.currentAlbum = (this.currentAlbum + 1) % this.albums.length
        var photo = album.path + "/" + photo.name + ".jpg"

        this.current = images(`./` + photo)
    }
}

class PhotosProperties {
    constructor(isEnabled, albumSet, tick) {
        this.isEnabled = isEnabled
        this.tick = tick
        this.isLoaded = albumSet != undefined
        if (this.isLoaded) {
            this.imageManager = new ImageManager(albumSet)
        } else {
            this.tick = 0
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

        if (this.props.tick == 0 || this.props.imageManager.current == undefined) {
            this.props.imageManager.getPhoto()
        }
        return (
            <div id="photo" >
                <div className="wrapper"><img src={this.props.imageManager.current} /></div>
            </div>
        ); 
    }
}