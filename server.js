const express = require('express')
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path')
const PORT = process.env.PORT || 3000;

// app.use(express.static('static'));
// app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
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

http.listen(PORT, function() {
  console.log(`You're listening to port:${PORT}`);
})