var express = require('express');

var server = express();

server.use(express.static(__dirname + 'public'));

server.get('/css/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

server.get('/js/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

server.get('/fonts/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

server.get('/images/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

server.get('/storage/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

server.get('/version.txt', function(req, res) {
  res.sendFile(__dirname + '/public/version.txt');
});

server.all('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(process.env.PORT || 5000);
