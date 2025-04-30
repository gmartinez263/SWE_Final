import { searchListings } from "./search.js";

// code from https://leafletjs.com/examples/quick-start/
let map = L.map('map').setView([33.83, -118.28], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// layer group to hold all the markers
const markers = L.featureGroup();

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
    const { lat, lng, title, zip, price_min, price_max, description, beds_min, beds_max, baths_min, baths_max, squarefeet_min, squarefeet_max } = listing;
    const popupContent = `
      <strong>${title} ${zip}</strong><br>
      Price: \$${price_min} - \$${price_max}/month<br>
      Beds: ${beds_min}-${beds_max}    Baths: ${baths_min}-${baths_max}<br>
      Square Feet: ${squarefeet_min} - ${squarefeet_max}<br>
      ${description || ''}
    `;
  
    markers.addLayer(L.marker([lat, lng]).bindPopup(popupContent))
    .addTo(map);
  }
  
  document.querySelector('.search-button').addEventListener('click', async (e) => {
    await search();
  });

  document.querySelector('.search-bar').addEventListener('keydown', async (e) => {
    if (e.key === "Enter") {
        await search();
    }
  });

  async function search() {
    markers.clearLayers();

    // clear listings array
    listings.length = 0;

    // couldn't get it to work with concat so this awkwardly pushes an array into the listings array
    listings.push(await searchListings());

    // then this gets the first element of the listings array, which is the array that actually contains the listings
    listings[0].forEach(listing => {
        addListingMarker(map, listing);
    });

    map.flyToBounds(markers.getBounds(), {duration: 0.75});
}