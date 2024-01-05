import express from "express";
import router from './routes/router.js'
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import { dbConfig } from "./dbConfig/config.js";
import {Server, Socket} from 'socket.io'; 


dotenv.config();
dbConfig();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json())
app.use(cors());



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cookieParser());
app.use(bodyParser.json());

// handle cors to grant full access to the client api
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.options('*', cors());

app.use('/api',router);


io.on('connection', (socket) => {
  console.log('A user connected');

    socket.on('signup', (data) => {
      console.log(`Received signup event from user: ${data.username}`);
    });

    socket.on('login', (data) => {
      console.log(`Received login event from user: ${data.username}`);
      socket.emit('login_response', { message: 'Login successful on the server side' });
    });


    socket.on('verify', (data) => {
      console.log(`Received event user successfully verified : ${data.username}`);
    });

    socket.on('admin-signup', (data) => {
      console.log(`Received event admin user successfully sign up: ${data.username}`);
    });

    socket.on('admin-signin', (data) => {
      console.log(`Received event admin user successfully sign in : ${data.username}`);
      socket.emit('admin_login_response', { message: 'Login successful on the server side' });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
});

io.on('error', (error) => {
  console.error('WebSocket connection error:', error);
});


export { io };
server.listen(PORT, () => {
    console.log(`connected successfull and running on port ${JSON.stringify({server})}`)
})
