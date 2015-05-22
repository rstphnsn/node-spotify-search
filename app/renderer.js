var fs = require('fs');

function mergeValues (content, values) {
    for (var key in values) {
        content = content.replace('{{' + key + '}}', values[key]);
    }
    return content;
}

function displayResults (response, items) {
    var albumList = '',
        albumFragment = fs.readFileSync('./views/fragments/album.html', {encoding: 'utf8'});
    for (var item in items) {
        var values = {
            'name': items[item].name || '',
            'uri': items[item].uri || ''
        };
        if (items[item].images && items[item].images[0]) {
            values.image = items[item].images[0].url;
        } else {
            values.image = 'http://placebear.com/640/640';
        }
        albumList += mergeValues(albumFragment, values);
    }
    response.write(albumList);
}

function view (templateName, response, values) {
    var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'});
    if (values) {
        fileContents = mergeValues(fileContents, values);
    }
    response.write(fileContents);
}

function results (templateName, response, values) {
    displayResults(response, values);
}

module.exports.view = view;
module.exports.results = results;