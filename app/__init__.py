import json

import requests
from flask import Flask, render_template, request, session, redirect, url_for  # web server essentials
from database import database

from routes.home import home_bp


from routes.login import login_bp
from routes.logout import logout_bp
from routes.register import register_bp
from routes.flightinfo import flightinfo_bp


from tools import b64


#from utils import _api
#from utils import _api
#from utils import _api
#from utils import _api


global db
db = database.database()



app = Flask(__name__, static_url_path='/static')


app.register_blueprint(home_bp)
app.register_blueprint(login_bp)
app.register_blueprint(logout_bp)
app.register_blueprint(register_bp)
app.register_blueprint(flightinfo_bp)



app.secret_key = b64.base64_encode(
    "very good secret key. it's really secure now that we encoded it into base64!")


'''
@app.before_request
def before_request():
    request.db = db

    '''

""" @app.route('getplanes', methods=['GET'])
def getplanes():
    # access the plane data
    planeData = None
    return render_template('getplanes.html', planes=planeData) """


if __name__ == "__main__":  # false if this file imported as module
    # enable debugging, auto-restarting of server when this file is modified
    app.debug = True
    app.run(
        # Comment out on production run
        host="0.0.0.0",
        port=5001,
    )
