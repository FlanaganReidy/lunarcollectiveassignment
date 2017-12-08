const mongoose = require('mongoose');

const textBlockSchema = new mongoose.Schema({
title: {type: String, required: true, unique: true},
textBody: {type: String, required:true},
});

const textBlock = mongoose.model('textblock', textBlockSchema);

module.exports = textBlock;
