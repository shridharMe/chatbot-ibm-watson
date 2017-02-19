
'use strict';

var ChatBot = require('../lib/chatbot');
var Property = require('../lib/property');

// add your token and chatbot name
var token = process.env['SLACK_BOT_TOKEN'];
var name = process.env['SLACK_BOT_NAME'];

var dbPath = process.env.BOT_DB_PATH;


var chatbot = new ChatBot({
    token: token,
    dbPath: dbPath,
    name: name
});

chatbot.run();	