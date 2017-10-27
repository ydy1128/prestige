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
const port = 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './../public')));

app.get('/hello', (req, res) => {
    return res.send('Hello CodeLab');
});

app.listen(port, () => {
    console.log('Express is listening to port', port);
});

//===============DEV SERVER SETUP===============
const devPort = 4000;

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
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { 
	console.log('Connected to mongodb server'); 
});

mongoose.connect('mongodb://localhost/prestige');

//MongoDB Session
app.use(session({
    secret: 'Prestige$1$234', //Change it to Env var later
    resave: false,
    saveUninitialized: true
}));


app.use('/api', api);