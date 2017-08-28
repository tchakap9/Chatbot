var mysql = require('mysql');
var config = require('./config.js')
con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:config.MySqlPassword,
    database: "mydb"
});

function obtenirUrl(req,res,next){
     con.query('SELECT * FROM identification WHERE URL="'+req.params.Id+'"' ,  function(error,results){
        if (error) throw error;
        var resultat= {"donnees":results}
        res.send(200,  resultat);
        return next();
    });
}

module.exports = obtenirUrl