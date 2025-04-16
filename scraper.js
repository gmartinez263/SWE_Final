const {Builder, By, until}= require('selenium-webdriver');
const {createClient} = require('@supabase/supabase-js');
const chrome = require('selenium-webdriver/chrome');
const path=require('path');
const fs=require('fs');

const supabaseUrl = 'https://smdxjawlbbmowsptrieo.supabase.co';
// this is the public anon key
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZHhqYXdsYmJtb3dzcHRyaWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NTE5NzEsImV4cCI6MjA1ODUyNzk3MX0.0VrOaSvG_SXSK77EkbHb_VSOfYYkR3qXY7ltIoZ1C2w";
const supabase = createClient(supabaseUrl, supabaseKey);

class scraper{
    static options;

    static{
        this.options = new chrome.Options();

        this.options.addArguments('--headless');
        this.options.addArguments('--disable-gpu');
        this.options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    }

    // clean any data that's a numerical range
    static async cleanNumericalRange(rawData) {
        // too annoying to do the other way around so i split it first and then removed nondigit characters from each half individually

        // split data into min and max
        let [minData, maxData] = rawData.split("-");

        // temp fix for handling studios for now (maybe we let beds be string in the db idk)
        if (minData.toLowerCase().includes("studio"))
            minData = "1";

        // remove all nondigit characters
        minData = minData.replaceAll(/\D/gi, "");
        maxData = maxData.replaceAll(/\D/gi, "");

        // return min and max data as array of numbers
        return [Number(minData), Number(maxData)];
    }

    // split the address into street, city, state, and zip
    static async cleanAddress(rawAddress) {

    }

    static async scrapeListings(){
        let aptDriver;

        //creates a instance of a chrome driver
        try{
            console.log("initializing driver");
            aptDriver = await new Builder().forBrowser('chrome').setChromeOptions(this.options).build();
        }catch(e){
            console.log('failed to initialize driver');
        }

        //navigates to the listings page to be scraped
        console.log("navigating to listings page");
        const url= 'https://www.apartments.com/carson-ca/';
        await aptDriver.get(url);
        await aptDriver.wait(until.elementLocated(By.id('placardContainer')), 20000);
        console.log("gathering listings");
        let apts = await aptDriver.findElement(By.id('placardContainer'));

        await aptDriver.wait(until.elementsLocated(By.css('li.mortar-wrapper')), 10000);
        let buildings = await  apts.findElements(By.css('li.mortar-wrapper'));

        let propType, address, bedsMin, bedsMax, priceMin, priceMax, amen, amenList, amenString;
        try{
            // testing using just one building -- reinstate for loop when it's all working
            // for(let building of buildings){
            let building = buildings[0];
                console.log('scraping building');
                propType = await building.findElement(By.className('property-title')).getAttribute('title');
                address = await building.findElement(By.className('property-address')).getText();
                [priceMin, priceMax] = await scraper.cleanNumericalRange(await building.findElement(By.className('property-pricing')).getText());
                [bedsMin, bedsMax] = await scraper.cleanNumericalRange(await building.findElement(By.className('property-beds')).getText());
                amenList = await building.findElement(By.className('property-amenities')).findElements(By.css('span'));
                amen = await Promise.all(amenList.map(async (amenity) => await amenity.getAttribute('textContent')));
                amenString = amen.join(', ');

                console.log('writing to supabase');
                // commented out the stuff we dont have infor for yet
                const {data, error} = await supabase
                .from('building')
                .insert([
                    {
                        title: propType,
                        // housing_type: propType,
                        //      just chucking the whole address into the street address field for now
                        street_address: address,
                        price_min: priceMin,
                        price_max: priceMax,
                        // squarefeet_min: 0,
                        // squarefeet_max: 0,
                        beds_min: bedsMin,
                        beds_max: bedsMax,
                        // baths_min: 0,
                        // baths_max: 0,
                    },
                ]);
                if(error){
                    console.log('Supabase Error: ', error);
                }else{
                    console.log('Data inserted successfully:', data);
                }
            // }

        }catch(err){
            console.log('error: ' + err);
            await aptDriver.quit();
        }
    }

    

    static sleep(time){
        let sec = time * 1000;
        return new Promise(resolve => setTimeout(resolve, sec));
    }


    update(){

    }
}

scraper.scrapeListings();