//=========================================Require Dependencies
var app       = require('express')();
var server    = require('http').Server(app);
var io        = require('socket.io')(server);
var apiHelper = require('./helpers/apiHelper');
//=========================================Require Dependencies

var searchTerm;
var pages;
var selectedPage;
var searchResults;

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 4444);
app.set('host', process.env.OPENSHIFT_NODEJS_IP   || process.env.HOST || '192.168.2.57');

server.listen(app.get('port'), app.get('host'), function() {
  console.log("Express server running");
});

app.get('/index.js', function(req, res, next) {
  res.sendfile('./views/js/index.js');
});

app.get('/main.css', function(req, res, next) {
  res.sendfile('./views/css/main.css');
});

app.get('/:key?', function(req, res, next) {
  var key = req.params.key;
  res.sendfile('./views/index.html');
  if (!key) {
    key = 'Batman';
  }
  searchTerm = key;
  selectedPage = 1;
  search(searchTerm, selectedPage);
});

io.on('connection', function(socket) {
  console.log('a user connected ');

  if(searchTerm) {
    io.emit('updateSearchTerm', searchTerm);
  }

  if(searchResults) {
    publishSearchResults(searchResults);
  }

  if(pages) {
    publishPagination();
  }

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

  socket.on('updatePage', function(page) {
    if(page == 'Next') {
      selectedPage++;
    } else {
      if(page == 'Prev') {
        selectedPage--;
      } else {
        selectedPage = page;
      }
    }
    search(searchTerm, selectedPage);
  });
});

function search(searchTerm, selectedPage) {
  apiHelper.search(searchTerm, selectedPage, function(json) {
      pages = Math.ceil(Number(json.totalResults)/10);
      searchResults = json.Search;
      publishSearchTerm();
      publishSearchResults();
      publishPagination();
    });
}

function publishSearchTerm() {
   io.emit('updateSearchTerm', searchTerm);
}

function publishSearchResults() {
  io.emit('updateResults', searchResults);
}

function publishPagination() {
  io.emit('updatePagination', { numberOfPages : pages,
              currentPage : selectedPage});
}