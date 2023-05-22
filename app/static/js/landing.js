// markers for planes
var planeIcon = L.icon({
  iconUrl: "https://previews.123rf.com/images/asmati/asmati1702/asmati170203104/71461868-flying-plane-sign-side-view-black-icon-on-transparent-backgrou.jpg", // i found a sample plane pic online
  iconSize:     [38, 38], // size of the icon
  iconAnchor:   [19, 38], // point of the icon which will correspond to marker's location
  popupAnchor:  [0,-38] // point from which the popup should open relative to the iconAnchor
});

// real-time data stuff -- adds markers to maps too
function getPlanes(page, pageSize) {
  axios.get("/planes", {
    params: {
      page: page,
      pageSize: pageSize
    }
  })
    .then(function (response) {
      var planes = response.data;
      var bounds = map.getBounds(); // gets bounds for map currently

      // add markers for each plane to map
      planes.forEach(function (plane) {
        var lat = plane.lat;
        var lon = plane.lon;
        
        if (typeof lat === "number" && typeof lon === "number") {
          var position = L.latLng(lat, lon);
          
          // checks to see if plane is within map bounds
          if (bounds.contains(position)) {
            var marker = L.marker([plane.lat, plane.lon], {icon: planeIcon});
            marker.addTo(map);
            marker.bindPopup("<b>" + plane.callsign + "</b><br/>" + plane.origin_country).openPopup();
            // document.getElementById("planeMarkers").innerHTML += "<li>" + plane.callsign + "</li>";
          }
        }
      });
    })
    .catch(function (error) {
      console.log('Error fetching plane data:', error);
    });
}

// creation of map
var map = L.map("map").setView([0, 0], 2);

// adds tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

function updatePlanes() {
  var page = 1;
  var pageSize = 100;
  getPlanes(page, pageSize);
}

// first fetch of planes
updatePlanes();
window.setInterval(updatePlanes, 5000); // updates map every 5 seconds

// update planes whenever map zoom is changed
map.on('zoomend', function () {
  updatePlanes();
});
// window.setInterval(getPlanes, 5000);
