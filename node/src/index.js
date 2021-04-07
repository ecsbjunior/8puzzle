import express from 'express';
import http from 'http';
import * as socket from 'socket.io';

import fs from 'fs';
import { execFileSync } from 'child_process';

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const io = new socket.Server(server);

io.on('connection', (client) => {
  console.log('backend connected');
  
  client.on('execute', (data) => {
    const json = JSON.stringify(data);

    fs.writeFileSync('./src/8puzzleSDK/bin/input.json', json);
    
    execFileSync('8puzzle.exe', { cwd: 'src/8puzzleSDK/bin' });

    const puzzle = JSON.parse(fs.readFileSync('./src/8puzzleSDK/bin/output.json', { encoding: 'utf-8' }));

    io.emit('loadPuzzle', puzzle);
  });
});

server.listen(3333);
