var request = require('request');
var restify = require('restify');
var builder = require('botbuilder');
var luisModeUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e211fd34-f2db-4d7e-9bee-899c8df06806?subscription-key=b63039c3be93437d8329007cb56bba72&verbose=true&timezoneOffset=0&q='

// Connector
var connectorAppId = '3d6b5d86-57ca-4888-9bb1-3da6b49c0149';
var connectorAppPassword ='N66aDPmbV1z61RyBAjj1Q1E';
//une ligne de commentaire

// Open Weather Map
var openWeatherMapAppId = '9d7f6218ca85a7772b5a032b6b3f9239';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create connector and bot
var connector = new builder.ChatConnector({
    appId: connectorAppId,
    appPassword: connectorAppPassword
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create the intent recognizer

var recognizer = new builder.LuisRecognizer(luisModeUrl);
var dialog = new builder.IntentDialog({recognizers:[recognizer]});
bot.dialog('/', dialog);
//Dialogs 
dialog.matches('GetWeather', [
	function(session, args, next){
		var city = builder.EntityRecognizer.findEntity(args.entities, 'Localisation');
		
	
		if (!city){
		builder.Prompts.text(session,'De quelle ville voulez-vous connaitre la météo?');
		}else{
		next({response: city.entity});
		}
	},
	function(session, results){
		openweathermap(results.response,function(success, previsions){
			if (!success)return session.send('Désolé je ne connais pas cette ville, veuillez réessayer avec une autre.');
			var message = 'Voici la meteo pour ' + results.response +':\n\n' + '_Temperature : '+ previsions.temperature + '°C\n\n' + '_Humidite : '+previsions.humidity +'%\n\n' + '_Vent : ' + previsions.wind +'km/h';
			session.send(message);
		});
	}
]);
dialog.onDefault(function(session){
	session.send('Je n\'ai pas compris votre demande, demandez moi la météo');
});

var openweathermap = function(city, callback){
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&lang=fr&units=metric&appid=' + openWeatherMapAppId;
    
    request(url, function(err, response, body){
        try{        
            var result = JSON.parse(body);
            
            if (result.cod != 200) {
                callback(false);
            } else {
                var previsions = {
                    temperature : Math.round(result.main.temp),
                    humidity : result.main.humidity,
                    wind: Math.round(result.wind.speed * 3.6),
                    city : result.name,
                };
                        
                callback(true, previsions);
            }
        } catch(e) {
            callback(false); 
        }
    });
}

