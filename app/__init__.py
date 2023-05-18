import json

import requests
from flask import Flask, render_template, request, session, redirect, url_for, make_response  # web server essentials
from database import database, user

from tools import b64


app = Flask(__name__, static_url_path='/static')


app.secret_key = b64.base64_encode(
    "very good secret key. it's really secure now that we encoded it into base64!")

@app.route("/", methods=['GET', 'POST'])
def disp_page():
    if 'usernameLog' in session:
        if user.verify(session['usernameLog'], session['passwordLog']):
            return render_template("/landing.html")
    return render_template('login.html') 

@app.route('/login', methods = ['GET','POST'])
def login():
    # print(request.form)
    username = request.form.get('usernameLog')
    password = request.form.get('passwordLog')
    if user.verify(username,password):
        session['usernameLog'] = username
        session['passwordLog'] = password
        return redirect("/")
    if request.form.get('register') is not None:
        return render_template("register1.html")
    return make_response(render_template('login.html', error="invalid username or password"))
    
@app.route('/register', methods=['GET', 'POST'])
def reg():
    accounts = user.get_table_list("users")
    if request.method == 'POST':
        userIn = request.form.get('usernameReg')
        passIn = request.form.get('passwordReg') 

        if request.form.get('sub1') is None:
            return render_template("register.html")
        else:
            result = user.insert(userIn, passIn)
            if result == False:
                return render_template("register.html", registerMSG="invalid username or password")
            return render_template("login.html", error = "Login now")
    return render_template("register.html")
    #return redirect(url_for('disp_page'))
    
@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('password', None)
    return redirect(url_for('disp_page'))

'''
@app.before_request
def before_request():
    request.db = db

    '''

""" @app.route('getplanes', methods=['GET'])
def getplanes():
    # access the plane data
    planeData = None
    return render_template('getplanes.html', planes=planeData) """


if __name__ == "__main__":  # false if this file imported as module
    # enable debugging, auto-restarting of server when this file is modified
    app.debug = True
    app.run(
        # Comment out on production run
        host="0.0.0.0",
        port=5001,
    )
