
'use strict';

var watson = require('watson-developer-cloud');

var Property = require('../lib/property');
var SQLite = require('sqlite3').verbose();
var path = require('path');
var Rulengine = require('../lib/rulengine');
var NPL = require('../lib/npl');
var swearjar = require('swearjar');


var rule=new Rulengine();
var npl=new NPL();

var DevOpsWatson = function Constructor() {    
    console.log("DevOpsWatson");
    this.dbPath = path.resolve(process.cwd(), 'data', 'slackwatson.db');
    this.db = new SQLite.Database(this.dbPath);
};



module.exports = DevOpsWatson;

var credentials ={
  username: process.env['SERVICE_USERNAME'],
  password: process.env['SERVICE_PASSWORD'],
  version: 'v1',
  version_date: '2016-07-11'
}

var conversation = watson.conversation(credentials);

var doaicontext = {};
var haveaccess;
var attributes ={};
//welcome message
DevOpsWatson.prototype.welcomeMessage = function (user_question,reply_from_watson) {
   var database=this.db;
  console.log("I am in welcomeMessage");

var param ={
  input: {"text":""},
  workspace_id: process.env['WORKSPACE_ID']
}
    conversation.message(param,  function(err, response) {
      if (err) 
        console.log('error:', err);
      else {
               
           doaicontext=response.context;
           reply_from_watson(response.output.text[0]);         
            
      }  
       
    });
}




DevOpsWatson.prototype.conversation_service = function (user_question,reply_from_watson) {


    if(swearjar.profane(user_question.text)){ //check for profinity

      reply_from_watson("I don't respond to such questions as it contians \n" +JSON.stringify(swearjar.scorecard(user_question.text)));

    }else{
         


    /*   npl.classifyNPL(user_question.text,function(nplsatus){
     //   console.log(JSON.stringify(nplsatus, null, 2));
       });
*/



        var params ={
            input: {"text":user_question.text},
             context: doaicontext, 
             workspace_id: process.env['WORKSPACE_ID'] 
        }

          conversation.message(params,  function(err, response) {
                    if (err) 
                     {
                        console.log('error:', err);
                     } 
                    else {
                            try{

                    

                                                
                           if(response.context.takeAction==undefined){

                              
                                reply_from_watson(response.output.text[0]);                               
                                doaicontext=response.context;




                              }else{

                                rule.executeRule(user_question,response,function(details){
                             
                                reply_from_watson(details[0]);

                                response.context.takeAction=undefined;
                                doaicontext=response.context;                                    
                                doaicontext.haveaccess=details[1]; 

                                if(details[2]!=undefined && details[2].EmpID!=undefined)
                                doaicontext.EmpID=details[2].EmpID;

                                if(details[2]!=undefined && details[2].Email!=undefined)
                                doaicontext.Email=details[2].Email;

                               if(details[2]!=undefined && details[2].ManagerName!=undefined)
                                doaicontext.ManagerName=details[2].ManagerName; 

                                if(details[2]!=undefined && details[2].FirstName!=undefined)
                                doaicontext.FirstName=details[2].FirstName; 

                                 if(details[2]!=undefined && details[2].LastName!=undefined)
                                doaicontext.LastName=details[2].LastName; 

                                if(details[2]!=undefined && details[2].PhoneNo!=undefined)
                                doaicontext.PhoneNo=details[2].PhoneNo; 



                                        
                                }); 
                                 
                              }
                                

                            }catch(e){
                              console.log(" error ---" + e);
                                 reply_from_watson(response.output.text[0]);
                            }                
                    }  
             
              });
      


                               

    }

    
}

 