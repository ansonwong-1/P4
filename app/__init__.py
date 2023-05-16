import requests
import database as db
from flask import Flask, render_template, request, session, redirect, url_for, jsonify # web server essentials

from routes.home import home_bp
from routes.login import login_bp
from routes.logout import logout_bp
from routes.register import register_bp
from routes.flightinfo import flightinfo_bp

from tools import b64


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
@app.route('/')
def index():
    return render_template('landing.html')

@app.route('/planes')
def getplanes():
    data = db.get_plane_data()
    response = []
    for plane in data:
        f_id, callsign, origin_country, longi, lat, last_update = plane
        response.append({
            "f_id": f_id,
            "callsign": callsign,
            "origin_country": origin_country,
            "longi": longi,
            "lat": lat,
            "last_update": last_update
        })
    return jsonify(response)

if __name__ == "__main__":  # false if this file imported as module
    # enable debugging, auto-restarting of server when this file is modified
    app.debug = True
    app.run(
        # Comment out on production run
        host="0.0.0.0",
        port=5002,
    )
