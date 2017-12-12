const express = require('express');
//views package
const mustacheExpress = require('mustache-express');
//middleware to validate our user input
const expressValidator = require('express-validator');
const path = require('path');
const session = require('express-session');
//this reads our form
const bodyParser = require('body-parser');
//this is how we check if the conditions are met
const { check, validationResult } = require('express-validator/check');
//this lets us make mongo an ORM
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

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.get('/', function(req,res,next){
  TextBlock.find()
  .then(function(Blocks){
    //let's see all our text blocks
    console.log("We're rendering");
    if (req.session.error) {
      res.render('index',{Blocks:Blocks, error:req.session.error})
    }
    else{
      delete req.session.error;
      res.render('index',{Blocks:Blocks})
    }

  })
})

app.post('/',[check('textBody').isLength({min:5, max:500}).withMessage('Must be greater than 5 characters and less than 500')], function(req,res,next){

const errors = validationResult(req);
//if the middleware says there's an error
if (!errors.isEmpty()) {
  //sends us back home
  req.session.error = errors.mapped().textBody.msg;
  res.redirect('/')
}
else{
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
  }
})


app.listen(3000, function(){
  console.log('Successfully started Express Application');
})
//breaks connection with mongodb
process.on('SIGINT', function() {
  console.log("\nshutting down");
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
