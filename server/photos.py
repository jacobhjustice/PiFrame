import secret, flickrapi, requests, os

flickr_key = 'ea3934a32400cfc52bb32b32ba355dfc'
root_dir = "/Users/jacob/Documents/Dev/PiFrame_"

class Album:
    def __init__(self, name, id):
        self.name = name
        self.id = id
        self.photos = []

    def addPhoto(self, photo):
        self.photos.append(photo)

class Photo:
    def __init__(self, name, localURL, downloadURL):
        self.name = name
        self.localURL = localURL
        self.downloadURL = downloadURL

def getAlbums():
    # FlickrAPI.photosets.
    flickr = flickrapi.FlickrAPI(flickr_key, secret.flickr_key_secret)
    result = flickr.photosets.getList(user_id='182761952@N05', format='parsed-json')
    jsonAlbums = result['photosets']['photoset']
    albums = []
    for a in jsonAlbums:
        album = Album(a['title']['_content'], a['id'])
        localAlbumURL = "%s/img/flickr/galleries/%s/" %  (root_dir, album.name)
        if os.path.isdir(localAlbumURL) == False:
            os.makedirs(localAlbumURL)
        for photo in flickr.walk_set(album.id):
            name = photo.get('title')
            downloadURL = "http://farm%s.staticflickr.com/%s/%s_%s_b.jpg" % (photo.get('farm'), photo.get('server'), photo.get('id'), photo.get('secret'))
            print(localAlbumURL)
            print(name)
            localURL = localAlbumURL + name + ".jpg"

            r = requests.get(downloadURL)      
            image_file = open(localURL, 'wb')
            image_file.write(r.content)
            image_file.close()

            album.addPhoto(Photo(name, downloadURL, localURL))
        albums.append(album)
    return albums
getAlbums()