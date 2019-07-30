# PiFrame photos.py
# Downloads photos from flickr and packages them for use on the client

import settings, secret, flickrapi, requests, os, json

flickr_key = 'ea3934a32400cfc52bb32b32ba355dfc'

# AlbumSet is the top level container for the photo collection. 
class AlbumSet:
    def __init__(self):
        self.albums = []

    # addAlbum appends an album object to the list
    def addAlbum(self, album):
        self.albums.append(album)

    # toJSON converts the AlbumSet object into a JSON string
    def toJSON(self):
        return json.dumps(self, default=lambda albumset: albumset.__dict__, sort_keys=True, indent=4)

# Album stores information from the flickr website.
# It is also in charge of holding all the photos within the album
class Album:
    def __init__(self, name, id, isEnabled, path):
        self.name = name
        self.id = id
        self.isEnabled = isEnabled
        self.photos = []
        self.path = path

    # addPhoto appends a photo to the albums list of photos
    def addPhoto(self, photo):
        self.photos.append(photo)

# Photo represents a single photograph within flickr.
# Since an album holds all the shared details needed by the client, the photo only needs to store the file name.
class Photo:
    def __init__(self, name):
        self.name = name

# getAlbumsForClient calls getAlbums to package all of the photos from flickr and returns a JSON string for the client
def getAlbumsForClient(userSettings):
    # Retrieve all albums
    albums = getAlbums(userSettings)

    # Save the current album information to settings
    userSettings.setAlbums(albums)

    # Format the album JSON 
    jsonString = json.dumps(albums.toJSON())
    return jsonString

# getAlbums retrieves all albums from flickr and packages them inside of an AlbumSet
def getAlbums(userSettings):
    flickr = flickrapi.FlickrAPI(flickr_key, secret.flickr_key_secret)
    result = flickr.photosets.getList(user_id='182761952@N05', format='parsed-json')
    print(result)
    print(result['photosets'])
    print(result['photosets']['photoset'])
    jsonAlbums = result['photosets']['photoset']
    albums =  AlbumSet()
    for a in jsonAlbums:
        albumID = a['id']
        albumTitle = a['title']['_content']
        isEnabled = userSettings.isAlbumEnabled(albumID)
        pathFromImg = "flickr/%s" % (albumTitle)
        album = Album(albumTitle, albumID, isEnabled, pathFromImg)

        currentDir = os.path.dirname(__file__)
        rootDir = os.path.join(currentDir, '..')
        localAlbumURL = "%s/app/public/img/%s/" %  (rootDir, pathFromImg)

        if os.path.isdir(localAlbumURL) == False:
            os.makedirs(localAlbumURL)
        for photo in flickr.walk_set(album.id):
            photoID = photo.get('id')
            downloadURL = "http://farm%s.staticflickr.com/%s/%s_%s_b.jpg" % (photo.get('farm'), photo.get('server'), photoID, photo.get('secret'))
            localURL = localAlbumURL + photoID + ".jpg"

            r = requests.get(downloadURL)      
            print(localURL)
            image_file = open(localURL, 'wb')
            image_file.write(r.content)
            image_file.close()
        
            album.addPhoto(Photo(photoID))
        albums.addAlbum(album)
    return albums