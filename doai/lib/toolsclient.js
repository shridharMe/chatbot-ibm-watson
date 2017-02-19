
'use strict';

var request = require('request');
var storage = require('node-persist');
var unirest = require('unirest');
var PythonShell = require('python-shell');
var SpellChecker = require('simple-spellchecker');

//var DevOpsWatson = require('../lib/devopswatson');




var ddg = require('ddg');
var ToolsClient = function Constructor() {        
          storage.initSync();
          //storage.removeItemSync("runJenkinsJob");
  };

module.exports = ToolsClient;


//var watson = new  DevOpsWatson();

ToolsClient.prototype.runJenkinsJob  = function (url,status) { 
 
unirest.post(url)
  .header('Accept', 'application/json')
  .send({ "token": "79bb129c15a9304a12ebc0a62c7cdace" })
  .end(function (response) {
    console.log("response "+ response.body)
    if(response.body==undefined){
      status("Job started");
    }else{
       status("Job failed to start");
    }
  });


       
    
}

ToolsClient.prototype.getJiraBoards  = function (url,status) { 
 
  unirest.get(url)
    .header('Content-Type', 'application/json')
  .auth({
    username: 'shridhar.patil01',
    password: 'Smp422101',
    sendImmediately: true
  })
  .end(function (response) {
     if(response.body.values!=undefined){

       var boardDetails="following are the jira boards \n";
       for (var i=0 ;i <response.body.values.length;i++){
           boardDetails=boardDetails+"ID: "+response.body.values[i].id + " |  Name: " +response.body.values[i].name +"\n";
       }
       status(boardDetails);
      
     }else{
        status("no data found");
     }
   
     
  });
}
ToolsClient.prototype.getJiraIssues  = function (url,status) { 
 
 console.log(url);
  unirest.get(url)
    .header('Accept', 'application/json')
    .auth({
    username: 'shridhar.patil01',
    password: 'Smp422101',
    sendImmediately: true
  }).end(function (response) {
     if(response.body.issues!=undefined){

       var boardDetails="following are the jira issues \n";
       for (var i=0 ;i <response.body.issues.length;i++){
           boardDetails=boardDetails+"ID: "+response.body.issues[i].id + " |  Name: " +response.body.issues[i].key +" |  Status: " +response.body.issues[i].fields.status.name  +"\n";
       }
       status(boardDetails);
      
     }else{
        status("no data found");
     }
   
     
  });
       
    
}

ToolsClient.prototype.getJiraSprints  = function (url,status) { 
 
 
  unirest.get(url)
    .header('Accept', 'application/json')
    .auth({
    username: 'shridhar.patil01',
    password: 'Smp422101',
    sendImmediately: true
  }).end(function (response) {

    console.log(response.body);
     if(response.body.values!=undefined){

       var boardDetails="following are the jira sprints \n";
       for (var i=0 ;i <response.body.values.length;i++){
           boardDetails=boardDetails+"ID: "+response.body.values[i].id + " |  State: " +response.body.values[i].state +" |  Name: " +response.body.values[i].name +" \n |  StartDate: " +response.body.values[i].startDate +"\n |  EndDate: " +response.body.values[i].endDate +  "\n";
       }
       status(boardDetails);
      
     }else{ 
        status("no data found");
     }
   
     
  });
       
    
}

ToolsClient.prototype.searchWeb  = function (searchString,status) { 

    //duckducko search
    ddg.query(searchString, function(err, data){
       
         if(data.AbstractText!=undefined && data.AbstractText!='' ) {
           status(data.AbstractText)  
         }else
         {
            var toolsClient = new ToolsClient();
            toolsClient.searchBing(searchString,function(result){
                status(result);
              });
         }
    });
    
}

 ToolsClient.prototype.searchBing  = function (searchString,result) {
    var url ="https://api.cognitive.microsoft.com/bing/v5.0/search?q="+searchString+"&count=10&offset=0&mkt=en-us&safesearch=Moderate"
    unirest.get(url)
      .header('Accept', 'application/json')
      .header('Ocp-Apim-Subscription-Key', 'd8d2a72e03014cce994100c4c688a4b9')
      .end(function (response) {         
             if(response.body.webPages.value!=undefined){
                var searcResults="";
				console.log(response.body.webPages.value[0]);
                searcResults=searcResults + "Click on below URl for details: \n " +  response.body.webPages.value[0].displayUrl + "\n | " +response.body.webPages.value[0].snippet+  "\n\n";
                result(searcResults);            
             }else{ 
                result("no data found");
             }        
    });
 }

 ToolsClient.prototype.dictionary  = function (searchString,result) {
      SpellChecker.getDictionary("en-US", "./node_modules/simple-spellchecker/dict",function(err, dictionary) {
        if(!err) {
            var misspelled = ! dictionary.spellCheck(searchString);
            if(misspelled) {
                var suggestions = dictionary.getSuggestions(searchString);
                result("Do you mean /n" + suggestions);
            }else{
              result("true");
              var toolsClient = new ToolsClient();
                toolsClient.searchBing(searchString,function(status){
                result(status);
              });

            }
        }else{
            result(searchString);
        }
    });   
 }


  ToolsClient.prototype.weather  = function (url,result) {
      unirest.get(url)
      .header('Accept', 'application/json')
      .end(function (response) {
        console.log("response "+ response.body)
            if(response.body==undefined){
              result(response.body);
            }else{
              result("Job failed to start");
            }
      });
 }


 ToolsClient.prototype.checkAccess  = function (param,status) { 
 
    var body= JSON.stringify({user : param.username, service:param.service}, null, 2)

    unirest.post(param.url)
        .header('Accept', 'application/json')
        .send(body)
        .end(function (response) {
           
             var resBody=JSON.parse(response.body)
             var reply;
             if(resBody.code !== undefined && resBody.code==401){

              console.log(" response401 "+ param.response401);
              reply=[param.response401 ,resBody.access_result,resBody.attributes]  
                           
              status(reply);
           }else if(resBody.code!==undefined && resBody.code==200) {              
               console.log(" response200 "+ param.response200);
              reply=[param.response200  ,resBody.access_result, resBody.attributes]



               status(reply);

             }

        });

   
    
}

 ToolsClient.prototype.raiseSupportTicket  = function (param,doaiResponse,status) {


  var body= JSON.stringify({user : param.username, service:param.service}, null, 2)
   unirest.post(param.url)
        .header('Accept', 'application/json')
        .send(body)
        .end(function (response) {

         var resBody=JSON.parse(response.body)
         var reply;
         reply=[ doaiResponse + resBody.self+ "\n Do you want anything else?" ,param.haveaccess,undefined]  
         status(reply);

        });
}

ToolsClient.prototype.grantAccess  = function (param,doaiResponse,status) {


  var body= JSON.stringify({user : param.username, service:param.service}, null, 2)
   unirest.post(param.url)
        .header('Accept', 'application/json')
        .send(body)
        .end(function (response) {

         var resBody=JSON.parse(response.body)
         var reply;
         
         console.log(resBody.recommendations);
        // if(resBody.recommendations){

         param.recommendedApps=resBody.recommendedApps;
         reply=[resBody.message ,param.haveaccess,undefined] 

        // }else{
         // reply=[resBody.message,param.haveaccess,undefined] 
        // }
          

         status(reply);

        });
}