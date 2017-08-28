var restify =require('restify')
var getgreetings = require('./intents/greetings.js')
var builder =require('botbuilder') 
var requet = require('./request_db.js')
var connector = require('./app.js')
var request = require('request')
var checkdatbase = require('./api_db.js')

var server = restify.createServer({
    name:"myserver"
})
server.listen(process.env.port || process.env.PORT || 80, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
function local( req, res, next){
    res.send(200,'Bonjour')
    return next();
}
server.get ({path:'/', version:'0.0.1'},local)

// get data from the database 
server.get({path: '/accede/:Id',version:'0.0.1'}, requet);
// 
server.post('/api/messages', connector.listen());


var luisModeUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/89698598-dfd6-4421-8cdf-8a3f53441ec9?subscription-key=caea48e4e4e24c35a0f1f45d26b0bd5a&verbose=true&timezoneOffset=0&q='

var bot = new builder.UniversalBot(connector);
// Create and intent recognizer
var recognizer = new builder.LuisRecognizer(luisModeUrl);
var dialog = new builder.IntentDialog({recognizers:[recognizer]});

// Create the dialog
bot.dialog('/', dialog);

dialog.matches('Greetings',[
    function dialogue(session){
        session.send(getgreetings());
    }]);
dialog.matches(/^vérifie le lien/i, [
        function (session) {
            var msg = new builder.Message(session)
	            .text("Bonjour que souhaitez vous vérifiez")
	            .suggestedActions(
		            builder.SuggestedActions.create(
				    session, [
					    builder.CardAction.imBack(session, "getgreetings", "domain_name"),
					    builder.CardAction.imBack(session, "productId=1&color=blue", "emetteur"),
					    builder.CardAction.imBack(session, getgreetings(), "URL")
				]
			));
            session.send(msg);
        },
        function (session, results) {        
            checkdatbase(results.response,function(success, identif){
                if(!success) return session.send('cet url n\'appartient pas au domaine ');
            
                var message= ' l\'url '+results.response+ ' est bien reconnu vous pouvez consulter votre mail il appartient à '+identif.emet;
                
                session.send(message);
            });
        }
]);
dialog.onDefault(function(session){
	session.send('Désolé je n\'ai pas compris votre demande :(' );
});