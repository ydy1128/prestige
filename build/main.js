'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//===============EXPRESS SERVER SETUP===============
var app = (0, _express2.default)();
var port = 2929;

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());

app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));
app.use('/uploads', _express2.default.static('uploads'));
app.get('/hello', function (req, res) {
    return res.send('Hello CodeLab');
});

app.listen(port, function () {
    console.log('Express is listening to port', port);
});

//===============DEV SERVER SETUP===============
var devPort = 2828;

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    var config = require('../webpack.dev.config');
    var compiler = (0, _webpack2.default)(config);
    var devServer = new _webpackDevServer2.default(compiler, config.devServer);
    devServer.listen(devPort, function () {
        console.log('webpack-dev-server is listening to port', devPort);
    });
}

//===============DB Setup===============
var db = _mongoose2.default.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log('Connected to mongodb server');
});

_mongoose2.default.connect('mongodb://localhost/prestige', { useMongoClient: true });

//===============Session Store Setup===============
var MongoStore = require('connect-mongo')(_expressSession2.default);

//MongoDB Session
app.use((0, _expressSession2.default)({
    secret: 'Prestige$1$234', //Change it to Env var later
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db,
        ttl: 30 * 24 * 60 * 60 // create new session every 30 days
    })
}));
console.log('Session Storage Created');

//===============API ROUTING===============
app.use('/api', _routes2.default);
//support client side routing
app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, './../public/index.html'));
});

//===============SERVER ERROR HANDLING===============
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(app, 'app', 'server/main.js');

    __REACT_HOT_LOADER__.register(port, 'port', 'server/main.js');

    __REACT_HOT_LOADER__.register(devPort, 'devPort', 'server/main.js');

    __REACT_HOT_LOADER__.register(db, 'db', 'server/main.js');

    __REACT_HOT_LOADER__.register(MongoStore, 'MongoStore', 'server/main.js');
}();

;