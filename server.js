var restify = require('restify');
var siteLoader = require('./scripts/server/lib/controllers/siteLoader.js');

var server = restify.createServer();
var port = process.env.PORT || 8080;
server.use(restify.queryParser());
server.get('/sendEmail', siteLoader.sendEmail);
server.get('/getToken', siteLoader.getMapBoxAPIToken);
server.get('/.*', siteLoader.loadsite);
server.listen(port, function() { console.log('%s listening at %s', server.name, server.url); });