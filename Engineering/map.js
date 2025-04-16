import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://smdxjawlbbmowsptrieo.supabase.co';
// this is the public anon key
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZHhqYXdsYmJtb3dzcHRyaWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NTE5NzEsImV4cCI6MjA1ODUyNzk3MX0.0VrOaSvG_SXSK77EkbHb_VSOfYYkR3qXY7ltIoZ1C2w";
const supabase = createClient(supabaseUrl, supabaseKey);

// code from https://leafletjs.com/examples/quick-start/
let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let searchButton = document.querySelector(".search-button");

searchButton.addEventListener('click', async (e) => {
    console.log('you clicked the search button');
    
    let carson = [33.827820, -118.272346];
    let addressInfo = await getAddress();
    map.setView(carson, 13);
    L.marker(carson).addTo(map)
        .bindPopup(addressInfo)
        .openPopup();
});

async function getAddress() {
    const { data, error } = await supabase
    .from('building')
    .select('street_address')
    .eq('city', 'Los Angeles');

    if (error) {
        console.log(error);
    }
    else {
        // return data
        return JSON.stringify(data);
    }
}