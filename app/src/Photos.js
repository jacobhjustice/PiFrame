import React from 'react';

// ImageManager is used to manage the active picture being displayed in the Photos compontnet.
// It exists as a member of the PhotosProperties class and should retrieve an image every 6 seconds.
class ImageManager {
    // @param albumSet {AlbumSet} the current collection of pictures to render from
    constructor(albumSet) {
        if(albumSet !== undefined) {
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
            this.images = require.context('../public/img/', true);

            this.isLocked = false
        }
    }

    // Retrieve the next photo in line. Look for the next photo in the current album, but if all photos have been traversed, move to the next album (or restart with the first album)
    // Set the next photo's url to be used in the Photos component
    getPhoto() {
        if(this.isLocked) {
            return
        }

        var album =  this.albums[this.currentAlbum]

        if(album === undefined) {
            this.currentAlbum = 0
            return 
        }

        if(!album.isEnabled) {
            this.currentAlbum = (this.currentAlbum + 1) % this.albums.length
        }

        var photo = album.photos[this.currentPhoto]
        if(photo === undefined) {
            this.currentAlbum  = (this.currentAlbum + 1) % this.albums.length
            this.currentPhoto = 0
            return
        }

        if (this.currentPhoto + 1 === this.albums[this.currentAlbum].photos.length) {
            this.currentPhoto = 0
            this.currentAlbum = (this.currentAlbum + 1) % this.albums.length
        }

        this.currentPhoto = (this.currentPhoto + 1) % this.albums[this.currentAlbum].photos.length
        var image = album.path + "/" + photo.name + ".jpg"

        try {
            // Set the next image and close the gate until an update from timer
            this.current = this.images(`./` + image)
            this.isLocked = true
        }
          catch(error) {
            console.error(error);
          }
    }

    // openGate is called to let the image manager know that it can update the image
    openGate() {
        this.isLocked = false
    }
}

// PhotosProperties contain backing information for the Photos component.
// Should be instantiated from the Extensions level and passed into any instance of Photos.
export class PhotosProperties {
    // @param isEnabled {bool} the current enabled status of this extension in settings
    // @param error {string} if error is not null, then an error occurred during data retrieval    
    // @param albumSet {AlbumSet}  the current collection of pictures to be passed to the ImageManager
    // @param tick {number} the seconds since the image has been rendered (from 0 - 5)
    constructor(isEnabled, error, albumSet, tick) {
        this.isEnabled = isEnabled
        this.error = error
        this.tick = tick
        this.isLoaded = albumSet !== undefined
        if (this.isLoaded) {
            this.imageManager = new ImageManager(albumSet)
        } else {
            this.tick = 0
        }
    } 
}

// Photos displays information for the Photos extension.
// Technically, the component is rendered every second, but in practicality it is only updated every 6 seconds
export class Photos extends React.Component {
    render() {
        if(this.props.error != null) {
            return (
                <div id="photo" className="extension" >
                    <div className="wrapper"><div class="center error">{this.props.error === "UNKNOWN" ? <div>An error has occured and could not fetch images. Please make sure you are connected to the internet.</div> : <div>An error has occurred and could not fetch images. Please be sure that your API key is correct from <a href='https://www.flickr.com/services/apps/create/apply/'>Flickr</a>.</div>}</div></div>
                </div>
            )
        }

        if (!this.props.isLoaded || !this.props.isEnabled) {
            return null
        }

        if (this.props.tick === 0 || this.props.imageManager.current === undefined) {
            this.props.imageManager.getPhoto()
        } else if (this.props.tick > 0) {
            this.props.imageManager.openGate()
        }
        return (
            <div id="photo" >
                <div className="wrapper"><img src={this.props.imageManager.current} alt="Loading..." /></div>
            </div>
        ); 
    }
}