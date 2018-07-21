var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var app = express();

app.get("/",function (req,res,next){
  superagent.get('https://cnodejs.org/')
    .end(function (err,sres) {
      if (err) {
        return next(err);
      }    

      let $ = cheerio.load(sres.text);
      let item =[];

      $('#topic_list .topic_title').each(function (id,element) {
        let $element = $(element);
        item.push({
          title: $element.attr('title'),
          href: $element.attr('href')
        })
      })
      
      res.send(item);
    })
})

app.listen(3000,function () {
  
})