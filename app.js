var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const basicauth = require('basicauth-middleware');

var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var github = require('octonode');
var client;

app.use(basicauth(function(_username, _password) {
    // Your check function
    client = github.client({
        username: _username,
        password: _password
    });
    return true;
}));

app.get('/', function (req, res) {

    client.get('/repos/gs-immi/visa-reform/contents/api-spec/spec-list.json', {}, function (err, status, body, headers) {
        if(err){
            console.error(err)
        }

        request(body.download_url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            var links = ['<a href="/logout">Logout</a>'];
            var specs = JSON.parse(body);
            var resBody = '<html><body>';
            for (var i in specs){
                var spec = specs[i];
                links.push('<a href="/spec?org='+spec.org+'&repo='+spec.repo+'&path='+spec.path+'/'+spec.filename+'">'+spec.filename+'</a>');
            }
            for (var link in links){
                resBody = resBody.concat(links[link]);
                resBody = resBody.concat('<br/>');
            }
            resBody = resBody.concat('</body></html>')
            res.setHeader('Content-Type', 'text/html');
            res.end(resBody);
        })

    });


});

app.get('/spec', function (req, res) {
    var _org = req.query.org;
    var _repo = req.query.repo;
    var _path = req.query.path;
    
    client.get('/repos/'+_org+'/'+_repo+'/contents/'+_path, {}, function (err, status, body, headers) {
        if(err){
            console.error(err)
        }
        console.log(body.download_url)
        res.redirect('http://swagger.testpoint.io/?url='+ body.download_url.replace('=', '%3D'));
    });

});


app.get('/logout', function (req, res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var router = express.Router();



standardErrorMode = true;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());


app.use(express.static(__dirname + '/resources'));
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Request Path Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    var status = err.status || 500;
    res.status(status);
    var errMessage;
    try {
        errMessage = JSON.parse(err.message);
    } catch (e) {
        console.log("building error model for " + err.message);
        errMessage = {errors: [{"title": err.message}]};
    }
    //TODO: add error response validation agains json schema
    res.end(JSON.stringify(errMessage));

});


module.exports = app;
