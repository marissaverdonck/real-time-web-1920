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
* [Here API](https://www.here.com/)


## Data
* [MongoDB](https://www.mongodb.com/)

Userdata is saved on MongoDB.

<img width="600" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/81079739-36265b00-8ef0-11ea-9bf4-73ff1ee3b0a3.png">


## Data Life Cycle

<img width="800" alt="Schermafbeelding 2020-03-13 om 15 10 46" src="https://user-images.githubusercontent.com/43657951/79844820-7cda6800-83bc-11ea-905f-14e871bf9c2d.png">


## Real Time Events


## Features
* Save userdata in the MongoDB database
* Display a map at a specified location
* Adding markers on the map
* Search for users on the map
* Live chat conncection with sockets.io

## Wishlist
* Store the rooms and chat messages in the database

## Learning Goals

* Sockets.io
* Socket.io - rooms


## Sources
* [Here API - Documentation](https://developer.here.com/documentation)
* [Socket.io Documentation](https://socket.io/docs/)
* [WebDevSimplified - socket.io rooms](https://www.youtube.com/watch?v=UymGJnv-WsE&feature=youtu.be)
* [WebDevSimplified - socket.io rooms](https://github.com/WebDevSimplified/Realtime-Chat-App-With-Rooms)


## License
[MIT License](https://github.com/marissaverdonck/real-time-web-1920/blob/master/license)
