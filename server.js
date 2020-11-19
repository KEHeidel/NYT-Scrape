// sets up requires
var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var app = express();

var router = express.Router();

require("./config/routes")(router);

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(router);

// sets up mongoDB
// var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(db, function(error) {
//     if (error) {
//         console.log(error);
//     }
//     else {
//         console.log("mongoose connection is successful");
//     }
// });

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );

app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});