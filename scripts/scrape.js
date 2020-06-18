var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {

    request("https://www.nytimes.com", function(err, res, body){

        var $ = cheerio.load(body);
        

        var articles = [];
        $(".css-6p6lnl").each(function(i, element){
            var head = $(this).find('h2').text().trim();
            var sum = $(this).find('p').text().trim();
            console.log("head:", head);
            console.log("sum:", sum);
            if(head && sum){
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dateToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };

                articles.push(dateToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;