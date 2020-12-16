const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(morgan('tiny'));
var cors = require('cors')
app.use(cors())
const fs = require('fs');
const ytdl = require('ytdl-core');
var results = [];

var ytpl = require('ytpl');

function downloadByPlaylist(input, callback) {
  var count = 0;
  ytpl(input).then(playlist => {
    for (var i = 0; i < 5; i++) {
      var id = playlist.items[i].id;
      var title = playlist.items[i].title;
      details = [{
        id: id,
        title: title
      }];
      results.push(details);
      var stream = ytdl('http://www.youtube.com/watch?v=' + id)
      .pipe(fs.createWriteStream('./songs/' + id + '.mp3'));
    stream.on('finish', function () {
      count++;
      console.log("downloaded" + count);
      if(count===5)
      {
        console.log("download complete");
        var response = [{
          downloaded: true
        }];
        callback(response);  
      }
    })
  }
  }).catch(err => {
    console.error(err);
  });
}

function downloadByGenre (callback){  
  var arr = songs;
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    var id = arr[i].url;
    var title = arr[i].name;
    if(arr[i].genre == Genre.state.genre)
    {
      details = [{
        id: id,
        title: title
      }];
    }
    results.push(details);
    var stream = ytdl(id)
      .pipe(fs.createWriteStream('./songs/' + id + '.mp3'));
    stream.on('finish', function () {
      count++;
      console.log("downloaded" + count);
      if(count===5)
      {
        console.log("download complete");
        var response = [{
          downloaded: true
        }];
        callback(response);  
      }
    });
  }
}

app.post('/api/choosePlaylist', async function (req, res) {
  results = [];
  const data = req.body;
  console.log(req.body.genre);
  var input = req.body.genre;
  downloadByPlaylist(input, function(response) {
    res.json(response); 
    res.end();
  })
});

app.post('/api/chooseGenre', function (req, res) {
  results = [];
  const data = req.body;
  downloadByGenre(function(response) {
    res.json(response); 
    res.end();
})
});

app.get('/api/getSong', (req, res) => {
  const songs = results.shift();
  var r = songs[0].id;
  res.sendFile(__dirname + '/songs/' + r + '.mp3');
});

app.get('/api/getDetails', (req, res) => {
  const songs = results[0];
  res.send(songs);
});

app.get('/api/getReady', (req, res) => {
  const ready = (results.length>=5);
  const response = [{
            ready: ready
        }];
  res.send(response);
});

app.post('/api/clear', (req, res) => {
  results = [];
  var response = [{
    downloaded: false
  }];
  res.json(response);
  res.end();
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);