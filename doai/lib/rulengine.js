
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
 


  if( S(doaiResponse).include( 'Predication for')){      
          var awsdevclient = new RestClient("dev"); 
          awsdevclient.getMLPrediction(param,function(status){
           // console.log(" status "+ JSON.stringify(status.Prediction.predictedScores));

             var exjson =status.Prediction.predictedScores;
             var score=0;
             var scoreKey="";
             for(var exKey in exjson) {
               // console.log("key:"+exKey+", value:"+exjson[exKey]);
                  if(score<exjson[exKey]) {
                    score=exjson[exKey];
                    scoreKey=exKey;

                  }
              }

         details("Prediction : Infrastructure can survive the load"  
                  + "\n No="+ (status.Prediction.predictedScores.no )
                  + "\n Yes=" + (status.Prediction.predictedScores.yes)
                  + "\n Algorithm=" + status.Prediction.details.Algorithm 
                  + "\n Predictive Model Type=" +status.Prediction.details.PredictiveModelType
                  + "\n Powered by AWS Machine Learning service\n\n"
                  + "\n 1. Enter 'exit' to  return to main menu"
                  + "\n 2. Enter 'predict' to enter new prediction ");
       });   
                 
     } else if( S(doaiResponse).include('aws environment status is')){          
       
          var awsdevclient = new RestClient("dev"); 
          awsdevclient.setEnvironmentDetails();
          awsdevclient.getEnvironmentDetails(function(status){
            var  message = " Total count of aws infrastructre components are as following \n EC2 instnaces :" +  status.ec2 ;
            message = message+ "\n S3 Buckets :  " +  status.s3 ;
            message = message+ "\n ELB's :  " +  status.elb ;
            message = message+ "\n SG :  " +  status.sg ;
            message = message+ "\n Volumes : " +  status.vol + " \n Enter 'exit' to retrun to menu";
            details(message);
         });   
            
     }else if( S(doaiResponse).include('aws ec2 status is')){        
       
          var awsdevclient = new RestClient("dev"); 
           awsdevclient.getEC2Count(function(status){
            var  message = "Total count of ec2 is  :" +  status + " \n Enter 'exit' to retrun to menu";
            details(message);
         });   
            
     }else if( S(doaiResponse).include('aws elb status is')){        
       
          var awsdevclient = new RestClient("dev"); 
           awsdevclient.getELBCount(function(status){
            var  message = "Total count of elb is  :" +  status + " \n Enter 'exit' to retrun to menu";
            details(message);
         });   
            
     }else if( S(doaiResponse).include('aws s3 status is')){        
       
          var awsdevclient = new RestClient("dev"); 
           awsdevclient.getS3Count(function(status){
            var  message = "Total count of elb is  :" +  status + " \n Enter 'exit' to retrun to menu";
            details(message);
         });   
            
     }else if( S(doaiResponse).include('aws sg status is')){        
       
          var awsdevclient = new RestClient("dev"); 
           awsdevclient.getSGCount(function(status){
            var  message = "Total count of sg is  :" +  status + " \n Enter 'exit' to retrun to menu";
            details(message);
         });   
            
     }else if( S(doaiResponse).include('createing adop stack')){      
      
          var awsdevclient = new RestClient("dev"); 
           awsdevclient.creatstack(record,function(status){
            var  message = status + " \n \n Enter 'exit' to retrun to menu";
            details(message);
         });   
            
     }else if( S(doaiResponse).include('can be assigned to resource')){   
      
            var awsdevclient = new RestClient("dev"); 
            awsdevclient.getMLPrediction(param,function(status){
             //console.log(" status "+ JSON.stringify(status.Prediction.predictedScores));

             var exjson =status.Prediction.predictedScores;
             var score=0;
             var scoreKey="";
             for(var exKey in exjson) {
               // console.log("key:"+exKey+", value:"+exjson[exKey]);
                  if(score<exjson[exKey]) {
                    score=exjson[exKey];
                    scoreKey=exKey;

                  }
              }
            //console.log("score:"+score+", scoreKey:"+scoreKey);
             details("Score: "+score +"\n Resource name : "+scoreKey);

           });   

         
            
     }else 

     /*if( param.convoId=="1"){

         var toolclient = new ToolClient();

        console.log(" param ---" + JSON.stringify(param, null, 2));           
          

         toolclient.checkAccess(param, function(status){
          details(status);
         })
     
         
     }else if( param.convoId=="2"){

         var toolclient = new ToolClient();
         toolclient.raiseSupportTicket(param, doaiResponse,function(status){
         details(status);

         })
    }else if(param.convoId=="4"){

         var toolclient = new ToolClient();
         toolclient.grantAccess(param,doaiResponse, function(status){
         details(status);

         })
    }*/
  else{
            
            details(response.response.output.text[0]);
     }
        
        
}

