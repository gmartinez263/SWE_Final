import { searchListings } from "./search.js";

// code from https://leafletjs.com/examples/quick-start/
let map = L.map('map').setView([51.505, -0.09], 13);
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

// layer group to hold all the markers
const markers = L.layerGroup();

// Listings
const listings = [
    {
      title: 'Cozy Studio Apartment',
      price_min: '$1200/month',
      description: 'Great view, close to shops!',
      lat: 33.8333,
      lng: -118.2812
    },
    {
      title: 'Modern Loft',
      price_min: '$1800/month',
      description: 'Lots of sunlight, near transit.',
      lat: 33.815,
      lng: -118.275
    },
    {
      title: 'Family Home',
      price_min: '$2500/month',
      description: '3 bed, 2 bath with backyard.',
      lat: 33.82,
      lng: -118.29
    }
  ];
  
  // marker function
  function addListingMarker(map, listing) {
    const { lat, lng, title, price_min, description } = listing;
    const popupContent = `
      <strong>${title}</strong><br>
      Price: ${price_min}<br>
      ${description || ''}
    `;
  
    markers.addLayer(L.marker([lat, lng]).bindPopup(popupContent))
    .addTo(map);
  }
  
  document.querySelector('.search-button').addEventListener('click', async (e) => {
    markers.clearLayers();

    // clear listings array
    listings.length = 0;

    // couldn't get it to work with concat so this awkwardly pushes an array into the listings array
    listings.push(await searchListings());

    // then this gets the first element of the listings array, which is the array that actually contains the listings
    listings[0].forEach(listing => {
      addListingMarker(map, listing);
    });
  });