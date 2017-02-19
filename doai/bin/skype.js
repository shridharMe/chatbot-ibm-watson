'use strict';

const DevOpsWatson = require('../lib/devopswatson');
const restify = require('restify');
const builder = require('botbuilder');
const prop = require('../lib/property');
const calling = require('botbuilder-calling');

// Initialize the BotService
var botService = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(botService);


const server = restify.createServer(); 
server.post('/api/messages', botService.listen());


const port = process.env.PORT || 9080;
server.listen(port);

server.listen(port, function () {
   console.log('%s listening to %s', server.name, server.url); 
});



var watson = new DevOpsWatson();
bot.dialog('/', function (session) {
      
       var question ={
          text:session.message.text
        }

    watson.conversation_service(question,function(conversion){                 
              console.log(conversion);
                     
             session.send(conversion);

         }); 
    } 
);
  
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;

       
        var question ={
          text:"",
          user:""
        }

         watson.welcomeMessage(question,function(conversion){

                 
              console.log(conversion);
              var reply = new builder.Message()
                    .address(message.address)
                    .text(conversion,name || 'there');
           
             bot.send(reply);

         }); 

    } else {
        // delete their data
    }
});




// Create calling bot
var callingConnector = new calling.CallConnector({
    callbackUrl: process.env.CALLBACK_URL,
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var callingBot = new calling.UniversalCallBot(callingConnector);


server.post('/api/calls', callingConnector.listen());


callingBot.dialog('/', 

  [function (session) {

        var question ={
          text:"",
          user:""
        }
        watson.welcomeMessage(question,function(conversion){                 
            session.send(conversion);     
             
         }); 
          
      },
       function (session, next) {

        console.log(session.address.conversation);

        /* var question ={
          text:"shridhar"
        }

      watson.conversation_service(question,function(conversion){                 
              console.log(conversion);
                     
             session.send(conversion);

         }); */
         next();
       }
     
  ]);


  