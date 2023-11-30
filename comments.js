// Create web server

var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var comments = [];

function handleRequest(req, res) {
    var url_parts = url.parse(req.url, true);
    var path = url_parts.pathname;
    var query = url_parts.query;

    switch (path) {
        case '/':
            displayForm(res);
            break;
        case '/comment':
            if (req.method == 'POST') {
                processComment(req, res);
            } else {
                displayForm(res);
            }
            break;
        case '/comments':
            displayComments(res);
            break;
        default:
            display404(res);
            break;
    }
}

function displayForm(res) {
    fs.readFile('form.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}

function processComment(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        var comment = qs.parse(body);
        comments.push(comment);
        displayComments(res);
    });
}

function displayComments(res) {
    var body = '<html><head><title>Comment Board</title></head>';
    body += '<body><h1>Comments</h1><ul>';
    comments.forEach(function(comment) {
        body += '<li>' + comment.comment + '</li>';
    });
    body += '</ul></body></html>';
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(body);
    res.end();
}

function display404(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found.');
    res.end();
}

http.createServer(handleRequest).listen(8080);
console.log('Server listening on port 8080');