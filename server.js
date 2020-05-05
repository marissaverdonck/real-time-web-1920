require('dotenv').config()
const express = require('express')
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path')
const PORT = process.env.PORT || 3000;
// const mongodbModule = require('./modules/mongodb')
var mongo = require('mongodb')
var db = null;
var bodyParser = require('body-parser')
const session = require('express-session')
var url = process.env.DB_HOST;
const sess = {
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {}
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
mongo.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  if (err) {
    throw err
  }
  db = client.db(process.env.DB_NAME)
})

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('public'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // set "cookie: { secure: true }" off while developing
  // cookie: { secure: true }
}))
app.use(session(sess));

const rooms = {}

app.get('/', (req, res) => {
  res.redirect('/index.html');
  // mongodbModule.checkSession(req, res)
})
app.get('/logout.html', (req, res) => {
  console.log('req.session destory' + req.session)

  req.session.destroy(function(err) {
    if (err) {
      console.log('req.session destory' + req.session)
      next(err);
    } else {
      console.log('req.session destory' + req.session)
      res.redirect('/');
    }
  })
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

        res.render('map', {
          allData: allData,
          user: req.session.user,
          userData: data,
          rooms: rooms
        });
      }
    }
  }
})

app.get('/:room', (req, res) => {
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
        if (rooms[req.params.room] == null) {
          return res.redirect('map')
        }
        console.log(data)
        res.render('room', {
          allData: allData,
          user: req.session.user,
          userData: data,
          roomName: req.params.room,
          userName: data.firstName + ' ' + data.lastName
        })
      }
    }
  }
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/signup.html'));
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
      if (req.body.password === data.password) {
        console.log('password correct');
        req.session.user = { id: data._id };
        res.redirect('map');

      } else {
        res.redirect('/');
        console.log('password incorrect');
      }
    }
  }
})

app.post('/signup.html', (req, res) => {
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
    console.log(req.session.user)
    req.session.user = { id: data.ops[0]._id }
      // res.sendFile(path.join(__dirname, 'views/map.html'));
    res.redirect('map')
  }
})


io.on('connection', function(socket) {
  // Lisen for event 'setUsername' from the client
  socket.on('getUserLatLon', function(data) {
    db.collection('grocery').updateOne({
      _id: new mongo.ObjectID(data.userId)
    }, {
      $set: {
        lat: data.userLat,
        lon: data.userLon
      }
    })
    console.log(data)

    db.collection('grocery').find().toArray(part2);

    function part2(err, data) {
      allData = data;
      console.log('allData = ' + allData)
      socket.emit('setAllLocations', allData);
    }
  })

  socket.on('newChat', function(data) {
    console.log('data' + data.contactUserId)

    db.collection('grocery').findOne({
      _id: mongo.ObjectID(data.contactUserId),
    }, done)

    function done(err, mongoData) {
      console.log('testing ' + mongoData.firstName + data.roomId)
      setRoom(data, mongoData)
    }

    function setRoom(data, mongoData) {
      if (rooms[data.roomId] != null) {
        console.log('contactName:' + mongoData.firstName)
          // enter an existing room
        socket.emit('enter-room', {
          room: data.roomId,
          contactName: mongoData.firstName
        })
        socket.broadcast.emit('setRoom', {
          room: data.roomId,
          contactName: data.userName
        })

      } else if (rooms[data.roomId] == null) {
        // create a new room
        rooms[data.roomId] = { users: {} }

        console.log('contactName:' + mongoData.firstName)

        socket.emit('room-created', {
          room: data.roomId,
          contactName: mongoData.firstName
        })
        socket.broadcast.emit('setRoom', {
          room: data.roomId,
          contactName: data.userName
        })

        // io.emit('room-created', data.roomId)
        // }
      }
    }
  })

  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    console.log('socket.id : ' + socket.id)
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
});

http.listen(PORT, function() {
  console.log(`You're listening to port:${PORT}`);
})