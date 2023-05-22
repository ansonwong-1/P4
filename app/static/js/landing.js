/*
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

*/

var map = L.map('map',{
  minZoom: 5,
});




L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var layerGroup = L.layerGroup().addTo(map);

var mapBounds = (e) => {
  var bounds = map.getBounds();
  console.log(bounds);
};

(function() { //from RotateMarker API
  // save these original methods before they are overwritten
  var proto_initIcon = L.Marker.prototype._initIcon;
  var proto_setPos = L.Marker.prototype._setPos;

  var oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

  L.Marker.addInitHook(function () {
      var iconOptions = this.options.icon && this.options.icon.options;
      var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
      if (iconAnchor) {
          iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
      }
      this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom' ;
      this.options.rotationAngle = this.options.rotationAngle || 0;

      // Ensure marker keeps rotated during dragging
      this.on('drag', function(e) { e.target._applyRotation(); });
  });

  L.Marker.include({
      _initIcon: function() {
          proto_initIcon.call(this);
      },

      _setPos: function (pos) {
          proto_setPos.call(this, pos);
          this._applyRotation();
      },

      _applyRotation: function () {
          if(this.options.rotationAngle) {
              this._icon.style[L.DomUtil.TRANSFORM+'Origin'] = this.options.rotationOrigin;

              if(oldIE) {
                  // for IE 9, use the 2D rotation
                  this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
              } else {
                  // for modern browsers, prefer the 3D accelerated version
                  this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
              }
          }
      },

      setRotationAngle: function(angle) {
          this.options.rotationAngle = angle;
          this.update();
          return this;
      },

      setRotationOrigin: function(origin) {
          this.options.rotationOrigin = origin;
          this.update();
          return this;
      }
  });
})();



function getFlightPos(data){
  var pos = [data[5], data[6], data[10]]
  return pos;
};


function makeFlights(data){
  flights = [];

  layerGroup.clearLayers();
  
  var zoom = map.getZoom();
  console.log(zoom);
  var x = 30/((Math.abs(zoom-11))/2);
  console.log(x);
  var myIcon = new L.icon({
      iconUrl: 'static/img/plane.png',
      iconSize: [x, x],
  });

  for (let i = 0; i < data.length; i++) {
      if (data[i][8] == false ){
        pos = getFlightPos(data[i]);
        //console.log(pos);
        L.marker([pos[1],pos[0]], {
            icon: myIcon,
            rotationAngle: pos[2],
        }).addTo(layerGroup);
      };
  }
};


async function getData(bounds) {
  var lamin = bounds["_southWest"]["lat"];
  var lomin = bounds["_southWest"]["lng"];
  var lamax = bounds["_northEast"]["lat"];
  var lomax = bounds["_northEast"]["lng"];

  const response = await fetch(`https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`, {
      method: "GET",
  });
  const jsonData = await response.json();
  flightData = jsonData["states"];
  if (flightData != null){
      makeFlights(flightData);
  }


  //console.log(flightData);

};

function updatePlanes(){
  var bounds = map.getBounds();
  getData(bounds);
}

map.on('zoomend moveend load', function () {
  updatePlanes();
});

window.setInterval(updatePlanes, 3000); 


map.setView([40.7128, -74.0060], 10);





