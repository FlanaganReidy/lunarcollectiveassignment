const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const TextBlock = requrie('./models/textblock.js');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/textblockdb');
const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');
const ObjectId = require('mongodb').ObjectID;


const app = express();

app.engine('mustache', mustacheExpress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/public', express.static(path.join(__dirname, '/public')));
app.set('views', './views');
app.set('view engine', 'mustache');

app.get('/', function(req,res){
res.render('index');
})
app.post('/', function(req,res){
const title = req.body.title;
const textBody = req.body.testBlock;
const textBlock = new TextBlock({
  title:title,
  textBody:textBody
});
textBlock.save()
.then(function(){
  return textBlock.find();
}).then(function(Blocks){
  res.render('index.mustache',{Blocks:Blocks})
}) .catch(function(error){
      console.log('error' + JSON.stringify(error));
      res.redirect('/')
    })


})


app.listen(3000, function(){
  console.log('Successfully started Express Application');
})

process.on('SIGINT', function() {
  console.log("\nshutting down");
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
