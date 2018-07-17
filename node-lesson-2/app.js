var express = require("express");
var utility = require("utility");

var app = express();

app.get('/', function (req, res) {
  var q = req.query.q;
  if (q) {
    res.send(utility.md5(q));
  } else {
    res.send("data empty");
  }
});

app.listen(3000, function (req, res) {
  console.log("app is running");
});