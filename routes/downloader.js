var YoutubeMp3Downloader = require("../lib/YoutubeMp3Downloader");
var os = require("os");
const ffmpeg = require('@ffmpeg-installer/ffmpeg'); 

var Downloader = function() {
    var self = this;
    //Configure YoutubeMp3Downloader with your settings 
    self.YD = new YoutubeMp3Downloader({
        "ffmpegPath": ffmpeg.path,  // FFmpeg binary location TODO: Set correct path before testing!
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000                 // Interval in ms for the progress reports (default: 1000)
    });

    self.callbacks = {};

    self.YD.on("finished", function(error, data) {

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

    self.YD.on("error", function(error, data) {

        console.error(error + " on videoId " + data.videoId);

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

};

Downloader.prototype.getMP3 = function(track, callback){

    var self = this;

    // Register callback 
    self.callbacks[track.videoId] = callback;
    // Trigger download 
    self.YD.download(track.videoId, track.name);

};

module.exports = Downloader;
