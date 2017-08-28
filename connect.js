var config = require('./config.js')
var builder = require('botbuilder');
// Create connector and bot

var connector = new builder.ChatConnector({
    appId: config.MICROSOFT_APP_ID,
    appPassword: config.MicrosoftAppPassword
});
var bot = new builder.UniversalBot(connector);

module.exports = connector
