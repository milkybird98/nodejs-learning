var ul = require("url");
var cheerio = require("cheerio");
var superagent = require("superagent");
var eventproxy = require("eventproxy");
var async = require('async');

superagent.get("https://cnodejs.org/")
  .end(function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    let topicUrls = [];
    let $ = cheerio.load(res.text);

    $('#topic_list .topic_title').each(function (idx, element) {
      let $element = $(element);
      topicUrls.push(ul.resolve('https://cnodejs.org/', $element.attr('href')));
    });

    var ep = new eventproxy();

    ep.after('topics', topicUrls.length, function (allres) {
      let res = allres.map(element => {
        let url = element[0];
        let html = element[1];
        let htmlCom = element[2];
        let $ = cheerio.load(html);
        let $2 = cheerio.load(htmlCom);
        return {
          title: $('.topic_full_title').text().trim(),
          href: url,
          author: $('.user_card .user_name .dark').text().trim(),
          comment1: $('.reply_content').eq(0).text().trim(),
          score1: $2('.user_card [class="board clearfix"] .big').text().match(/[1-9][0-9]*/g)
        }
      });

      console.log(res);
    });
    console.log(topicUrls)
    async.mapLimit(topicUrls, 5, function (tpurl, callback) {
      superagent.get(tpurl)
        .end(function (err, res) {
          if (err) {
            console.error(err);
          }
          let $ = cheerio.load(res.text);
          let url = ul.resolve('https://cnodejs.org/', String($('[class="dark reply_author"]').eq(0).attr('href')));
          superagent.get(url)
            .end(function (err, resCom) {
              ep.emit('topics', [url, res.text, resCom.text]);
              callback(null, url);
            });
        });
    }, function (err, result) {
      console.log(result);
    });
  });