const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema(
  {
    crashPoint: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Result', ResultSchema);
