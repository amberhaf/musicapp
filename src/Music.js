import React from 'react';
import Pizzicato from 'pizzicato';

function Music() {
  let audio =  new Pizzicato.Sound('./dissolve.mp3')
  const start = () => {
    acousticGuitar.stop();
    var song = "./dissolve.mp3"
    let num = Math.floor(Math.random() * 10);
    if(num%2==0){
      song = './dissolve.mp3';
    }
    else
    {
      song = './wait.mp3';
    }
  
    acousticGuitar = new Pizzicato.Sound(song, function() {
      // Sound loaded!
      acousticGuitar.play();
  });
  }

  return (
    < div >
      <button onClick={start}>Play</button>
    </div >
  );
}
var acousticGuitar = new Pizzicato.Sound('./wait.mp3');
export default Music;
