# PiFrame settings.py
# Manages writing/reading the .json file backing user settings for the app.
# This informs the application of user settingsfor enabled extensions, and further settings used by extensions

import extensions, json

# FILE_NAME is the name of the .json file in charge of storing settings
FILE_NAME = "settings.json"

# __write serves as a utility for writing information into the .json file
# This should never be exposed outside of the settings module.
# Instead, it should be called internally when a change was made to the data variable.
# The JSON value of data is saved by __write
# :settings: a valid Settings class which is set a the new default for a user
def __write(settings):
    # print("!")
    with open(FILE_NAME, 'w') as f:
        json.dump(settings, f)

# read serves as a utility for reading information from the .json file into the application.
# This should only be called on startup, since at any other point, since the application should maintain the valid state of the settings.
# If no file can be found, __initialSetup should be called to set the default settings
def read():
    try:
        with open(FILE_NAME, 'r') as f:
            return json.load(f)
    except IOError:
        return __initialSetup()

def __initialSetup():
    data = {}

    # By default, enable all installed extensions
    extensionValue = 0
    for ex in extensions.Extensions :
        extensionValue += ex
    data['extensions'] = extensionValue

    # Add code here to enable defaults for each extension
    #
    #
    #
    # Write to the .json file, and return our json object
    __write(data)
    return data