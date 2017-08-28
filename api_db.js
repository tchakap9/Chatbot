var request= require('request')
var checkdatbase = function(lien, callback){
    var url = 'http://localhost:8080/accede/'+ lien;
    console.log ("entrée")
    request(url, function(err, response, body){
        try{        
            var result = JSON.parse(body);
            var resultat= result.donnees[0].domain_name
            var longueur = result.donnees[0].length
            console.log(resultat)
            console.log(resultat)
            if (longueur == 0) {
                console.log("false");
                callback(false);
            } else {
                console.log("succès");
                var identif = {
                    nom_domain:result.donnees[0].domain_name,
                    emet :result.donnees[0].emetteur,
                    url: result.donnees[0].URL,
                    lien:result.URL,
                };
                        
                callback(true, identif);
            }
        } catch(e) {
            callback(false); 
        }
    });
}
module.exports = checkdatbase