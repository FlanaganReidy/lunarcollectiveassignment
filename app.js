const express = require('express');
const mustacheExpress = require('mustache-express');

const path = require('path');
//this reads our form
const bodyParser = require('body-parser');
//this lets us make mongo conform
const mongoose = require('mongoose');
//our mongoos schema
const TextBlock = require('./models/textblock.js');
//our promise handler
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
  TextBlock.find()
  .then(function(Blocks){
    //let's see all our text blocks
    console.log("We're rerendering");
    res.render('index',{Blocks:Blocks})
  })
})


app.post('/', function(req,res){
//These target the fields in the form
const title = req.body.title;
const textBody = req.body.textBody;
const textBlock = new TextBlock({
  title:title,
  textBody:textBody
});
//save our new text block
textBlock.save()
.then(function(){
  //once it's saved, find all textblocks
  console.log("We're refinding");
  return TextBlock.find();
}).then(function(Blocks){
  //let's see all our text blocks
  console.log("We're rerendering");
  res.render('index',{Blocks:Blocks})
}).catch(function(error){
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
