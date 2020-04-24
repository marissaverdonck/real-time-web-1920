require('dotenv').config()
const express = require('express')
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path')
const PORT = process.env.PORT || 3000;
var mongo = require('mongodb')
var db = null
var bodyParser = require('body-parser')
const session = require('express-session')
var url = process.env.DB_HOST;
const sess = {
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
};

mongo.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  if (err) {
    throw err
  }
  db = client.db(process.env.DB_NAME)
})
app.use(session(sess));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/map', (req, res) => {
  if (!req.session.user) {
    res.redirect('/')

  } else if (req.session.user) {
    db.collection('grocery').find().toArray(part2);

    function part2(err, data) {
      allData = data;
      db.collection('grocery').findOne({
        _id: mongo.ObjectID(req.session.user.id)
      }, done3)

      function done3(err, data) {
        console.log('session!')
        console.log(data)
        res.render('map', {
          user: req.session.user,
          data: data
        });
      }
    }
  }
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/signup.html'));
})

app.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      next(err);
    } else {
      res.redirect('/');
    }
  })
})

app.post('/', (req, res) => {
  db.collection('grocery').findOne({
    email: req.body.email
  }, done);

  function done(err, data) {
    if (err) {
      next(err)
    }
    if (!data) {
      console.log("No user found with this email")
    } else {
      console.log(data._id)
      if (req.body.password === data.password) {
        console.log('password correct');
        req.session.user = { id: data._id };
        res.redirect('/map');
      } else {
        res.redirect('/');
        console.log('password incorrect');
      }
    }
  }
})

app.post('/signup.html', (req, res) => {
  console.log(req.body)

  db.collection('grocery').insertOne({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      street: req.body.street,
      number: req.body.number,
      zipcode: req.body.zipcode,
      city: req.body.city,
      role: req.body.role,
      email: req.body.email,
      password: req.body.password
    },
    done1
  )

  function done1(err, data) {
    console.log(data.insertedId)
      // console.log(req.session)
    req.session.user = { id: data.ops[0]._id }
      // res.sendFile(path.join(__dirname, 'views/map.html'));
    res.redirect('/map')
    console.log(req.session.user)
  }
})

// // connection event from a browser
// io.on('connection', function(socket) {
//   console.log('a user connected', socket.id);
//   socket.broadcast.emit('newUser', socket.id);

//   // disconnection event from a browser
//   socket.on('disconnect', function() {
//     console.log('user disconnected');
//   });

//   // Lisen for event 'setUsername' from the client
//   socket.on('setUsername', function(data) {
//     socket.username = data;
//     io.emit('setUsername', data.id, data.username); //Sends message to all sockets
//   });

//   // Lisen for event 'chat message' from the client
//   socket.on('setMessage', function(data) {
//     if (socket.username) {
//       io.emit('setMessage', data.message, socket.username.username);
//     } else { io.emit('setMessage', data.message) }
//   });

//   // Lisen for event 'hangman' from the client
//   socket.on('hangman', function(data) {
//     if (socket.username) {
//       io.emit('hangman', data.hangman, socket.username.username);
//     } else {
//       io.emit('hangman', data.hangman)
//     }
//   });
// });

http.listen(PORT, function() {
  console.log(`You're listening to port:${PORT}`);
})