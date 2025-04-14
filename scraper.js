const {Builder, By, until}= require('selenium-webdriver');
const {createClient} = require('@supabase/supabase-js');
const chrome = require('selenium-webdriver/chrome');
const path=require('path');
const fs=require('fs');

const SUPABASE_URL = 'https://smdxjawlbbmowsptrieo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZHhqYXdsYmJtb3dzcHRyaWVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjk1MTk3MSwiZXhwIjoyMDU4NTI3OTcxfQ.kQeaYd6bYH2MozXxGrwhg9iFRasuzPrVgTXYfbIkc8g';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    // Provide a custom schema. Defaults to "public".
    db: { schema: 'public' }
  })

class scraper{
    static options;

    static{
        this.options = new chrome.Options();

        this.options.addArguments('--headless');
        this.options.addArguments('--disable-gpu');
        this.options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
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

        let propType, address, beds, price, amen, amenList, amenString;
        try{
            for(let building of buildings){
                console.log('scraping building');
                propType = await building.findElement(By.className('property-title')).getAttribute('title');
                address = await building.findElement(By.className('property-address')).getText();
                price = await building.findElement(By.className('property-pricing')).getText();
                beds = await building.findElement(By.className('property-beds')).getText();
                amenList = await building.findElement(By.className('property-amenities')).findElements(By.css('span'));
                amen = await Promise.all(amenList.map(async (amenity) => await amenity.getAttribute('textContent')));
                amenString = amen.join(', ');

                console.log('writing to supabase');
                const {data, error} = await supabase
                .from('building')
                .insert([
                    {
                        housing_type: propType,
                        apartment_address: address,
                        price_min: price,
                        price_max: price,
                        squarefeet_min: 0,
                        squarefeet_max: 0,
                        beds_min: beds,
                        beds_max: beds,
                        baths_min: 0,
                        baths_max: 0,
                    },
                ]);
                if(error){
                    console.log('Supabase Error: ', error);
                }else{
                    console.log('Data inserted successfully:', data);
                }
            }

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