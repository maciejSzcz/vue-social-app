import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import config from './config/config.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import posts from './routes/posts.js';
import passport from './config/passport.js';
import authSocket from './middlewares/authSocket.js';
import commentListener from './listeners/commentListener.js';
import history from 'connect-history-api-fallback';
import dbConfig from './config/database.js';
import messagesListener from './listeners/messagesListener.js';

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

const io = new Server(app);

const __dirname = path.resolve();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(history());

io.use(authSocket());

commentListener(io);
messagesListener(io);

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api/auth', auth());
app.use('/api/users', users(io));
app.use('/api/posts', posts(io));

app.listen(config.server.port, () => {
  console.log(`Server started on port ${config.server.port}`);
});
