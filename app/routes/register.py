# Hacks
import sys

sys.path.append("..")

from flask import Blueprint, render_template, request, redirect, url_for, session
from database import user
from tools.data_validation import validate_username, validate_password

# Create the blueprint
register_bp = Blueprint('register', __name__)


@register_bp.route("/register", methods=['GET', 'POST'])
def register(*args, **kwargs):
    # If the user is already logged in, redirect them to the home page
    if 'username' in session:
        return redirect('/')

    # If it's a POST request, the user is trying to sign up
    if request.method == 'POST':
        # Get the username and password from the form
        username = request.form['username']
        password = request.form['password']

        # Validate the username and password
        if not validate_username(username):
            return render_template('register.html', error="Invalid username (a-zA-Z0-9_.-)")
        if not validate_password(password):
            return render_template('register.html', error="Invalid password (must be at least 8 characters)")

        # Check if the username is already taken
        if user.username_in_system(username) == True:
            return render_template('register.html', error="Username already taken")

        # Create the user
        user.signup(username, password)

        # Automatically log the user in
        session['username'] = username

        # Redirect the user to the login page
        return redirect('/')

    # If it's a GET request, the user is trying to view the sign up page
    return render_template('register.html')
