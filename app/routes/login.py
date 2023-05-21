# Hacks
import sys

sys.path.append("..")

from flask import Blueprint, render_template, request, redirect, url_for, session
from database import user
from tools.data_validation import validate_username, validate_password

# Create the blueprint
login_bp = Blueprint('login', __name__)


@login_bp.route("/login", methods=['GET', 'POST'])
def login(*args, **kwargs):
    # If the user is already logged in, redirect them to the home page
    if 'username' in session:
        return redirect("/")

    # If it's a POST request, the user is trying to log in
    if request.method == 'POST':
        # Get the username and password from the form
        username = request.form['username']
        password = request.form['password']

        # Validate the username and password
        if not validate_username(username):
            return render_template('login.html', error="Invalid username (a-zA-Z0-9_.-)")
        if not validate_password(password):
            return render_template('login.html', error="Invalid password (must be at least 8 characters)")

        # Check if the username exists
        if user.username_in_system(username) == False:
            return render_template('login.html', error="Username does not exist")

        # Check if the password is correct
        if user.login(username, password) == False:
            return render_template('login.html', error="Incorrect password")

        # Log the user in
        session['username'] = username

        # Redirect the user to the home page
        return redirect('/')

    # If it's a GET request, the user is trying to view the login page
    return render_template('login.html')
