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

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('map'),
  defaultLayers.vector.normal.map, {
    zoom: 10,
    center: { lat: 52.379189, lng: 4.899431 }
  });

// Initialize the map: 


// Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);

// Add event listener:
map.addEventListener('tap', function(evt) {
  // Log 'tap' and 'mouse' events:
  console.log(evt.type, evt.currentPointer.type);
});

// Instantiate the default behavior, providing the mapEvents object:
var behavior = new H.mapevents.Behavior(mapEvents);

// Define a variable holding SVG mark-up that defines an icon image:
// var svgMarkup = '<svg width="24" height="24" ' +
//   'xmlns="http://www.w3.org/2000/svg">' +
//   '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
//   'height="22" /><text x="12" y="18" font-size="12pt" ' +
//   'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
//   'fill="white">H</text></svg>';

// Create an icon, an object holding the latitude and longitude, and a marker:
// var icon = new H.map.DomIcon(svgMarkup),
//   coords = { lat: 52.53075, lng: 13.3851 },
//   marker = new H.map.DomMarker(coords, { icon: icon });

// Add the marker to the map and center the map at the location of the marker:
// map.addObject(marker);
// map.setCenter(coords);






// Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
// ui.getControl('zoom').setEnabled(false)

// Create an info bubble object at a specific geographic location:
// var bubble = new H.ui.InfoBubble({ lng: 13.4, lat: 52.51 }, {
//   content: '<b>Hello World!</b>'
// });
// Add info bubble to the UI:
// ui.addBubble(bubble);

// Get an instance of the geocoding service:
// var service = platform.getSearchService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
// service.geocode({
//   q: '200 S Mathilda Ave, Sunnyvale, CA'
// }, (result) => {
//   // Add a marker for each location found
//   result.items.forEach((item) => {
//     map.addObject(new H.map.Marker(item.position));
//   });
// }, alert);

// Call the reverse geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
// service.reverseGeocode({
//   at: '52.5309,13.3847,150'
// }, (result) => {
//   result.items.forEach((item) => {
//     // Assumption: ui is instantiated
//     // Create an InfoBubble at the returned location with
//     // the address as its contents:
//     ui.addBubble(new H.ui.InfoBubble(item.position, {
//       content: item.address.label
//     }));
//   });
// }, alert);


// Call the "autosuggest" method with the search parameters,
// the callback and an error callback function (called if a
// communication error occurs):
// service.autosuggest({
//   // Search query
//   q: 'Chicago ORD',
//   // Center of the search context
//   at: '38.71014896078624,-98.60787954719035'
// }, (result) => {
//   let { position, title } = result.items[0];
//   // Assumption: ui is instantiated
//   // Create an InfoBubble at the returned location
//   ui.addBubble(new H.ui.InfoBubble(position, {
//     content: title
//   }));
// }, alert);












function addMarkerToGroup(group, coordinate, html) {
  var marker = new H.map.Marker(coordinate);
  // add custom data to the marker
  marker.setData(html);
  group.addObject(marker);
}
/**
 * Add two markers showing the position of Liverpool and Manchester City football clubs.
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param  {H.Map} map      A HERE Map instance within the application
 */


function addInfoBubble(map) {
  var group = new H.map.Group();
  map.addObject(group);
  // add 'tap' event listener, that opens info bubble, to the group
  group.addEventListener('tap', function(evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
    var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
      // read custom data
      content: evt.target.getData()
    });
    // show info bubble
    ui.addBubble(bubble);
  }, false);

  addMarkerToGroup(group, { lat: 53.439, lng: -2.221 },
    'Manchester City ' +
    'City of Manchester Stadium Capacity: 48, 000 ');

  addMarkerToGroup(group, { lat: 53.430, lng: -2.961 },
    'Liverpool ' +
    'Anfield Capacity: 45, 362 ');


  addMarkerToGroup(group, { lat: 52.379189, lng: 4.899431 },
    'Amsterdam');
}



addInfoBubble(map);