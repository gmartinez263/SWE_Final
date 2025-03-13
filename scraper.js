const {Builder, By, Until}= require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path=require('path');
const fs=require('fs');

class Webscraper{
    static options = new chrome.Options();
    listings = [];
}