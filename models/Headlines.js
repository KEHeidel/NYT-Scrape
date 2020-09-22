var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var headlineSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        required: false
    }

});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;