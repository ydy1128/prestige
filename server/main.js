import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';

import api from './routes';

//===============EXPRESS SERVER SETUP===============
const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './../public')));
app.use('/uploads', express.static('uploads'));
app.get('/hello', (req, res) => {
    return res.send('Hello CodeLab');
});

app.listen(port, () => {
    console.log('Express is listening to port', port);
});

//===============DEV SERVER SETUP===============
const devPort = 2828;

if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening to port', devPort);
        }
    );
}

//===============DB Setup===============
let uriString = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/prestige';
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
	console.log('Connected to mongodb server');
});

mongoose.connect(uriString, { useMongoClient: true });

//===============Session Store Setup===============
const MongoStore = require('connect-mongo')(session);


//MongoDB Session
app.use(session({
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
app.use('/api', api);
//support client side routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

//===============SERVER ERROR HANDLING===============
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
