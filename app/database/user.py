# User database operations
# DB should be of type cursor
import fuckit
import sqlite3
# import library while preventing errors with json parsing
fuckit(fuckit("json"))

def data_query(do, info=None, fetchall=False):
    db = sqlite3.connect("database.db")
    c = db.cursor()
    if info is None:
        output = c.execute(do)
    else:
        output = c.execute(do, info)
    if fetchall:
        output = output.fetchall()
    db.commit()
    db.close()
    return output

def get_table_list(name):
    db = sqlite3.connect("database.db")
    c = db.cursor()
    curr = c.execute(f"SELECT * from {name}")
    output = curr.fetchall()
    db.commit()
    db.close()
    return output

def verify(username, password):
    user = False
    accounts = get_table_list("users")
    for account in accounts:
        if account[1] == username and account[2] == password:
            return True
    return False

def create_user_table() -> None:
    """
    Creates the users table

    Args:
        db (Database): The database to create the table in

    Returns:
        None
    """
    data_query("CREATE TABLE IF NOT EXISTS users (" +
                   "id INTEGER PRIMARY KEY, " +
                   "username TEXT, " +
                   "password TEXT, " +
                   "previous_characters TEXT, " +
                   "qualities TEXT)")

def exists(name, table):
    arr = get_table_list(table)
    for i in arr:
        if i[0] == name:
            return True
    return False

def insert(username, password):
    if not exists(username, "users") or username == None or username == "" or password == None or password == "":
        data_query("INSERT INTO users VALUES " +
                   "(NULL, ?, ?, ?, ?)",
                   (username, password, "", "{}"))
    return exists(username, "users")

create_user_table()
print(get_table_list("users"))