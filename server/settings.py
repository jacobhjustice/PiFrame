# PiFrame settings.py
# Manages writing/reading the .json file backing user settings for the app.
# This informs the application of user settings for enabled extensions, and further settings and persisted data used by extensions

import extensions, photos
import json

# FILE_NAME is the name of the .json file in charge of storing settings
FILE_NAME = "settings.json"

# Settings is the state of the current user's settings within the application
class Settings:
        # Can either append settings directly here, or keep the structure from classes within the appropriate extension
        def __init__(self, extensions, albumSet):
                self.extensions = extensions
                self.albums = albumSet.albums

        # toJSON returns the JSON output to write to the .json file
        def toJSON(self):
                jsonStr = json.dumps(self, default=lambda settings: settings.__dict__, ensure_ascii=False, indent=4)
                return jsonStr

        # isAlbumEnabled checks the current settings to check if a given albumID is enabled
        # Pertains to extensions.Extensions.picture
        def isAlbumEnabled(self, albumID):
                # If album exists in settings, return its enabled status
                for a in self.albums:
                        if a.id == albumID:
                                return a.isEnabled

                # Return true by default if not found
                return True

        # setAlbums updates the settings to use the provided album set
        # Pertains to extensions.Extensions.picture
        def setAlbums(self, albumSet):
                self.albums = albumSet.albums
                self.write()

        # __write serves as a utility for writing information into the .json file
        # This should never be exposed outside of the settings module.
        # Instead, it should be called internally when a change was made to the data variable.
        # The JSON value of data is saved by __write
        def write(self):
                with open(FILE_NAME, 'w') as f:
                        settings = self.toJSON()
                        f.write(settings)

# read serves as a utility for reading information from the .json file into the application.
# This should only be called on startup, since at any other point, since the application should maintain the valid state of the settings.
# If no file can be found, __initialSetup should be called to set the default settings
def read():
    try:
        with open(FILE_NAME, 'r') as f:
            jsonValue = json.load(f)
            extensions = jsonValue["extensions"]
            albums = photos.AlbumSet() # Load in base information about albums... will load photos in seperately only when needed
            for a in jsonValue["albums"]:
                album = photos.Album(a["name"], a["id"], a["isEnabled"], a["path"])
                for p in a["photos"]:
                        album.addPhoto(photos.Photo(p["name"]))
                albums.addAlbum(album)
            return Settings(extensions, albums)
    except IOError:
        return __initialSetup()

# __initialSetup is called if the .json file does not exist.
# It sets up the .json file with default values for all expected data.
def __initialSetup():
    data = {}

    # By default, enable all installed extensions
    extensionValue = 0
    for ex in extensions.Extensions:
        extensionValue += ex.value

    # Add code here to enable defaults for each extension
    albums = photos.AlbumSet()

    # Write to the .json file, and return our json object
    data = Settings(extensionValue, albums)
    data.write()
    return data