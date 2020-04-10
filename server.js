const express = require('express')
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path')
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// connection event from a browser
io.on('connection', function(socket) {
  console.log('a user connected', socket.id);
  socket.broadcast.emit('newUser', socket.id);

  // disconnection event from a browser
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  // Lisen for event 'setUsername' from the client
  socket.on('setUsername', function(data) {
    socket.username = data;
    io.emit('setUsername', data.id, data.username); //Sends message to all sockets
  });

  // Lisen for event 'chat message' from the client
  socket.on('setMessage', function(data) {
    if (socket.username) {
      io.emit('setMessage', data.message, socket.username.username);
    } else { io.emit('setMessage', data.message) }
  });

  // Lisen for event 'hangman' from the client
  socket.on('hangman', function(data) {
    if (socket.username) {
      io.emit('hangman', data.hangman, socket.username.username);
    } else {
      io.emit('hangman', data.hangman)
    }
  });
});

http.listen(PORT, function() {
  console.log(`You're listening to port:${PORT}`);
})