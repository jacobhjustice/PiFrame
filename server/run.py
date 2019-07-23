from flask import Flask, session, make_response, request, current_app, jsonify
from flask_cors import CORS
# from flask_cors import CORS
import settings, extensions, verse, photos, json


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
    json = photos.getAlbumsForClient(userSettings)
    return json

if __name__ == '__main__':
    app.run()