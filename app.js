//=========================================Require Dependencies
var app       = require('express')();
var server    = require('http').Server(app);
var io        = require('socket.io')(server);
var apiHelper = require('./helpers/apiHelper');
var User      = require('./objects/user');
var helmet    = require('helmet');
//=========================================Require Dependencies

var searchTerm;
var users = [];

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 4444);
app.set('host', process.env.OPENSHIFT_NODEJS_IP   || process.env.HOST || 'localhost');

server.listen(app.get('port'), app.get('host'), function() {
   console.log("Express server running");
});

app.use(helmet.hidePoweredBy());

app.get('/posters/:poster?', function(req, res, next) {
  res.sendfile('./posters/' + req.params.poster);
});

app.get('/views/images/posterNotFound.jpg', function(req, res, next) {
  res.sendfile('./views/images/posterNotFound.jpg');
});


app.get('/index.js', function(req, res, next) {
  res.sendfile('./views/js/index.js');
});

app.get('/main.css', function(req, res, next) {
  res.sendfile('./views/css/main.css');
});

app.get('/', function(req, res, next) {
  res.sendfile('./views/index.html');
  searchTerm = 'Batman';
});

app.get('/s=:key?', function(req, res, next) {
  var key = req.params.key;
  res.sendfile('./views/index.html');
  if (!key) {
    key = 'Batman';
  }
  searchTerm = key;
});

io.on('connection', function(socket) {
  var user = findOrCreateUser(socket);
  searchWith(user)

  socket.on('disconnect', function() {
    var user = "";
    for(var i=0;i<users.length;i++) {
      if(socket.handshake.address == users[i].ip) {
        user = users[i];
        break;
      }
    }
    console.log(user.ip + ' disconnected');
  });

  socket.on('updatePage', function(page) {
    var user = getUserForSocket(socket);
    user.selectedPage = page;
    updateUserInUsers(user);
    searchWith(user);
  });
});

function findOrCreateUser(socket) {
  var user = getUserForSocket(socket);
  if(user == "") {
    user = new User.create();
    user.socket = socket;
    if(!searchTerm) {
      searchTerm = 'Batman';
    }
    user.searchTerm = searchTerm;
    user.pages = 1;
    user.selectedPage = 1;
    user.searchResults = [];
    user.ip = socket.handshake.address;
    users.push(user);
    console.log(user.ip + ' connected');
  } else {
    user.searchTerm = searchTerm;
    user.socket = socket;
    user.pages = 1;
    user.selectedPage = 1;
    updateUserInUsers(user);
    console.log(user.ip + ' reconnected');
  }
  return user;
}

function getUserForSocket(socket) {
  for(var i=0;i<users.length;i++) {
    if(socket.handshake.address == users[i].ip) {
      return users[i];
    }
  }
  return "";
}

function updateUserInUsers(user) {
  var index = -1;
  for(var i=0;i<users.length;i++) {
    if(user.ip == users[i].ip) {
      index = i;
      break;
    }
  }
  if(index > -1) {
    users.splice(index, 1);
    users.push(user);
  }
}

function searchWith(user) {
  apiHelper.search(user, function(json) {
      user.pages = Math.ceil(Number(json.totalResults)/10);
      user.searchResults = json.Search;
      updateUserInUsers(user)
      if(user) {
        updateUIFor(user);
      }
    });
}

function updateUIFor(user) {
  io.to(user.socket.id).emit('updateSearchTerm', user.searchTerm);
  io.to(user.socket.id).emit('updateResults', user.searchResults);
  io.to(user.socket.id).emit('updatePagination', { numberOfPages : user.pages,
        currentPage : user.selectedPage});
}