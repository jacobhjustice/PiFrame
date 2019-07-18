from flask import Flask, render_template
import settings, extensions

app = Flask(__name__, static_url_path='/static', template_folder='./templates')


@app.route('/')
def init():
    # settings.write()
    settings.read()
    # settings.setExtensions([extensions.Extensions.picture, extensions.Extensions.clock])
    return ""#render_template('templates/index.html')



if __name__ == '__main__':
    app.run()