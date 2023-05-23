# Hacks
import sys

sys.path.append("..")

from flask import Blueprint, render_template, request, session
from database import database as db, user

# Create the blueprint
flightinfo_bp = Blueprint('flightinfo', __name__)


@flightinfo_bp.route("/flightinfo")
def flightinfo(*args, **kwargs):
    if "username" in session:
        planes = db.get_all_plane_data()
        return render_template("flightinfo.html", planes = planes)
    else:
        return render_template("login.html")

