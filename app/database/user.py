import sqlite3, json

db = sqlite3.connect("user.db", check_same_thread=False)

# making tables
c = db.cursor()
c.execute("CREATE TABLE if not exists users(username TEXT, password TEXT)")

# general method that can be used to get data easier
def select_from(database, table, data_want, datagive, datatype_give):
    db = sqlite3.connect(database, check_same_thread=False)
    c = db.cursor()
    temp = ((c.execute(f"SELECT {data_want} FROM {table} WHERE {datatype_give} = '{datagive}'")).fetchall())
    if(len(temp) > 0):
        return temp[0][0]
    else:
        return 0

def username_in_system(username):
    c = db.cursor()
    temp = list(c.execute("SELECT username FROM users").fetchall())
    for element in temp:
        for element2 in element:
            if username == element2:
                return True
    return False

def signup(username, password):
    c = db.cursor()
    if(username_in_system(username)):
        return False
    else:
        c.execute("INSERT INTO users VALUES (?,?)", (username, password))
    db.commit()
    return True #save changes

# this method is prob not needed but we can add a feature for deleting account or smth
def remove_user(username):
    c = db.cursor()
    try:
        c.execute(f'DELETE FROM users WHERE username = "{username}"')
        db.commit()
        return True
    except:
        return False
    
# to verify if the password given is right to login
def login(username, password):
    if(username_in_system(username)):
        if(select_from("user.db", "users", "password", username, "username") == password):
            return True
    return False


def edit_username(old_username, username):
    db = sqlite3.connect("user.db", check_same_thread=False)
    c = db.cursor()
    c.execute(f"UPDATE users SET username = '{username}' WHERE username = '{old_username}'")
    db.commit()