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
var bucket = gcs.bucket('gif-maker-1204.appspot.com');

//cloud datastore
var datastore = gcloud.datastore;

//Store all HTML files in view folder.
app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/script'));

// for parsing application/json
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/static', express.static('public'));


app.get('/',function(req,res){
  //It will find and locate index.html from view
  res.sendFile('index.html');
});

app.post('/upload', function (req, res) {

  console.log(req.body);
var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var fs = require('fs');

var encoder = new GIFEncoder(500, 500);
// stream the results as they are available into myanimated.gif
encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif'));

encoder.start();
encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
encoder.setDelay(100);  // frame delay in ms
encoder.setQuality(10); // image quality. 10 is default.

// use node-canvas
var canvas = new Canvas(500, 500);
var ctx = canvas.getContext('2d');

ctx.font = "30px Arial";
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

    for(var i = 0; i < req.body.text.length; i++) {

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 500, 500);
      ctx.fillStyle = "#000";
      ctx.fillText(req.body.topic,250,50);

      ctx.fillText(req.body.text[i],250,250);
      
      encoder.addFrame(ctx,{copy: true, delay: 50}); 
      ctx.clearRect(0, 0, 500, 500);
    } 

encoder.finish();

bucket.upload('myanimated.gif', function(err, file, apiResponse) {
  file.makePublic(function(err, apiResponse) {
    console.log(apiResponse);
  });
  var key = datastore.key('Gif');

  datastore.save({
    key: key,
    data: {
      serving_url: file.metadata.mediaLink
    }
  }, function(err) {
    console.log(key.path); // [ 'Company', 5669468231434240 ]
    console.log(key.namespace); // undefined
  });
    console.log(file.metadata.mediaLink);
});


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
