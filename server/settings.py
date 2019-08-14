# PiFrame settings.py
# Manages writing/reading the .json file backing user settings for the app.
# This informs the application of user settings for enabled extensions, and further settings and persisted data used by extensions

import extensions
import json

# FILE_NAME is the name of the .json file in charge of storing settings
FILE_NAME = "settings.json"

# ALL_EXTENSIONS is a collection of all extensions.ExtensionSetting subclasses that currently exist. 
# Any new extensions should be appended to this array.
ALL_EXTENSIONS = [
        extensions.PhotosSettings,
        extensions.WeatherSettings,
        extensions.VerseSettings,
        extensions.ClockSettings
]

# Settings is the state of the current user's settings within the application
class Settings:
        # New settings should have their ExtensionSetting class added to the parameter and instantiated within __init__
        # Note that each property should have the same name as the map key (i.e., self.Photos = exts["Photos"])
        # :exts: is a map of ExtensionSetting.type() to ExtensionSetting
        # :isInitial: is a boolean value to represent if the Settings are created from a default (initial) creation
        def __init__(self, exts, isInitial):
                self.Photos = exts["Photos"]
                self.Weather = exts["Weather"]
                self.Verse = exts["Verse"]
                self.Clock = exts["Clock"]
                self.isInitial = isInitial

        # toJSON returns the JSON output to write to the .json file
        def toJSON(self):
                jsonStr = json.dumps(self, default=lambda settings: settings.__dict__, ensure_ascii=False, indent=4)
                return jsonStr

        # write serves as a utility for writing information into the .json file.
        # This should be called after any sort of change to settings data is made.
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
            return parseSettingsJSON(jsonValue)
    except IOError:
        return __initialSetup()

# update takes a user's settings and applies them to the .json file for local use
# :jsonObject: the json of the user's selected options
# return :Settings: after setting the user's options so that the client has a copy of the latest settings.
def update(jsonObject):
        userSettings = parseSettingsJSON(jsonObject)
        userSettings.write()
        return userSettings

# parseSettingsFromJSON transforms a JSON dictionary into a full Settings object
# :jsonObject: is the parsed JSON of the .json file
# return :Settings: object parsed from data
def parseSettingsJSON(jsonObject):
        exts = {}
        for item in ALL_EXTENSIONS:
                prop = None
                key = item.type()
                try:
                        data = jsonObject[key]
                        prop = item.createFromDict(data)
                except:
                        prop = item.createDefault()
                finally:
                        exts[key] = prop
        return Settings(exts, False)

# __initialSetup is called if the .json file does not exist.
# It sets up the .json file with default values for all expected data.
def __initialSetup():
        exts = {}
        for item in ALL_EXTENSIONS:
                prop = None
                key = item.type()
                prop = item.createDefault()
                exts[key] = prop

        # Write to the .json file, and return our json object
        data = Settings(exts, True)
        data.write()
        return data