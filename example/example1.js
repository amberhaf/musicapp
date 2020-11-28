var Downloader = require("./downloader");
var dl = new Downloader();

dl.getMP3({videoId: "B83ZmB-9m-A"}, function(err,res){
    i++;
    if(err)
        throw err;
    else{
        console.log("Song "+ i + " was downloaded: " + res.file);
    }
});