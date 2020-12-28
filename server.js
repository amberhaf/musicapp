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
let Songs1 = fs.readFileSync('files.json');
let Songs = JSON.parse(Songs1);
var results = [];

var ytpl = require('ytpl');

a=Songs.rock;
    for (var k = a.length - 1; k > 0; k--) {
        var j = Math.floor(Math.random() * (k + 1));
        var temp = a[k];
        a[k] = a[j];
        a[k] = temp;
    }
  Songs.rock=a;

function downloadByPlaylist(input, callback) {
  var count = 0;
  ytpl(input).then(playlist => {
    var used = [];
    for (var i = 0; i < 8; i++) {
      var ran=Math.floor(Math.random() * playlist.items.length);
      while(used.includes(ran))
      {
        ran=Math.floor(Math.random() * playlist.items.length);
      }
      used.push(ran);
      var id = playlist.items[ran].id;
      var title = playlist.items[ran].title;
      details = [{
        id: id,
        title: title
      }];
      results.push(details);
      var stream = ytdl('http://www.youtube.com/watch?v=' + id)
      .pipe(fs.createWriteStream('./songs/' + id + '.mp3'));
    stream.on('finish', function () {
      count++;
      if(count===8)
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

function downloadByGenre (genre, callback){  
  var arr = Songs;
  var count = 0;
  if(genre==='pop')
  {
    arr=arr.pop;
  }
  else if(genre==='hiphop')
  {
    arr=arr.hiphop;   
  }
  else if(genre==='rock')
  {
    arr=arr.rock;   
  }
  else if(genre==='electro')
  {
    arr=arr.electro;   
  }
  var used=[];
  for (var i = 0; i < 10; i++) {
    var ran=Math.floor(Math.random() * arr.length);
    while(used.includes(ran))
    {
      ran=Math.floor(Math.random() * arr.length);
    }
    used.push(ran);
    var id = arr[ran].url;
    var title = arr[ran].name;
    details = [{
      id: id,
      title: title
    }];
    results.push(details);
    var stream = ytdl('http://www.youtube.com/watch?v=' + id)
      .pipe(fs.createWriteStream('./songs/' + id + '.mp3'))
    stream.on('finish', function () {
      count++;
      if(count===8)
      {
        console.log("download complete");
        var response = [{
          downloaded: true
        }];
        callback(response);  
      }
    }).on('error', (error) => {
      reject(error);
    });
  }
}

app.post('/api/choosePlaylist', async function (req, res) {
  results = [];
  var input = req.body.genre;
  downloadByPlaylist(input, function(response) {
    res.json(response); 
    res.end();
  })
});

app.post('/api/chooseGenre', async function (req, res) {
  results = [];
  var genre = req.body.genre;
  downloadByGenre(genre, function(response) {
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
  const ready = (results.length>=8);
  const response = [{
            ready: ready
        }];
  res.send(response);
});


const port = 5000;

app.listen(port, () => `Server running on port ${port}`);