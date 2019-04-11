"use strict";
exports.__esModule = true;
var async = require("async");
var current_thread_num = 0;
var FetchURL = function (url, callback) {
    var delay = (Math.random() * 10000000) % 2000;
    current_thread_num++;
    console.log("num", current_thread_num, "fetch", url, "delay", delay);
    setTimeout(function () {
        current_thread_num--;
        callback(null, url + "some data");
    }, delay);
};
var urls = [];
for (var i = 0; i < 30; i++) {
    urls.push("http://test.domain/no_" + i);
}
async.mapLimit(urls, 5, function (url, callback) {
    FetchURL(url, callback);
}, function (err, result) {
    console.log(result);
});
