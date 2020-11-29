const express = require('express');

const app = express();

app.get('/api/customers', (req, res) => {
  const customers = [
    {fileName: results.shift()}
  ];
  res.json(customers);
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);

var Downloader = require("./downloader");
// Import npm packages
var arr=["B83ZmB-9m-A","by3yRdlQvzs","PLLNMtg6QEY4ePU7aQg5zCYx08HU3bNCgp","o_1aF54DO60"];
var results=[];
var dl = new Downloader();
for(var i=0; i<3; i++)
{ 
  var video=arr[i];
  dl.getMP3({videoId: video}, function(err,res){
      if(err)
          throw err;
      else{
          console.log("Song "+ i + " was downloaded: " + res.file);
          var temp=res.file
          var r = temp.split("public/");
          results.push(r[1]);
      }
  });
}