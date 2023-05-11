# Hacks
import sys

sys.path.append("..")
from flask import Blueprint, redirect, session, request, url_for, session  # web server essentials
from database import user
#from middleware import check_auth

def check_auth():
    if 'username' not in session:
        return redirect(url_for('login'))

    else:
        # Try to get the user from the database
        user_data = user.get_user(request.db, session['username'])

        # If the user doesn't exist, log them out
        if len(user_data) == 0:
            # Redirect the user to the login page
            return redirect('/login')

check_auth = check_auth.check_auth

# Create the blueprint
logout_bp = Blueprint('logout', __name__)


@logout_bp.route("/logout", methods=['GET', 'POST'])
def logout(*args, **kwargs):
    check_auth()
    # If the user is logged in, log them out
    if 'username' in session:
        session.pop('username', None)

    # Redirect the user to the home page
    return redirect('/')
