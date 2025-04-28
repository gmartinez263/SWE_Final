import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://smdxjawlbbmowsptrieo.supabase.co';
// this is the public anon key
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZHhqYXdsYmJtb3dzcHRyaWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NTE5NzEsImV4cCI6MjA1ODUyNzk3MX0.0VrOaSvG_SXSK77EkbHb_VSOfYYkR3qXY7ltIoZ1C2w";
const supabase = createClient(supabaseUrl, supabaseKey);

const searchBar = document.querySelector('.search-bar');
const budgetInput = document.querySelector('.budget-input-field');

export async function searchListings() {
    const cityOrZip = searchBar.value;
    const budget = (budgetInput.value == "") ? Number.MAX_SAFE_INTEGER : budgetInput.value;
    const {beds, baths} = await getBedsAndBaths();

    console.log('baths: ' + baths);

    // i hate how much repeated code there is but i dont know what to do about it
    // if we want to have the option to not filter by city/zip

    // if search field is empty, display listings from all cities/zip codes
    if (cityOrZip == "") {
      const { data, error } = await supabase
        .from("building")
        .select()
        .lte('price_min', budget)
        .gte('beds_min', beds)
        .gte('baths_min', baths)
        ;

      if (error) {
        console.log(error);
      } else {
        // return data
        return data;
      }
    }

    const { data, error } = await supabase
    .from('building')
    .select()
    .or(`city.eq.${cityOrZip}, zip.eq.${cityOrZip}`)
    .lte('price_min', budget)
    .gte('beds_min', beds)
    .gte('baths_min', baths);

    if (error) {
        console.log(error)
    }
    else {
        // return data
        return data;
    }
}

async function getBedsAndBaths() {
    const selectedBeds = document.querySelector('input[name="beds"]:checked');
    const selectedBaths = document.querySelector('input[name="baths"]:checked');

    const baths = (selectedBaths.value == "Any") ? 0 : Number(selectedBaths.value[0])
    const beds = (selectedBeds.value == "Any") ? 0 : Number(selectedBeds.value[0])
    

    return {baths: baths, beds: beds};
    
}