
'use strict';
 
var changeCase = require('change-case')
 
var S = require('string');
var RestClient = require('../lib/restclient');
var path = require('path');
var SQLite = require('sqlite3').verbose();
var ToolClient = require('../lib/toolsclient');

 
var Rulengine = function Constructor() {
  console.log("Rulengine");
};

module.exports = Rulengine;
 
Rulengine.prototype.executeRule = function (userQuestion,response,details){
 
  var doaiResponse=response.output.text[0];

  var param=response.context;
  var record=param.record;
 

        
  details(response.response.output.text[0]); 
}

