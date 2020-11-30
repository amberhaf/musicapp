const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
var cors = require('cors')
app.use(cors())

app.get('/api/customers', (req, res) => {
  const customers = [
    {fileName: results.shift()}
  ];
  res.json(customers);
});


app.post('/api/addUser', (req, res) => {
  const data = req.body;
  console.log(req.body.fileName);
  res.send('POST request to the homepage')
  });

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);

const fs = require('fs');
const ytdl = require('ytdl-core');
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above
var arr=['x3bfa3DZ8JM','wYYQpTbBSBM','bpOSxM0rNPM','JJ9IX4zgyLs','Bag1gUxuU0g']
var results=[];
for(var i=0; i<5; i++)
{
  var id=arr[i];
  ytdl('http://www.youtube.com/watch?v='+id)
  .pipe(fs.createWriteStream('./client/public/'+id+'.mp3'));
  results.push(id);
}
