var socket = io();
// var userAdress = document.querySelector('#userAdress').innerHTML
// var userId = document.querySelector('#userId').innerHTML.trim()

/**
 * Moves the map to display over Berlin
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */


var platform = new H.service.Platform({
  'apikey': 'Lo6A7QIb_DDKZsYngtVGSmQ2uM2XI30BSu-FEMZO1bg'
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - 
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {
    center: { lat: 52.379189, lng: 4.899431 },
    zoom: 15,
    pixelRatio: window.devicePixelRatio || 1
  });
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
var bubble;

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position, { content: text });
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

/**
 * Calculates and displays the address details of 200 S Mathilda Ave, Sunnyvale, CA
 * based on a free-form text
 *
 *
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function geocode() {
  var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
      searchText: userAdress,
      jsonattributes: 1
    };

  geocoder.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}
/**
 * This function will be called once the Geocoder REST API provides a response
 * @param  {Object} result          A JSONP object representing the  location(s) found.
 *
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
function onSuccess(result) {
  console.log(result.response.view[0].result)
  var locations = result.response.view[0].result;
  var userLocation = result.response.view[0].result;
  socket.emit('getUserLatLon', {
    userLat: locations[0].location.displayPosition.latitude,
    userLon: locations[0].location.displayPosition.longitude,
    userId: userId
  })
  addUserLocation(userLocation)
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

function addUserLocation(userLocation) {
  var group = new H.map.Group(),
    position,
    i;

  // Add a marker for each location found
  for (i = 0; i < userLocation.length; i += 1) {
    position = {
      lat: userLocation[i].location.displayPosition.latitude,
      lng: userLocation[i].location.displayPosition.longitude
    };
    var svgMarkup =
      '<svg xmlns="http://www.w3.org/2000/svg" x="1" y="1" width="40" height="40" viewBox="0 0 263.335 263.335"><path d="M40.479,159.021c21.032,39.992,49.879,74.22,85.732,101.756c0.656,0.747,1.473,1.382,2.394,1.839   c0.838-0.396,1.57-0.962,2.178-1.647c80.218-61.433,95.861-125.824,96.44-128.34c2.366-9.017,3.57-18.055,3.57-26.864 C237.389,47.429,189.957,0,131.665,0C73.369,0,25.946,47.424,25.946,105.723c0,8.636,1.148,17.469,3.412,26.28" fill="tomato"/></svg>'
      // '<svg xmlns="http://www.w3.org/2000/svg" x="1" y="1" width="40" height="40" viewBox="0 0 20.1 25.72">  <path d="M3.55,32h20.1l0-16L13.84,6.28,3.57,16" transform="translate(-3.55 -6.28)" fill="white"/></svg>'
    var icon = new H.map.Icon(svgMarkup);

    var marker = new H.map.Marker(position, { icon: icon });
    marker.label = 'Jouw locatie';
    group.addObject(marker);
  }

  group.addEventListener('tap', function(evt) {
    newChat()
    map.setCenter(evt.target.getGeometry());
    openBubble(
      evt.target.getGeometry(), evt.target.label);
  }, false);

  // Add the locations group to the map
  map.addObject(group);
  // setCenter: center the map to the result location
  map.setCenter(group.getBoundingBox().getCenter());
}

// Set all data on the map
socket.on('setAllLocations', function(data) {

  // addLocationsToMap(allData)
  var group = new H.map.Group(),
    position,
    i;
  // Add a marker for each location found
  for (i = 0; i < data.length; i += 1) {
    console.log(data[i]._id + " " + userId)
    if (data[i].lat) {

      position = {
        lat: data[i].lat,
        lng: data[i].lon
      }
    };

    if (data[i].role == 'receiver' && data[i]._id != userId) {
      var svgMarkup =
        '<svg xmlns="http://www.w3.org/2000/svg" x="1" y="1" width="40" height="40" viewBox="0 0 263.335 263.335"><path d="M40.479,159.021c21.032,39.992,49.879,74.22,85.732,101.756c0.656,0.747,1.473,1.382,2.394,1.839   c0.838-0.396,1.57-0.962,2.178-1.647c80.218-61.433,95.861-125.824,96.44-128.34c2.366-9.017,3.57-18.055,3.57-26.864 C237.389,47.429,189.957,0,131.665,0C73.369,0,25.946,47.424,25.946,105.723c0,8.636,1.148,17.469,3.412,26.28" fill="orange"/></svg>'
      var icon = new H.map.Icon(svgMarkup);
      marker = new H.map.Marker(position, { icon: icon });
      marker.setData(data[i].firstName + ' ' + data[i].lastName + ' heeft hulp nodig met' +
        ' <ul>' +
        '  <li> boodschappen</li>' +
        '</ul>' +
        ' <a href="' + data[i]._id + userId + '" target="_blank" class="newChat" id=' + data[i]._id + '> Start een gesprek</a>');
      group.addObject(marker);

    } else if (data[i].role == 'helper' && data[i]._id != userId) {
      var svgMarkup =
        '<svg xmlns="http://www.w3.org/2000/svg" x="1" y="1" width="40" height="40" viewBox="0 0 263.335 263.335"><path d="M40.479,159.021c21.032,39.992,49.879,74.22,85.732,101.756c0.656,0.747,1.473,1.382,2.394,1.839   c0.838-0.396,1.57-0.962,2.178-1.647c80.218-61.433,95.861-125.824,96.44-128.34c2.366-9.017,3.57-18.055,3.57-26.864 C237.389,47.429,189.957,0,131.665,0C73.369,0,25.946,47.424,25.946,105.723c0,8.636,1.148,17.469,3.412,26.28" fill="green"/></svg>'
      var icon = new H.map.Icon(svgMarkup);
      marker = new H.map.Marker(position, { icon: icon });
      marker.setData(data[i].firstName + ' ' + data[i].lastName + ' zou misschien kunnen helpen' +
        ' <a href=" ' + data[i]._id + userId + ' " target="_blank" class="newChat" id=' + data[i]._id + '> Start een gesprek</a>');
      group.addObject(marker);
    }
  }

  group.addEventListener('tap', function(evt) {
    // map.setCenter(evt.target.getGeometry());
    var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
      //       // read custom data
      content: evt.target.getData()
    });
    ui.addBubble(bubble)
    newChat()
  });
  map.addObject(group);
})

function newChat() {
  var newChat = document.querySelectorAll('.newChat')
  console.log('newChat1' + newChat)
  if (newChat) {
    for (i = 0; i < newChat.length; i += 1) {
      newChat[i].addEventListener("click", function() {
        //event.target.id gets id from html element
        console.log('new chat2' + event.target.id)
        socket.emit('newChat', {
          roomId: event.target.id + userId,
          userId: userId,
          contactUserId: event.target.id,
          userName: userName
        })
      })
    }
  }
}
const roomContainer = document.getElementById('room-container')


socket.on('enter-room', function(room, contactName) {
  const roomElement = document.createElement('div')
  const roomLink = document.createElement('a')
  roomLink.href = `/${room.room}`
  roomLink.innerText = room.contactName
  roomLink.target = "_blank"
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('room-created', function(room, contactName) {
  console.log('contactName' + room + room.contactName)
  if (room.room.includes(userId)) {
    const roomElement = document.createElement('div')
    const roomLink = document.createElement('a')
    roomLink.href = `/${room.room}`
    roomLink.innerText = room.contactName
    roomLink.target = "_blank"
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
  }
})


socket.on('setRoom', function(room) {
  console.log('contactName' + room + room.contactName)
  if (room.room.includes(userId)) {
    const roomElement = document.createElement('div')
    const roomLink = document.createElement('a')
    roomLink.href = `/${room.room}`
    roomLink.innerText = room.contactName
    roomLink.target = "_blank"
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
  }
})


geocode(platform);