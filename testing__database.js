// this script drives database_tests.html
// when the button is clicked, two things happen
// 1. the contents of the building table are read and displayed
// 2. write a new row into the building table that only has housing_type filled in

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://smdxjawlbbmowsptrieo.supabase.co';
// this is the public anon key
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZHhqYXdsYmJtb3dzcHRyaWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NTE5NzEsImV4cCI6MjA1ODUyNzk3MX0.0VrOaSvG_SXSK77EkbHb_VSOfYYkR3qXY7ltIoZ1C2w";
const supabase = createClient(supabaseUrl, supabaseKey);

const button = document.getElementById("click-this");
let message = document.getElementById("text-output");


button.addEventListener("click", async (e) => {
    message.textContent = await getInfo();
});

async function getInfo() {
    // fetch data
    const { data, error } = await supabase
    .from('building')
    .select();

    if (error) {
        console.log(error)
    }
    else {
        // return data
        return JSON.stringify(data);
    }

    // write to database -- not super sure we even need the assignment??? i was just following the example
    const {aaa, err} = await supabase
    .from('building')
    .insert([
        { housing_type: 'Apartment'}
    ]);
}