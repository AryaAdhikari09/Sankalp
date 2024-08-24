const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    readingAge: {
      type: String,
      required: true
    },
    correctWords: [{ type: String }],
    incorrectWords: [{ type: String }]
  });

const Result = mongoose.model('Result', resultSchema)

module.exports = Result