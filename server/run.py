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
    # session['SETTINGS'] = jsonString
    return jsonString

@app.route('/verse/', methods=["GET"])
def getVerse():
    json = verse.get()
    return json

@app.route('/images/', methods=["GET"])
def getImages():
    userSettings = settings.read()
    json = photos.getAlbumsForClient(userSettings.Photos)
    userSettings.write()
    return json

@app.route('/weather/<int:includeForecast>/', methods=["GET"])
def getWeather(includeForecast):
    userSettings = settings.read()
    json = weather.getWeather(includeForecast, userSettings.Weather.zip)
    return json

@app.route('/settings/', methods=["POST"])
def postSettings():
    # TODO save settings and return result
    print("@@@")

if __name__ == '__main__':
    app.run()