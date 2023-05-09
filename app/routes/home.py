# Hacks
import sys

sys.path.append("..")

from flask import Blueprint, render_template, request, session
'''
from database import user
'''
# Create the blueprint
home_bp = Blueprint('home', __name__)


@home_bp.route("/")
def home(*args, **kwargs):
    # Fetch the user from the database
    '''
    if "username" in session:
        user_data = user.get_user(request.db, session["username"])
        if len(user_data) > 0:
            user_data = user.convert_to_user(user_data[0])
        else:
            user_data = None

    if "username" in session:
        return render_template("index.html", user=user_data)
    else:
        return render_template("index_guest.html")
        '''
    return render_template('landing.html')
