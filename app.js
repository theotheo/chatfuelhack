var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs

var appId = process.env.CHATFUELBOT_ID
var appSecret = process.env.CHATFUELBOT_SECRET

var bot = new builder.BotConnectorBot({ appId: appId, appSecret: appSecret });
bot.add('/', function (session) {
    session.send('Hello World');
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(3999, function () {
    console.log('%s listening to %s', server.name, server.url); 
});