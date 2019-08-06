from flask import Flask, session, make_response, request, current_app, jsonify
from flask_cors import CORS
# from flask_cors import CORS
import settings, extensions, verse, photos, json, weather


app = Flask(__name__)
app.config['SECRET_KEY'] = 'super secret'
CORS(app)

@app.route('/settings/', methods=["GET"])
def getSettings():
    userSettings = settings.read()
    jsonString = json.dumps(userSettings.toJSON())
    return jsonString

@app.route('/verse/', methods=["GET"])
def getVerse():
    userSettings = settings.read()
    if userSettings.Verse.isEnabled != True:
        return '{"isNotEnabled": "True"}'
    json = verse.get()
    return json

@app.route('/images/', methods=["GET"])
def getImages():
    userSettings = settings.read()
    if userSettings.Photos.isEnabled != True:
        return '{"isNotEnabled": "True"}'
    json = photos.getAlbumsForClient(userSettings.Photos)
    userSettings.write()
    return json

@app.route('/weather/<int:includeForecast>/', methods=["GET"])
def getWeather(includeForecast):
    userSettings = settings.read()
    if userSettings.Weather.isEnabled != True:
        return '{"isNotEnabled": "True"}'
    json = weather.getWeather(includeForecast, userSettings.Weather)
    return json

@app.route('/settings/', methods=["POST"])
def postSettings():
    settingPayload = request.get_json()
    userSettings = settings.update(settingPayload)    
    jsonString = json.dumps(userSettings.toJSON())
    return jsonString

if __name__ == '__main__':
    app.run()