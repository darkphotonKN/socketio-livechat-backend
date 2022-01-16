const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  transports: ['polling'],
  cors: {
    // the server that will be calling our socket server
    origin: '*',
  },
});

const PORT = 4040;

io.on('connection', async (socket) => {
  console.log(`User ${socket.id} has connected..`);

  const { data } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts'
  );

  const finalData = [];
  for (let i = 0; i < 100; i++) {
    for (item of data) {
      finalData.push(item);
    }
  }
  console.log('finalData:', finalData);

  finalData.forEach((item, index) => {
    setTimeout(
      () => socket.emit(item?.body, 'message from server'),
      Math.random() * 10 * index * 1000
    );
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected..`);
  });
});

app.use(cors());

server.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

// harm in terms of how we think of ourselves.
