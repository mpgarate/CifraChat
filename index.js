var express = require("express");
var app = express();
var port = 8080;
 
/* used this http://stackoverflow.com/questions/4529586/
 * to put in ejs */ 
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.get("/", function(req, res){
    res.render("index.html");
});

app.listen(port);
console.log("Listening on port " + port);