'use strict'

var fs = require("fs");
var readline = require("readline");
var readlineSync = require("readline-sync");
var path = require("path");

/*
var target;

rl.question("target?", function (tar) {
  target = tar;
  return;
});
*/
var scanpath = readlineSync.question('path?');
var target = readlineSync.question('target?');

fileDisplay(path.resolve(scanpath), target);

function fileDisplay(filePath, target) {
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.error(err);
    } else {
      files.forEach(function (fileName) {
        var fileDir = path.join(filePath, fileName);
        fs.stat(fileDir, function (err, stat) {
          if (err) {
            console.log(err);
          } else {
            if (stat.isFile()) {
              var readSteam = fs.createReadStream(fileDir);
              var rl1 = readline.createInterface({
                input: readSteam
              });
              var flag = true;
              rl1.on("line", (line) => {
                if ((line.indexOf(target) + 1) && flag) {
                  console.log(fileDir);
                  flag = false;
                  readSteam.destroy();
                  rl1.close();
                }
              });
              rl1.on("end",function(){
                readSteam.destroy();
                rl1.close();
              })
            } else if (stat.isDirectory()) {
              fileDisplay(fileDir, target);
            }
          }
        })
      });
    }
  });
}