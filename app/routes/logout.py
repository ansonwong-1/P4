# Hacks
import sys

sys.path.append("..")
from flask import Blueprint, redirect, session
from middleware import check_auth

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
