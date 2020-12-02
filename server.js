const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
var cors = require('cors')
app.use(cors())
const fs = require('fs');
const ytdl = require('ytdl-core');
var results = [];
var response = [];

function query() {
    var arr=['x3bfa3DZ8JM','wYYQpTbBSBM','bpOSxM0rNPM','JJ9IX4zgyLs','Bag1gUxuU0g'];
    for(var i=0; i<5; i++)
    {
      var id=arr[i];
      ytdl('http://www.youtube.com/watch?v='+id)
      .pipe(fs.createWriteStream('./client/public/'+id+'.mp3'));
      results.push(id);
    }
    response = [
      {downloaded: true}
    ];
    return response;
  }

app.get('/api/getSong', (req, res) => {
  const customers = [
    {fileName: results.shift()}
  ];
  res.json(customers);
});

app.get('/api/clear', (req, res) => {
  const data = req.body;
  console.log(req.body.fileName);
  results=[];
  response = [];
  res.json(back);
  res.end();
});

app.get('/api/getGenre', (req, res) => {
  res.json(response);
});

app.post('/api/chooseGenre',  async function(req, res) {
  const data = req.body;
  console.log(req.body.fileName);
  var back = await query();
  res.json(back);
  res.end();
  })

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
