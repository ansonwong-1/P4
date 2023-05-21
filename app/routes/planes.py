# Hacks
import sys

sys.path.append("..")

from flask import Blueprint, render_template, request, session, jsonify
from database import user, database as db

# Create the blueprint
planes_bp = Blueprint('planes', __name__)

@planes_bp.route("/planes")
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

