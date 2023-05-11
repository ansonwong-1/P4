// creation of map
const map = L.map('map', {
    center: [40, 285],
    zoom: 5
});

/*
diff links for tiles but still quite ugly
["http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png","http://b.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png","http://c.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"]
["http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.png","http://b.tile.stamen.com/watercolor/{z}/{x}/{y}.png","http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png","http://d.tile.stamen.com/watercolor/{z}/{x}/{y}.png"]
["http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png","http://b.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png","http://c.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"]
*/
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// markers for planes
const plane = L.icon({
    iconUrl: '/static/img/plane.png', // i found a sample plane pic online
    iconSize: [45, 45],
    //iconAnchor: [15, 15],
    //popupAnchor: [0, -15]
});

const plane1 = L.marker([51.5, -0.09], { icon: plane }).addTo(map);
const plane2 = L.marker([51.51, -0.1], { icon: plane }).addTo(map);
const plane3 = L.marker([51.49, -0.1], { icon: plane }).addTo(map);


// real-time data stuff -- will come from database hopefully
function getPlanes() {
    // $.ajax({
    //     url: '/get-planes', 
    //     type: 'GET',
    //     success: function(data) {
    //         displayPlanes(data);
    //     },
    //     error: function(error) {
    //         console.log(error);
    //     }
    // });
    // for testing -- does not work right now not sure why
    var planes = [
        { id: 1, name: 'Plane 1', lat: 40.6892, lng: 74.0445 }, // statue of liberty
        { id: 2, name: 'Plane 2', lat: 40.7128, lng: -74.0060 },
        { id: 3, name: 'Plane 3', lat: 51.5074, lng: -0.1278 }
      ];
    displayPlanes(planes);
}

// to display planes -- this code is temp code
function displayPlanes(planes) {
    for (let i = 0; i < planes.length; i++) {
        const plane = planes[i];
        const marker = L.marker([plane.lat, plane.lng], { icon: plane }).addTo(map);
        marker.bindPopup(plane.name).openPopup();
    }
}

/*
longitude for ny didnt match what i got from google search so copied this from leaflet
function onMapClick(e) {
    console.log("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);
*/