# TODO include secret/api keys from Photos/Weather in their respective settings


# PiFrame extensions.py
# Manages active extension information for the PiFrame application.
# Any feature within the app is an extension, as it can be turned on/off, or even removed from the code base.
# No extensions should ever rely on each other, and should be self sufficient (in other words, if two extensions rely on one another, they should be grouped into one).

import enum
from abc import ABC, abstractmethod
import photos

# ExtensionSetting is an abstract class that is used as a base for every category of settings.
# Each extension should have an equivalent property of an ExtensionSetting subclass within the Settings object in /server/settings.py.
# For example, the Photos extension has a Photos property in settings, whih is of type PhotosSettings (which inherits from ExtensionSetting).
# Every ExtensionSetting instance is responsible for holding its type, its enabled status, and any specific data corresponding to that extension.
# ExtensionSetting should never be allowed to inherit from each other, as this would introduce coupling between extensions.
class ExtensionSetting(ABC):

    # type describes the sort of ExtensionSetting that the class is
    @staticmethod
    def type():
        return None
    
    # isEnabled determines if the required property isEnabled is set to True
    def isEnabled(self):
        return self.isEnabled

    # createDefault is used to create an instance of ExtensionSetting with default properties.
    # This is used if the setting has no data associated with it (i.e., first time using the application, or a new setting is used).
    # It is important each child of ExtensionSetting has its own seperate implementation to avoid over-writing all instances of ExtensionSetting
    # return :ExtensionSetting: that is created by default
    @staticmethod
    @abstractmethod
    def createDefault():
        pass

    # createFromDict is used to create an instance of ExtensionSetting persisted data from the parsed .json file
    # :data: is the dictionary of relevant data returned from settings.read()
    @staticmethod
    @abstractmethod
    def createFromDict(data):
        pass

# PhotosSettings contains all settings relevant to the Photos feature. 
# Related code and documentation can be found within /server/photos.py.
class PhotosSettings(ExtensionSetting):
    def __init__(self, isEnabled, albumSet):
        self.isEnabled = isEnabled
        self.albumSet = albumSet

    # isAlbumEnabled checks the current settings to check if a given albumID is enabled
    # Pertains to extensions.Extensions.picture
    # :albumID: the string ID that is the photos.Album.id being searched for
    def isAlbumEnabled(self, albumID):
            # If album exists in settings, return its enabled status
            for a in self.albumSet.albums:
                    if a.id == albumID:
                            return a.isEnabled

            # Return true by default if not found
            return True

    # setAlbums updates the settings to use the provided album set
    # Pertains to extensions.Extensions.picture
    # :albumSet: the current photos.AlbumSet value after any sort of data retrival from flickr
    def setAlbums(self, albumSet):
        self.albumSet = albumSet

    @staticmethod
    def type():
        return "Photos"

    @staticmethod
    def createDefault():
        return PhotosSettings(True, photos.AlbumSet())

    @staticmethod  
    def createFromDict(data):
        albums = photos.AlbumSet() # Load in base information about albums... will load photos in seperately only when needed
        for a in data["albumSet"]["albums"]:
            album = photos.Album(a["name"], a["id"], a["isEnabled"], a["path"])
            for p in a["photos"]:
                    album.addPhoto(photos.Photo(p["name"]))
            albums.addAlbum(album)
        isEnabled = data["isEnabled"]
        return PhotosSettings(isEnabled, albums)

class WeatherSettings(ExtensionSetting):
    def __init__(self, isEnabled, zipcode):
        self.isEnabled = isEnabled
        self.zip = zipcode
    
    @staticmethod
    def type():
        return "Weather"

    @staticmethod
    def createDefault():
        return WeatherSettings(True, "")
    
    @staticmethod  
    def createFromDict(data):
        isEnabled = data["isEnabled"]
        zip = data["zip"]
        return WeatherSettings(isEnabled, zip)

class VerseSettings(ExtensionSetting):
    def __init__(self, isEnabled):
        self.isEnabled = isEnabled
    
    @staticmethod
    def type():
        return "Verse"

    @staticmethod
    def createDefault():
        return VerseSettings(True)

    @staticmethod  
    def createFromDict(data):
        isEnabled = data["isEnabled"]
        return VerseSettings(isEnabled)

class ClockSettings(ExtensionSetting):
    def __init__(self, isEnabled):
        self.isEnabled = isEnabled

    @staticmethod
    def type():
        return "Clock"

    @staticmethod
    def createDefault():
        return ClockSettings(True)

    @staticmethod  
    def createFromDict(data):
        isEnabled = data["isEnabled"]
        return ClockSettings(isEnabled)