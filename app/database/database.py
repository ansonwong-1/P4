import sqlite3
import requests

DB_FILE = "database.db"
db = sqlite3.connect(DB_FILE, check_same_thread=False)

def setup_tables():
    c = db.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS planes (f_id TEXT PRIMARY KEY, callsign TEXT, origin_country TEXT, lon REAL, lat REAL, last_update INTEGER)")
    db.commit()
    c.close()

def add_to_table():
    c = db.cursor()
    
    response = requests.get("https://opensky-network.org/api/states/all")
    data = response.json()['states']
    
    for plane in data:
        f_id = plane[0]
        callsign = plane[1]
        origin_country = plane[2]
        lon = plane[5]
        lat = plane[6]
        last_update = plane[3]
        
        c.execute("INSERT OR REPLACE INTO planes (f_id, callsign, origin_country, lon, lat, last_update) VALUES (?, ?, ?, ?, ?, ?)", (f_id, callsign, origin_country, lon, lat, last_update))
    db.commit()
    c.close()

# plane data given relative to page and page size
def get_plane_data(page, page_size):
    c = db.cursor()
    offset = (page - 1) * page_size
    c.execute("SELECT * FROM planes LIMIT ? OFFSET ?", (page_size, offset))
    data = c.fetchall()
    c.close()
    return data

def get_all_plane_data():
    c = db.cursor()
    c.execute("SELECT * FROM planes")
    data = c.fetchall()
    c.close()
    return data

#setup_tables()
#add_to_table()
