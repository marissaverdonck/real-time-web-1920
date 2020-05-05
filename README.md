# Bob a job <em>(Heitje voor een karweitje)</em> - Real Time Web 


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

### Help people with small jobs in the Corona era

Bob-a job is when children doing small jobs for a bob ('bob' is the old name for a shilling, now 5 pence). The idea for the concept originated in the era of Corona. I was thinking of older people who can't get out of their house because of the risk of infection. While other people are bored or have no job anymore. Maybe these people can help each other through the app. 

Users can share their address and post a job-list on a map. The helpers/deliverers can accept the list. Now a live chat connection is threatened between the two users.

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

<img width="800" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/79844820-7cda6800-83bc-11ea-905f-14e871bf9c2d.png">


## Real Time Events




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
