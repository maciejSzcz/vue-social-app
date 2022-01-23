import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import fs from 'fs';
import https from 'https';
import bodyParser from 'body-parser';
import config from './config/config.js';
import auth from './routes/auth.js';
import passport from './config/passport.js';

// Connect to database
import dbConfig from './config/database.js';
import mongoose from 'mongoose';

// Configure passport
passport();

mongoose.connect(dbConfig.mongoUrl, dbConfig.settings);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', () => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
mongoose.connection.on('open', () => {
  console.log('App successfully connected to mongo database');
});

const app = express();

const server = https.createServer(
  {
    key: fs.readFileSync('./ssl/my.key'),
    cert: fs.readFileSync('./ssl/my.crt'),
  },
  app
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', auth());

server.listen(config.server.port, () => {
  console.log(`Server started on port ${config.server.port}`);
});
