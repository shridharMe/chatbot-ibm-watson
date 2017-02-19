

'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');
var changeCase = require('change-case');
var S = require('string');
var Property = require('../lib/property');


 
 

var Rulengine = require('../lib/rulengine');
var DevOpsWatson = require('../lib/devopswatson');

var url = require('url');
var http = require('http');
var rule=new Rulengine();


var ChatBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || properties.SlackBotName;
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'slackwatson.db');
    this.user = null;
    this.db = null;    
};




// inherits methods and properties from the Bot constructor
util.inherits(ChatBot, Bot);

module.exports = ChatBot;

var validkeyword=[];

ChatBot.prototype.run = function () {
    ChatBot.super_.call(this, this.settings);
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

ChatBot.prototype._onStart = function () {

     this._loadBotUser();
     this._connectDb();
     this._firstRunCheck();
};

ChatBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
            return user.name === self.name;
    })[0];
};


ChatBot.prototype._connectDb = function () {
     if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }
    this.db = new SQLite.Database(this.dbPath); 

};

ChatBot.prototype._firstRunCheck = function () {
    var self = this;     
     self._welcomeMessage();
};


ChatBot.prototype._welcomeMessage = function () {
  var self = this; 
  var watson = new DevOpsWatson();
  var question ={
    text:"",
    user:"shridhar"
  }

    this.users.forEach(function(user){                  
 
      if (user.name=='shridhar.patil'|| user.name=='shridhar'){
       console.log("*************** "+ user.name);
        watson.welcomeMessage(question,function(conversion){
          self.postMessageToUser(user.name, conversion,{as_user: true});
        });
      }
                        
    });    

 
 
  
};

 
ChatBot.prototype._onMessage = function (message) {

    if(Boolean(message.text)){   
      
       if (this._isChatMessage(message) &&  this._isChatBotChannelConversation(message) && !this._isFromChatBot(message) && this._isMentioningDevOps(message))      {
            //message send to chatbot
            this._replyToUserWithDevOpsTask(message);         
       }else{
        console.log("Hello chum");
       }  
    };

};

ChatBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

ChatBot.prototype._isChannelConversation = function (message) { 
       return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

ChatBot.prototype._isChatBotChannelConversation = function (message) { 
      return typeof message.channel === 'string' &&
        message.channel[0] === 'D';
};

ChatBot.prototype._isFromChatBot = function (message) {
       return message.user === 'U1E622PEW';
};


ChatBot.prototype._isMentioningDevOps = function (message) {
   return true;  
};

ChatBot.prototype._replyToUserWithNoAnswer = function (message,reply) {
      var self = this;  
      var messageUsername
      self._getUserById(message.user,function(username){
        messageUsername=username;
      });  




      self.postMessageToUser(messageUsername, "Sorry I don't understand that... ! remember I am DevOps Bot...",{as_user: true});
 };


 ChatBot.prototype._replyToChannelWithNoAnswer = function (message) {
      var self = this;  
     self.postMessageToChannel(this.channels[1].name.toLowerCase(),  "Sorry I don't understand that... ! remember I am DevOps Bot...",{as_user: true});
 };


 
ChatBot.prototype._replyToUserWithDevOpsTask = function (message) {
   var self = this;    
   var messageUsername;
   self._getUserById(message.user,function(username){
       messageUsername=username;
      });   
   
    self.getResponseFromChatBot(message,function(botReply){           
           self.postMessageToUser(messageUsername, botReply,{as_user: true});
         }); 
    
  };

ChatBot.prototype._replyToChannelWithDevOpsTask = function (originalMessage) {
    var self = this;
    self.postMessageToChannel(this.channels[1].name.toLowerCase(), " please contact shridhar patil",{as_user: true});
 };

ChatBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

ChatBot.prototype._getUserById = function (userid,username) {    
            this.users.forEach(function(user){  
               if (userid==user.id){
                  username(user.name);
                }          
          });    
};


ChatBot.prototype.getResponseFromChatBot = function (question, reply) { 
   var self = this;  

  var messageUsername;
    self._getUserById(question.user,function(username){
        messageUsername=username;
      });   
  
     self._isUserAuthorized(messageUsername,function(isAuthorized){
          
            if(!isAuthorized){ //user is not authorized
                 reply( 'Hi ' + messageUsername +"\n Do I know you ? Sorry! I don't chat with strangers");
               }else{ //user is  authorized                     
                          question.user=messageUsername;
                          self._chatResponse(question,function(chatresponse){
                            reply(chatresponse);
                          });
                  }   
     });
    
}



ChatBot.prototype._chatResponse = function(question,chatresponse){
      var self = this;  
      var watson = new DevOpsWatson();      
      watson.conversation_service(question,function(reply_from_watson){
          chatresponse(reply_from_watson);
      });    

}                  

ChatBot.prototype._isUserAuthorized = function(messageUsername, isAuthorized){
   var self = this;  
   self.db.get('SELECT * FROM accesscontrol WHERE allowuser ="'+messageUsername+'"', function (err, record) {
         if(record!==undefined){
            isAuthorized(true);     
           }else{
            isAuthorized(false);        
         }
    });

}