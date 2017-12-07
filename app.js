const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.listen(3000, function(){
  Console.log('Successfully started Express Application')
})
