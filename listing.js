// defines a Listing class encapsulating a single rental housing listing
// basically interfaces with the database


// i just found out that the databae gives us back an array of JSONs wherea each JSON is a listing
// so unsure if we even need this anymore
// maybe if we ever want to modify a listing's data in the future it can be useful


export class Listing {
    // the only required parameter is id
    constructor(id, title=null, housingType=null, 
                streetAddress=null, city=null, state=null, zip=null, 
                priceMin=0, priceMax=0, 
                squareFeetMin=0, squareFeetMax=0, 
                bedsMin=0, bedsMax=0, 
                bathsMin=0, bathsMax=0) {
        
        this.id = id;
        this.title = title;
        this.housingType = housingType; 
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zip = zip; 
        this.priceMin = priceMin;
        this.priceMax = priceMax;
        this.squareFeetMin = squareFeetMin;
        this.squareFeetMax = squareFeetMax;
        this.bedsMin = bedsMin;
        this.bedsMax = bedsMax; 
        this.bathsMin = bathsMin;
        this.bathsMax = bathsMax;
    }

    // get title() {
    //     return this.title;
    // }

    // get housingType() {
    //     return this.housingType;
    // }

    // get streetAddress() {
    //     return this.streetAddress;
    // }

    // get city() {
    //     return this.city;
    // }

    // get state() {
    //     return this.state;
    // }

    // get zip() {
    //     return this.zip;
    // }

    // get priceMin() {
    //     return this.priceMin;
    // }

    // get priceMax() {
    //     return this.priceMax;
    // }

    // get squareFeetMin() {
    //     return this.squareFeetMin;
    // }

    // get squareFeetMax() {
    //     return this.squareFeetMax;
    // }

    // get bedsMin() {
    //     return this.bedsMin;
    // }

    // get bedsMax() {
    //     return this.bedsMax;
    // }

    // get bathsMin() {
    //     return this.bathsMin;
    // }

    // get bathsMax() {
    //     return this.bathsMax;
    // }

    toString() {
        return JSON.stringify(this);
    }
}