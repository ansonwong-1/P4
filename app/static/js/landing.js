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

      _applyRotation: function() {
        if (this.options.rotationAngle) {
          this._icon.style.transformOrigin = this.options.rotationOrigin;
      
          if (L.DomUtil.TRANSFORM) {
            // Modern browsers
            this._icon.style.transform = 'rotate(' + this.options.rotationAngle + 'deg)';
          } else if (L.DomUtil.TRANSFORM3D) {
            // Fallback for old browsers supporting 3D transforms
            this._icon.style[L.DomUtil.TRANSFORM3D] += ' rotate(' + this.options.rotationAngle + 'deg)';
          } else {
            // Fallback for old browsers supporting only 2D transforms
            this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotationAngle + 'deg)';
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


var planeMarkers = {}; // Store markers by flight ID

function makeFlights(data) {
  // Remove markers of planes that are no longer present in the data
  for (var planeId in planeMarkers) {
    if (!data.some(plane => plane.f_id === planeId)) {
      map.removeLayer(planeMarkers[planeId]);
      delete planeMarkers[planeId];
    }
  }

  var zoom = map.getZoom();
  var x = 30 / ((Math.abs(zoom - 11)) / 2);
  var myIcon = new L.icon({
    iconUrl: 'static/img/plane.png',
    iconSize: [x, x],
  });

  for (var i = 0; i < data.length; i++) {
    var plane = data[i];
    var planeId = plane.f_id;

    // Skip if latitude or longitude is null
    if (plane.lat === null || plane.lon === null) {
      continue;
    }

    var pos = [plane.lat, plane.lon, plane.last_update];

    if (planeId in planeMarkers) {
      // Update existing marker position
      planeMarkers[planeId].setLatLng([pos[0], pos[1]]);
      planeMarkers[planeId].setRotationAngle(pos[2]);
    } else {
      // Create new marker
      var marker = L.marker([pos[0], pos[1]], {
        icon: myIcon,
        rotationAngle: pos[2],
      }).addTo(layerGroup).bindPopup(
        "<b>Callsign: " +
        plane.callsign +
        "</b><br/>" +
        "Origin Country: " +
        plane.origin_country
      );
      planeMarkers[planeId] = marker;
    }
  }
}


// async function getData(bounds) {
//   var lamin = bounds["_southWest"]["lat"];
//   var lomin = bounds["_southWest"]["lng"];
//   var lamax = bounds["_northEast"]["lat"];
//   var lomax = bounds["_northEast"]["lng"];

//   const response = await fetch(`https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`, {
//       method: "GET",
//   });
//   const jsonData = await response.json();
//   flightData = jsonData["states"];
//   if (flightData != null){
//       makeFlights(flightData);
//   }

//   // console.log(flightData);

// };

function updatePlanes() {
  var bounds = map.getBounds();

  fetch('/planes')
    .then(response => response.json())
    .then(flightData => {
      makeFlights(flightData);
    })
    .catch(error => {
      console.error('Error fetching flight data:', error);
    });
}

// map.on('zoomend moveend load', function () {
//   updatePlanes();
// });

window.setInterval(updatePlanes, 5000); // updates map every 5 seconds
map.setView([40.7128, -74.0060], 10);