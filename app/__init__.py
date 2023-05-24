# all the routes are in seperate files with the help of flask blueprints

import sqlite3
from database import database as db, user as userdb
from flask import Flask, request, jsonify

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

user_db = sqlite3.connect("user.db", check_same_thread=False)
plane_db = sqlite3.connect("database.db", check_same_thread=False)

""" @app.before_request
def before_request():
    request.db = db """
    
@app.route("/planes")
def getplanes():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 1000))
    try:
        db.add_to_table()
        print("updated table")
    except:
        print("error updating table")
    data = db.get_plane_data(page, page_size)
    
    # starting and ending index for page
    start = (page - 1) * page_size
    end = start + page_size
    
    planes = data[start:end]
    response = []
    
    for plane in planes:
        f_id, callsign, origin_country, lon, lat, last_update = plane
        response.append({
            "f_id": f_id,
            "callsign": callsign,
            "origin_country": origin_country,
            "lon": lon,
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
        port=5003,
    )
