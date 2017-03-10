
'use strict';

var unirest = require('unirest');

 
var RestClient = function Constructor(environment) { 
    console.log("RestClient");
  };


module.exports = RestClient;

 
RestClient.prototype.setEnvironmentDetails  = function () {
  var Request= unirest.get('http://localhost:8085/mumuchan/api/setenvcount'); 
    Request.end(function (response) {      
             setTimeout(function() {
             console.log( "Env details are set " + response.body); 
      }, 3000);   
    });
}

RestClient.prototype.getEnvironmentDetails  = function (details) {
  var Request= unirest.get('http://localhost:8085/mumuchan/api/envcount'); 
    Request.end(function (response) {     
    
        details(response.body.message);
    });

};
 

RestClient.prototype.agresourceID = function (tagname,agname){ 
  var Request= unirest.get('http://localhost:8085/mumuchan/api/agresourceid?tagname='+tagname); 
  Request.end(function (response) {   
     agname(response.body.message);
  }); 
      
}


RestClient.prototype.creatstack = function (param,agname){
var Request= unirest.post('http://localhost:8085/mumuchan/api/createstack');
Request.headers({'Accept': 'application/json', 'Content-Type': 'application/json'});
Request.send(param);
   Request.end(function (response) {
      agname(response.body.message);
    });
  
      
}

RestClient.prototype.getMLPrediction = function (param,agname){
var Request= unirest.post('http://localhost:8085/mumuchan/api/doaiMachineLearning');
Request.headers({'Accept': 'application/json', 'Content-Type': 'application/json'});
Request.send(param);
   Request.end(function (response) {
      agname(response.body.message);
    });
  
      
}

RestClient.prototype.getEC2Count  = function (details) {
  var Request= unirest.get('http://localhost:8085/mumuchan/api/ec2count'); 
    Request.end(function (response) {        
        details( response.body.message);
    });

};

RestClient.prototype.getS3Count  = function (details) {
  var Request= unirest.get('http://localhost:8085/mumuchan/api/s3count'); 
    Request.end(function (response) {        
        details( response.body.message);
    });

};

RestClient.prototype.getELBCount  = function (details) {
  var Request= unirest.get('http://localhost:8085/mumuchan/api/elbcount'); 
    Request.end(function (response) {        
        details( response.body.message);
    });

};

RestClient.prototype.getSGCount  = function (details) {
  var Request= unirest.get('http://localhost:8085/mumuchan/api/sgcount'); 
    Request.end(function (response) {        
        details( response.body.message);
    });

};