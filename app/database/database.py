import sqlite3

DB_FILE = "database.db"
db = sqlite3.connect(DB_FILE, check_same_thread=False)

def setup_tables():
    c = db.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS flights (f_id INTEGER PRIMARY KEY, deparature TEXT, arrival TEXT)")
    db.commit()
    c.close()

def add_flights():
    c = db.cursor()
    c.execute("INSERT INTO flights VALUES(?, ?, ?)", (0,"123","123") )
    db.commit()
    c.close()

setup_tables()
add_flights()
