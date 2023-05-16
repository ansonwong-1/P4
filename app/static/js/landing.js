// creation of map
const map = L.map("map", {
  center: [50, 0],
  zoom: 2,
});

/*
diff links for tiles but still quite ugly
["http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png","http://b.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png","http://c.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"]
["http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.png","http://b.tile.stamen.com/watercolor/{z}/{x}/{y}.png","http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png","http://d.tile.stamen.com/watercolor/{z}/{x}/{y}.png"]
["http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png","http://b.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png","http://c.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"]
*/
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// markers for planes
const planeIcon = L.icon({
  iconUrl: "static/img/plane.png", // i found a sample plane pic online
  iconSize: [45, 45],
  iconAnchor: [15, 15],
  //popupAnchor: [0, -15]
});

// real-time data stuff -- adds markers to maps too
function getPlanes() {
  axios
    .get("/planes")
    .then(function (response) {
      var planes = response.data;
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      displayPlanes(planes);
      planes.forEach(function (plane) {
        var lat = plane.lat;
        var longi = plane.longi;
        if (lat && longi) {
          L.marker([lat, longi], { icon: planeIcon }).addTo(map);
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
getPlanes();
/*
longitude for ny didnt match what i got from google search so copied this from leaflet
function onMapClick(e) {
    console.log("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);
*/
