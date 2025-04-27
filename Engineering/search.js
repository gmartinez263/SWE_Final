import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://smdxjawlbbmowsptrieo.supabase.co';
// this is the public anon key
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZHhqYXdsYmJtb3dzcHRyaWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NTE5NzEsImV4cCI6MjA1ODUyNzk3MX0.0VrOaSvG_SXSK77EkbHb_VSOfYYkR3qXY7ltIoZ1C2w";
const supabase = createClient(supabaseUrl, supabaseKey);

const searchBar = document.querySelector('.search-bar');

export async function searchListings() {
    const { data, error } = await supabase
    .from('building')
    .select()
    .eq('city', searchBar.value);

    if (error) {
        console.log(error)
    }
    else {
        // return data
        return data;
    }
}