var express = require('express'),
    querystring = require('querystring'),
    renderer = require('./app/renderer.js'),
    Spotify = require("./app/spotify.js"),
    app = express(),
    htmlHeaders = {
        'Content-Type': 'text/html'
    };

// Routing pages
app.get('/', function (request, response) {
    response.writeHead(200, htmlHeaders);
    renderer.view('includes/header', response, {'page_title': 'Homepage'});
    renderer.view('home', response);
    renderer.view('includes/footer', response);
    response.end();
});

app.post('/', function (request, response) {
    var searchTerm;
    request.on('data', function (postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303, {'Location': '/search/' + query.search.toLowerCase()});
        response.end();
    });
});

app.get('/search/:searchTerm', function (request, response) {
    response.writeHead(200, htmlHeaders);
    renderer.view('includes/header', response, {'page_title': request.params.searchTerm + ' | '});
    var searchResults = new Spotify(request.params.searchTerm);
    searchResults.on('end', function (data) {
        var jsonData = JSON.parse(data);
        renderer.view('includes/results-top', response, {'search_term': request.params.searchTerm});
        renderer.results('search', response, jsonData.albums.items);
        renderer.view('includes/results-bottom', response);
        renderer.view('includes/footer', response);
        response.end();
    });
});


// Static assets
app.use('/assets', express.static('assets'));


// 404 Page not found
app.use(function (request, response) {
    response.writeHead(404, htmlHeaders);
    renderer.view('includes/header', response, {'page_title': '404 Page not found | '});
    renderer.view('404', response);
    renderer.view('includes/footer', response);
    response.end();
});


// Kick off server - Heroku or local
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Spotify Search listening at ' + port);
