var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var gcloudConfig = {
  projectId: 'gif-maker-1204',
  keyFilename: 'gif-maker-256c5e36a0b8.json'
};
var gcloud = require('gcloud')(gcloudConfig);

//cloud storage
var gcs = gcloud.storage();
var albums = gcs.bucket('albums');

//cloud datastore
var datastore = gcloud.datastore;

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/script'));

// for parsing application/json
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.get('/',function(req,res){
  //It will find and locate index.html from view
  res.sendFile('index.html');
});

app.post('/save', function (req, res) {
  console.log("hjhsjhfkjsdf");

});

if (module === require.main) {
  // [START server]
  // Start the server
  var server = app.listen(process.env.PORT || 8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
  // [END server]
}

module.exports = app;
