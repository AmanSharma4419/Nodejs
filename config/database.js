var mongoose = require("mongoose");
mongoose.connect("mongodb://13.59.30.160:27017/beautyapp2020", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("debug", true);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");
});
