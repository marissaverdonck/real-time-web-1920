var socket = io();
var myId;
var username;
var hangmanWord;

const usernameDiv = document.getElementById('username');
const usernameInput = document.getElementById('usernameInput');
const usernameForm = document.getElementById('usernameForm');
// const usernameOverlay = document.getElementById('usernameOverlay');
const messageForm = document.getElementById('messageForm')
const messageInput = document.getElementById('messageInput')
const messageList = document.getElementById('messageList')

messageForm.addEventListener('submit', getMessage);
usernameForm.addEventListener('submit', getUsername);

// Listen for server events with "socket.on"
socket.on('newUser', function(id) {
  console.log("new user detected:" + id);
  myId = socket.io.engine.id;
});

function getUsername(event) {
  // prevents page reloading
  event.preventDefault();
  // emit message from websocket to server
  if (usernameInput.value) {
    socket.emit('setUsername', {
      username: usernameInput.value
    })
  }
}

socket.on('setUsername', function(id, name) {
  console.log("new username: " + id + " is now: " + name);
  if (id == myId) {
    const li = document.createElement('li');
    li.className = 'newUser'
    li.textContent = name + ' has entered the chat';
    messageList.appendChild(li);
  } else {
    const li = document.createElement('li');
    li.className = 'newUser'
    li.textContent = name + ' has entered the chat';
    messageList.appendChild(li);
    // usernameDiv.className = 'removeOverlay'
  }
})

function getMessage(event) {
  // prevents page reloading
  event.preventDefault();
  // emit message from websocket to server
  console.log(messageInput.value)
  if (messageInput.value.startsWith('hangman:' || 'Hangman:')) {
    console.log('newword')
    hangmanWord = messageInput.value.slice(8).trim()
    console.log(hangmanWord)
    socket.emit('hangman', {
      hangman: messageInput.value.slice(8).trim()
    });
  } else {
    socket.emit('setMessage', {
      message: messageInput.value
    });
  }
}
socket.on('setMessage', function(message, user) {
  const li = document.createElement('li');
  // li.className = (user == myId ? "self" : "")
  if (user) {
    li.textContent = user + ' says: ' + message;
    messageList.appendChild(li);
  } else {
    li.textContent = 'anonymous says: ' + message;
    messageList.appendChild(li);
  }
});

socket.on('hangman', function(message, user) {
  const li = document.createElement('li');
  // li.className = (user == myId ? "self" : "")
  if (user) {
    messageList.appendChild(li);
    li.textContent = user + ' starts a new hangman word: ' + "*".repeat(message.length);
    messageList.createElement('p').textContent = message;

  } else {
    li.textContent = 'anonymous starts a new hangman word!';
    messageList.appendChild(li);
    li.textContent = user + ' starts a new hangman word: ' + "*".repeat(message.length);
    messageList.createElement('p').textContent = message;
  }
});