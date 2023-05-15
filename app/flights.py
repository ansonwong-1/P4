from urllib.request import urlopen
import json
import requests
from datetime import datetime 
startpoint = "https://opensky-network.org/api"
api_key = ""
with open("keys/key_api0", 'r') as k:
    api_key = k.read().strip()

#https://github.com/openskynetwork/opensky-api/blob/master/python/test_opensky_api.py

def in_bound(lat_min, lat_max, long_min, long_max, n):
    url = f"{startpoint}/states/all?lamin={lat_min}&lomin={long_min}&lamax={lat_max}&lomax={long_max}"
    return nec(json.loads(urlopen(url).read())["states"])
    #return de(json.loads(urlopen(url).read()))

def nec(status):
    res = []
    for i in status:
        time = str(datetime.fromtimestamp(i[3]))
        flight = {
            "id": i[0], 
            "time_pos": time, #can be null
            "long": i[5],
            "lat": i[6],
            "vel": i[9]
        }
        res.append(flight)
    return res

#print(in_bound(50, 90, 50, 90, 20))
#print(datetime.fromtimestamp(1684156226))