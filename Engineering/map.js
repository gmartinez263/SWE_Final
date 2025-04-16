// code from https://leafletjs.com/examples/quick-start/
                                //latitude, longitude, zoom view
let map = L.map('map').setView([33.8314, -118.2812], 13); // Center on Carson

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Lock view to Carson area
let bounds = L.latLngBounds(
    [33.79, -118.33],  // Southwest corner
    [33.87, -118.23]   // Northeast corner
);
map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});