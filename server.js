const express = require('express')
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use(express.static('static'));
// app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html')
})

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function() {
  console.log("You're listening to *:3000, listener supported radio");
})