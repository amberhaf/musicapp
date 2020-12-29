{/*use express module*/}
const express = require('express');
{/*use morgan module*/}
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(morgan('tiny'));
{/*enable cors*/}
var cors = require('cors')
app.use(cors())
{/*use fs module*/}
const fs = require('fs');
{/*use ytdl-core library*/}
const ytdl = require('ytdl-core');
let Songs = JSON.parse(fs.readFileSync('files.json'));
var results = [];
{/*use ytpl library*/}
var ytpl = require('ytpl');

//Download 8 random songs from youtube playlist
function downloadByPlaylist(input, callback) {
  var count = 0;
  //get playlist details
  ytpl(input).then(playlist => {
    var used = [];
    //download 8 random playlist songs
    for (var i = 0; i < 8; i++) {
      var ran=Math.floor(Math.random() * playlist.items.length);
      //if playlist aong has already been used the download another
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
      //add song to downloaded songs array
      results.push(details);
      var stream = ytdl('http://www.youtube.com/watch?v=' + id)
      .pipe(fs.createWriteStream('./songs/' + id + '.mp3'));
    stream.on('finish', function () {
      count++;
      //if 8 songs have been downloaded callback that download is complete
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
  //set arr to required genre array
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
  //download 8 random songs from genre
  for (var i = 0; i < 10; i++) {
    var ran=Math.floor(Math.random() * arr.length);
    //if playlist aong has already been used the download another
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
    //add song to downloaded songs array
    results.push(details);
    var stream = ytdl('http://www.youtube.com/watch?v=' + id)
      .pipe(fs.createWriteStream('./songs/' + id + '.mp3'))
    stream.on('finish', function () {
      count++;
      //if 8 songs have been downloaded callback that download is complete
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

//recieves playlist request using express
app.post('/api/choosePlaylist', async function (req, res) {
  results = [];
  var input = req.body.genre;
  //sends back response once it is recieved
  downloadByPlaylist(input, function(response) {
    res.json(response); 
    res.end();
  })
});

//recieves genre request using express
app.post('/api/chooseGenre', async function (req, res) {
  results = [];
  var genre = req.body.genre;
  //sends back response once it is recieved
  downloadByGenre(genre, function(response) {
    res.json(response); 
    res.end();
})
});

//sends mp3 file to express endpoint
app.get('/api/getSong', (req, res) => {
  const songs = results.shift();
  var r = songs[0].id;
  res.sendFile(__dirname + '/songs/' + r + '.mp3');
});

//sends song details to express endpoint
app.get('/api/getDetails', (req, res) => {
  const songs = results[0];
  res.send(songs);
});

//checks if songs have been downloaded so game can play
app.get('/api/getReady', (req, res) => {
  const ready = (results.length>=8);
  const response = [{
            ready: ready
        }];
  res.send(response);
});

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);