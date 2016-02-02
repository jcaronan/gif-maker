var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var gcloud = require('gcloud');

var datastore = gcloud.datastore;
var dataset = datastore.dataset({
  projectId: 'gif-maker-1204',
  apiEndpoint: 'http://localhost:8080'
});
var gcs = gcloud.storage({
  projectId: 'gif-maker-1204'
});

var album = gcs.bucket('gif-bucket');

app.use(express.static(__dirname + '/view'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/script'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 


app.get('/',function(req,res){
  res.sendFile('index.html');
  //It will find and locate index.html from view
});

app.post('/save', function (req, res) {
	  console.log(req.body);
	var key = dataset.key('Gif');
  	dataset.save({
    	key: key,
    	data: req.body
 	 }, function (err) {
    	console.log("\n\n\n\nERROOOOOOOOR!!!!");
    	console.log(err);
 	 });

    album.acl.add({
      entity: 'allUsers',
      role: gcs.acl.READER_ROLE
    }, function(err, aclObject) {});

    album.acl.default.add({
      entity: 'allUsers',
      role: gcs.acl.READER_ROLE
    }, function(err, aclObject) {});

    var options = {
      destination: 'new-image.gif',
      resumable: true
    };

    bucket.upload(req.body, options, function(err, file) {
      console.log(err);
    });

  res.end();
});


app.listen(3000);

console.log("Running at Port 3000");