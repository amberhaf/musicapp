var Downloader = require("./downloader");
// Import npm packages
var dl = new Downloader();
var i=0;
dl.getMP3({videoId: "B83ZmB-9m-A"}, function(err,res){
    i++;
    if(err)
        throw err;
    else{
        console.log("Song "+ i + " was downloaded: " + res.file);
    }
});
