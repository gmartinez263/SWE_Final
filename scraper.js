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
        let minData, maxData;

        if (rawData.toLowerCase().includes("-")) {
            [minData, maxData] = rawData.split("-");
        }else{
            minData = rawData;
            maxData = rawData;
        }
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
        // format of a scraped address is:
        // "streetAddress, city, state zip"

        // split comma separated parts
        let [street, city, stateAndZip] = rawAddress.split(",");

        // remove leading whitespace
        city = city.trimStart();
        stateAndZip = stateAndZip.trimStart();

        // split state and zip
        let [state, zip] = stateAndZip.split(" ");

        return [street, city, state, zip];
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

        let propTitle, street, city, state, zip, bedsMin, bedsMax, priceMin, priceMax, sqrftMin, sqrftMax, bathMin, bathMax, amen, amenList, amenString;
        try{
            let i;
            await aptDriver.wait(until.elementsLocated(By.css('li.mortar-wrapper')), 10000);
            let buildings = await  apts.findElements(By.css('li.mortar-wrapper'));

            let building, length = buildings.length;
            for(let b = 0; b < length; b++){
                await aptDriver.wait(until.elementLocated(By.id('placardContainer')), 20000);
                apts = await aptDriver.findElement(By.id('placardContainer'));
                buildings = await  apts.findElements(By.css('li.mortar-wrapper'));
                console.log('listings page and buildings reloaded');
                building = buildings[b];
                console.log('clicked on listing: ' + b);
                [street, city, state, zip] = await scraper.cleanAddress(await building.findElement(By.className('property-address')).getText());
                propTitle = await building.findElement(By.className('property-title')).getAttribute('title');
                try{
                    amenList = await building.findElement(By.className('property-amenities')).findElements(By.css('span'));
                    amen = await Promise.all(amenList.map(async (amenity) => await amenity.getAttribute('textContent')));
                    amenString = amen.join(', ');
                }catch(e){
                    console.log('no amenities found for this building');
                    amenString = 'No amenities found';
                }
                

                building.click();
                console.log('clicked on building');
                await aptDriver.wait(until.elementLocated(By.className('priceBedRangeInfo')), 10000);
                let priceBedRange = await aptDriver.findElement(By.className('priceBedRangeInfo')); 

                i = 0;
                for(let info of await priceBedRange.findElements(By.className('rentInfoDetail'))){
                    if(i==0)
                        [priceMin, priceMax] = await scraper.cleanNumericalRange(await info.getText());
                    else if(i==1)
                        [bedsMin, bedsMax] = await scraper.cleanNumericalRange(await info.getText());
                    else if(i==2)
                        [bathMin, bathMax] = await scraper.cleanNumericalRange(await info.getText());
                    else if(i==3)
                        [sqrftMin, sqrftMax] = await scraper.cleanNumericalRange(await info.getText());
                    i++;
                }
                console.log('got building rent info');

                let lat = await aptDriver.findElement(By.css('meta[property="place:location:latitude"]')).getAttribute('content');
                let lng = await aptDriver.findElement(By.css('meta[property="place:location:longitude"]')).getAttribute('content');

                aptDriver.navigate().back();
                console.log('navigating back to listings page');

                console.log('waiting for listings page to load again');
                await aptDriver.wait(until.elementsLocated(By.css('li.mortar-wrapper')), 10000);
                

                console.log('writing to supabase');
                // commented out the stuff we dont have infor for yet
                const {data, error} = await supabase
                .from('building')
                .insert([
                    {
                        title: propTitle,
                        street_address: street,
                        city: city,
                        state: state,
                        zip: zip,
                        price_min: priceMin,
                        price_max: priceMax,
                        squarefeet_min: sqrftMin,
                        squarefeet_max: sqrftMax,
                        beds_min: bedsMin,
                        beds_max: bedsMax,
                        baths_min: bathMin,
                        baths_max: bathMax,
                        description: amenString,
                        lat: lat,
                        lng: lng,
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