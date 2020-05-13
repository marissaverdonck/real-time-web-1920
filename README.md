# Grocery Helper - Real Time Web 


<img width="600" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/81083399-d1b9ca80-8ef4-11ea-83f8-56855dd7a4b1.png">

## Table of Contents
* [Concept](#Concept)
* [Live Demo](#Live-Demo)
* [Installation](#Installation)
* [Data Life Cycle](#Data-Life-Cycle)
* [API's](#API's)
* [Data](#Data)
* [Features](#Features)
* [Wishlist](#Wishlist)
* [Learning goals](#Learning-goals)
* [Sources](#Sources)
* [License](#License)

## Concept

### The assignment

Build a meaningful real-time application. Learn techniques to setup an open connection between the client and the server. This will enable you to send data in real-time both ways, at the same time.

### Help people with their groceries in the Corona era

The idea for the concept originated in the era of Corona. I was thinking of older people who can't get out of their house because of the risk of infection. While other people are bored or have no job anymore. Maybe these people can help each other through the app. 

Users can share their address and post a grocery-list on a map. The helpers/deliverers can accept the list. Now a live chat connection is threatened between the two users.

<img width="600" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/81079720-2f97e380-8ef0-11ea-8554-94c1b1952cfb.png">
<img width="600" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/81079734-34f52e00-8ef0-11ea-9403-b4772d13f6b4.png">


## Live Demo
See and try here  [here](https://minorwebdev-realtimeweb.herokuapp.com/) the live demo.

## Installation
1. Open up your terminal

2. Go to the file in your computer where you want to install the application

3. Clone the repository. Typ in your terminal:
```
Git clone https://github.com/marissaverdonck/real-time-web-1920.git
```
4. Install dependencies

```
npm install
```

5. Start the app
```
node server.js
```

## API's
### [HERE API](https://www.here.com/)

HERE is a free mapping API that that enable developers to build Web applications with feature rich, interactive maps and location data. The API consists of libraries of classes and methods with which to implement the functionality of an interactive application. I use the API to find the latitude and longitude of an address and then add a marker on the map. this marker is interactive and contains information about thee user who lives on that adress. But you can do so much more witch HERE. If I had more time I'd like to explore more about live routing or 3d maps.


## Data
### [MongoDB](https://www.mongodb.com/)

Userdata is saved in the MongoDB database. Data can contain a lot of unstructured data. In order to process and analyze everything easily, this has led to the development of NoSQL databases.

* NoSQL is useful for large amounts of data that often have little to no structure. This is useful for growing, unstructured data such as customer preferences, location, previous purchases and Facebook likes, a NoSQL database does not set limits and you can add different types of data as your needs change.

* SQL databases store structured data such as a telephone directory.

When a user registers, this data is stored in the database. Each user gets a unique userId. Data can be looked up in the database at any time and I use this by, for example, looking for a name with an ID. Changing and deleting data is also possible in mongoDB, but unfortunately I did not have time to elaborate that further.

```
{ _id: 5ea2cda5e2834fa02878e513,
  firstName: 'John',
  lastName: 'Doe',
  street: 'Rozengracht',
  number: '10',
  zipcode: '1000AA',
  city: 'Amsterdam',
  role: 'helper',
  email: 'john.doe@email.com',
  password: 'ilovedogs',
  lat: 10.37863,
  lon: 20.89104 }
```

<img width="600" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/81079739-36265b00-8ef0-11ea-9bf4-73ff1ee3b0a3.png">


## Data Life Cycle

<img width="800" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/81838612-a2cfd400-9546-11ea-928d-4080ebb950ab.png">


## Real Time Events

<details>
    <summary>1. The user registers</summary>
  
When the user posts the form, the server connects to mongodb. A new user is created. The user is given a session and is directed to a new page (/map.ejs).
  
#### SERVER.JS
  ```
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
    res.redirect('/map')
  }
})
  ```
  
</details>

<details>
    <summary>2. HERE API is searching for the latitude and longitude of the user adress</summary>
  
  
 When the user enters /map.ejs, the server is checked whether it is logged in (with a valid password) and thus there is a session. If so, the database is searched for this user and all data is retrieved. then all data is passed on to the client side.
  
  #### SERVER.JS
  
```
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
        });
      }
    }
  }
})
```
  
On the client side is searched for the latitude and longitude of the given address data. 
  
#### CLIENT.JS
    
 ```
  function geocode() {
  var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
      searchText: userAdress,
      jsonattributes: 1
    };

  geocoder.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}
```

Now the latitude and longitude must be added to the user data in the database. socket.emit sends the data to the server and meanwhile the the address is placed with a marker on the map.

  #### CLIENT.JS
  
```
function onSuccess(result) {
  var locations = result.response.view[0].result;
  var userLocation = result.response.view[0].result;
  socket.emit('getUserLatLon', {
    userLat: locations[0].location.displayPosition.latitude,
    userLon: locations[0].location.displayPosition.longitude,
    userId: userId
  })
  addUserLocation(userLocation)
}

```
</details>

<details>
    <summary>4. Server asks for all data in MongoDB</summary>

The socket receives the latitude and longitude of the user through the socket. The server searches in the database for the user in question and adds the lat and lon to the userdata in the database.

Then all data is retrieved from the database. This is forwarded to all sockets on the client-side to mark the addresses on the map with .setAllLocations(). 

#### SERVER.JS

```
  socket.on('getUserLatLon', function(data) {
    db.collection('grocery').updateOne({
      _id: new mongo.ObjectID(data.userId)
    }, {
      $set: {
        lat: data.userLat,
        lon: data.userLon
      }
    })
    db.collection('grocery').find().toArray(part2);
    function part2(err, data) {
      allData = data;
      io.emit('setAllLocations', allData);
    }
  })
```

</details>




<details>
    <summary>5. HERE API puts all markers on the map and send it through the server to the client</summary>
  
All clients receive the data from the database. This allows points to be placed on the map along with the associated user information. 

There are 2 types of users, a helper and a receiver. Each user gets a different color marker on the card and different text.
  
  CLIENT.JS
  ```
  socket.on('setAllLocations', function(data) {
  var group = new H.map.Group(),
    position,
    i;
  // Add a marker for each location found
  for (i = 0; i < data.length; i += 1) {
    console.log(data[i]._id + " " + userId)
    if (data[i].lat) {
      position = {
        lat: data[i].lat,
        lng: data[i].lon
      }
    };

    if (data[i].role == 'receiver' && data[i]._id != userId) {
      var svgMarkup =
        '<svg xmlns="http://www.w3.org/2000/svg" x="1" y="1" width="40" height="40" viewBox="0 0 263.335 263.335"><path d="M40.479,159.021c21.032,39.992,49.879,74.22,85.732,101.756c0.656,0.747,1.473,1.382,2.394,1.839   c0.838-0.396,1.57-0.962,2.178-1.647c80.218-61.433,95.861-125.824,96.44-128.34c2.366-9.017,3.57-18.055,3.57-26.864 C237.389,47.429,189.957,0,131.665,0C73.369,0,25.946,47.424,25.946,105.723c0,8.636,1.148,17.469,3.412,26.28" fill="orange"/></svg>'
      var icon = new H.map.Icon(svgMarkup);
      marker = new H.map.Marker(position, { icon: icon });
      marker.setData(data[i].firstName + ' ' + data[i].lastName + ' heeft hulp nodig met' +
        ' <ul>' +
        '  <li> boodschappen</li>' +
        '</ul>' +
        ' <a href="' + data[i]._id + userId + '" target="_blank" class="newChat" id=' + data[i]._id + '> Start een gesprek</a>');
      group.addObject(marker);

    } else if (data[i].role == 'helper' && data[i]._id != userId) {
      var svgMarkup =
        '<svg xmlns="http://www.w3.org/2000/svg" x="1" y="1" width="40" height="40" viewBox="0 0 263.335 263.335"><path d="M40.479,159.021c21.032,39.992,49.879,74.22,85.732,101.756c0.656,0.747,1.473,1.382,2.394,1.839   c0.838-0.396,1.57-0.962,2.178-1.647c80.218-61.433,95.861-125.824,96.44-128.34c2.366-9.017,3.57-18.055,3.57-26.864 C237.389,47.429,189.957,0,131.665,0C73.369,0,25.946,47.424,25.946,105.723c0,8.636,1.148,17.469,3.412,26.28" fill="green"/></svg>'
      var icon = new H.map.Icon(svgMarkup);
      marker = new H.map.Marker(position, { icon: icon });
      marker.setData(data[i].firstName + ' ' + data[i].lastName + ' zou misschien kunnen helpen' +
        ' <a href=" ' + data[i]._id + userId + ' " target="_blank" class="newChat" id=' + data[i]._id + '> Start een gesprek</a>');
      group.addObject(marker);
    }
  }

  group.addEventListener('tap', function(evt) {
    // map.setCenter(evt.target.getGeometry());
    var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
      //       // read custom data
      content: evt.target.getData()
    });
    ui.addBubble(bubble)
    newChat()
  });
  map.addObject(group);
})
  ```
  
  
</details>

<details>
    <summary>6. User opens a new chat (room) with an other user found on the map</summary>
  
  Each marker has a button to start a conversation with the corresponding user. The link to the chat contains the user id and the id of the user you clicked.
  
 CLIENT.JS
  ```
marker = new H.map.Marker(position, { icon: icon });
marker.setData(data[i].firstName + ' ' + data[i].lastName + ' zou misschien kunnen helpen' + 
' <a href=" ' + data[i]._id + userId + ' " target="_blank" class="newChat" id=' + data[i]._id + '> Start een gesprek</a>');
  ```
  
  When the user clicks on the link, the newChat() function in fired. JS reads the id attribute (this contains the clicked user's id) and passes it to a new socket together with the .id of the user himself.

 CLIENT.JS
```
function newChat() {
  var newChat = document.querySelectorAll('.newChat')
  if (newChat) {
    for (i = 0; i < newChat.length; i += 1) {
      newChat[i].addEventListener("click", function() {
        //event.target.id gets the html element id
        socket.emit('newChat', {
          roomId: event.target.id + userId,
          userId: userId,
          contactUserId: event.target.id,
          userName: userName
        })
      })
    }
  }
}
```
</details>

  <details>
    <summary>7. The other user gets a messagebutton to enter the chatroom</summary>

When a user clicks on the "start a conversation" button, there will be created a new room. The roomId contains the 2 userId's.
If the room allready excists (because the other user has already created a chat with you or it is the second time you enter the chat), you will enter this existing room. 

For each case, a different socket is sent to the client. 

New room:

* socket.emit('room-created')
* socket.broadcast.emit('setRoom')


Excisting room:

* socket.emit('enter-room')

SERVER.JS
```
  socket.on('newChat', function(data) {
    db.collection('grocery').findOne({
      _id: mongo.ObjectID(data.contactUserId),
    }, done)

    function done(err, mongoData) {
      setRoom(data, mongoData)
    }

    function Room(data, mongoData) {
      if (rooms[data.roomId] != null) {
          // enter an existing room
        socket.emit('enter-room', {
          room: data.roomId,
          contactName: mongoData.firstName
        })
      } else if (rooms[data.roomId] == null) {
        // create a new room
        rooms[data.roomId] = { users: {} }
        socket.emit('room-created', {
          room: data.roomId,
          contactName: mongoData.firstName
        })
        socket.broadcast.emit('setRoom', {
          room: data.roomId,
          contactName: data.userName
        })
      }
    }
  })
  ```


CLIENT.JS

When the room does not allready exist, you will create a new one. If the room includes your userId, it will be added to your chat list. In the button of the link, the name of the other user will be displayed.

#### Room-created
```
socket.on('room-created', function(room, contactName) {
  if (room.room.includes(userId)) {
    const roomElement = document.createElement('div')
    const roomLink = document.createElement('a')
    roomLink.href = `/${room.room}`
    roomLink.innerText = room.contactName
    roomLink.target = "_blank"
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
  }
})
```

When another user wants to start a chat with you, of course you want to see that. This socket is send to all clients exept to the user socket. If the roomId includes your userId, there will be a button created in your chat-list.

### setRoom
```
socket.on('setRoom', function(room) {
  if (room.room.includes(userId)) {
    const roomElement = document.createElement('div')
    const roomLink = document.createElement('a')
    roomLink.href = `/${room.room}`
    roomLink.innerText = room.contactName
    roomLink.target = "_blank"
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
  }
})
```

If an other user creates the room before you, or it is the second time you enter the room, you enter an existing room. 
the button may have disappeared and therefore a new one is created.

#### Enter-room
```
socket.on('enter-room', function(room, contactName) {
  const roomElement = document.createElement('div')
  const roomLink = document.createElement('a')
  roomLink.href = `/${room.room}`
  roomLink.innerText = room.contactName
  roomLink.target = "_blank"
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})
```

  

</details>
  




## Features
* Save userdata in the MongoDB database
* Display a map
* Adding markers on the map
* Search for other users on the map
* Live chat conncection with sockets.io
* New messages list

## Wishlist
* Store rooms and chat messages in the database
* Add new user adress markers on the map with a live database connection
* Add and remove things from the job-list

## Learning Goals

* Sockets.io events
* Socket.io rooms
* MongoDB database


## Sources
* [Here API - Documentation](https://developer.here.com/documentation)
* [Socket.io Documentation](https://socket.io/docs/)
* [WebDevSimplified - socket.io rooms](https://www.youtube.com/watch?v=UymGJnv-WsE&feature=youtu.be)
* [WebDevSimplified - socket.io rooms](https://github.com/WebDevSimplified/Realtime-Chat-App-With-Rooms)


## License
[MIT License](https://github.com/marissaverdonck/real-time-web-1920/blob/master/license)
