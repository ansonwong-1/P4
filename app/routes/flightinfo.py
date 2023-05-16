# Hacks
import sys

sys.path.append("..")

from flask import Blueprint, render_template, request, session
#from database import user

# Create the blueprint
flightinfo_bp = Blueprint('flightinfo', __name__)


@flightinfo_bp.route("/flightinfo")
def flightinfo(*args, **kwargs):
    # Fetch the user from the database
    '''
    if "username" in session:
        user_data = user.get_user(request.db, session["username"])
        if len(user_data) > 0:
            user_data = user.convert_to_user(user_data[0])
        else:
            user_data = None

    if "username" in session:
        return render_template("flightinfo.html", user=user_data)
    else:
<<<<<<< HEAD
        return render_template("index_guest.html")
        '''
    return render_template("flightinfo.html")   
=======
        return render_template("login.html")
>>>>>>> ba0644e3e72df1adc748eab47db5d544f3645a8f

