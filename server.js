var express = require("express");
var fs = require('fs');
var app = express();
 
app.use(express.static('models'));
 
//make way for some custom css, js and images
// app.use('/css', express.static(__dirname + '/public/css'));
// app.use('/js', express.static(__dirname + '/public/js'));
// app.use('/images', express.static(__dirname + '/public/images'));
app.get('/getfiles', function(req, res){
    var path = 'models';
    fs.readdir(path, function(err, items) {
        console.log(items);
        var object = {};
        object.files = items;
        res.send(object)

        for (var i=0; i<items.length; i++) {
            console.log(items[i]);
        }
    });
});

var server = app.listen(7080, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});