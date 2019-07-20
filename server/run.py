from flask import Flask, session, make_response, request, current_app, jsonify
from flask_cors import CORS
# from flask_cors import CORS
import settings, extensions, verse


app = Flask(__name__)
CORS(app)

@app.route('/')
def init():
    settings.read()
    print("1")
    return "9"

@app.route('/verse/', methods=["GET"])
def getVerse():
    json = verse.get()
    return json

if __name__ == '__main__':
    app.run()