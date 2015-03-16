(function() {
    /**
     * Module dependencies.
     */

    var express = require('express'),
        http = require('http'),
        https = require('https'),
        path = require('path'),
        fs = require('fs'),
        _ = require('underscore');

    // Initialize log and add a transport file 
    var app = express();
    // Set this in all environments

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {
        layout: true
    });
    app.set('port', process.env.PORT || 8888);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' === process.env.environment) {}

    app.use(express.errorHandler());

    // Routes for all supported Identity Api's 
    // etc 


    var index = require('./routes/index.js')(app, _);

    http.createServer(app).listen(app.get('port'), function() {
        console.info('Express server listening on port ' + app.get('port'));
    });


}).call(this);