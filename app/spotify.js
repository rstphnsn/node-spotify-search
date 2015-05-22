var EventEmitter = require('events').EventEmitter;
var https = require('https');
var util = require('util');

function Spotify (query) {
    'use strict';

    EventEmitter.call(this);
    var searchResultEmitter = this,
    request = https.get('https://api.spotify.com/v1/search?q=' + query + '&type=album', function (response) {
        var body = '';
        if (response.statusCode !== 200) {
            request.abort();
            searchResultEmitter.emit('error', new Error('There was an error getting the album ' + query + '. (' + http.STATUS_CODES[response.statusCode] + ')'));
        }

        response.on('data', function (chunk) {
            body += chunk;
            searchResultEmitter.emit('data', chunk);
        });

        response.on('end', function () {
            searchResultEmitter.emit('end', body);
        });

        response.on('error', function () {
            searchResultEmitter.emit('error', new Error('Spotify failure'));
        });

    });
}

util.inherits(Spotify, EventEmitter);

module.exports = Spotify;