var geocoder, map, marker, btn, directionsDisplay, directionsService, request;

var locationList = document.querySelector('.location-list');
var newListItem;

var locations = [
  ['Amsterdam Centraal', 52.378210, 4.899598],
  ['Damrak', 52.374193, 4.894642],
  ['Gollum', 52.370530, 4.888483]
];

for (i = 0; i < locations.length; i++) {
  newListItem = document.createElement('li');
  locationList.appendChild(newListItem);
  var newText = document.createTextNode(locations[i][0]);
  newListItem.appendChild(newText);
}

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 12,
    center: {
      lat: 52.375791,
      lng: 4.898908
    }
  })
  directionsDisplay.setMap(map);

  var i;
  var request = {
    travelMode: google.maps.TravelMode.WALKING
  };

  placeMarkers = function() {

    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      })

      if (i == 0) request.origin = marker.getPosition();
      else if (i == locations.length - 1) request.destination = marker.getPosition();
      else {
        if (!request.waypoints) request.waypoints = [];
        request.waypoints.push({
          location: marker.getPosition(),
          stopover: true
        });
      }
    };
  };

  placeMarkers();

  // Add a marker
  btn2 = document.querySelector('.btn-2');

  btn2.addEventListener('click', function(e) {
    e.preventDefault();

    var title = document.getElementById('title').value;
    var lat = Number(document.getElementById('lat').value);
    var lng = Number(document.getElementById('lng').value);

    newLoc = [title, lat, lng];
    locations.push(newLoc);
    console.log(newLoc);

    newListItem = document.createElement('li');
    locationList.appendChild(newListItem);
    newListItem.appendChild(document.createTextNode(newLoc[0]));

    placeMarkers();
  })

  // Get actual directions
  btn = document.querySelector('.btn');

  btn.addEventListener('click', function(e) {
    e.preventDefault();

    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        // directionsDisplay.setDirections(result);
        var polyline = new google.maps.Polyline({
          path: [],
          strokeColor: '#ff0000',
          strokeWeight: 3
        });
        var bounds = new google.maps.LatLngBounds();


        var legs = result.routes[0].legs;
        for (i = 0; i < legs.length; i++) {
          var steps = legs[i].steps;
          for (j = 0; j < steps.length; j++) {
            var nextSegment = steps[j].path;
            for (k = 0; k < nextSegment.length; k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);
            }
          }
        }

        polyline.setMap(map);
      }
    });

  })


  // marker = new google.maps.Marker({
  //   position: {
  //     lat: 52.375791,
  //     lng: 4.898908
  //   },
  //   map: map
  // })
}
