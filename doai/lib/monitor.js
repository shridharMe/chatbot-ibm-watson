
'use strict';

var Monitor = require('ping-monitor');
 
 var MonitorURL = function Constructor() {   
    winston.log("MonitorURL");    
};

module.exports = MonitorURL;


 
var myWebsite = new Monitor({
    website: 'http://www.google.com',
    interval: 1
});
 
 
myWebsite.on('error', function (msg) {
    console.log(msg);
});
 
 
myWebsite.on('up', function (res) {
    console.log('Yay!! ' + res.website + ' is up.');
});
 
 
myWebsite.on('down', function (res) {
    console.log('Oh Snap!! ' + res.website + ' is down! ' + res.statusMessage);
});
 
 
// this event is required to be handled in all Node-Monitor instances
myWebsite.on('error', function (res) {
    console.log('Oh Snap!! An unexpected error occured trying to load ' + res.website + '!');
    myWebsite.stop();
});
 
 
myWebsite.on('stop', function (website) {
    console.log(website + ' monitor has stopped.');
});
 
