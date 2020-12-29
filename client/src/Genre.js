import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import Navbar from "./NavBar";

class Genre extends Component {
  constructor(props) {
    //default prop state variables
    super(props);
    this.state = {
      genre: 'rock',
      downloaded: false,
      content:"",
      pos:0,
      downloading: false,
      list: ['rock', 'pop', 'electro', 'hiphop', 'custom']
    };
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.moveForward = this.moveForward.bind(this);
    this.moveBack = this.moveBack.bind(this);
    this.play = this.play.bind(this);
  }
  componentDidMount() {
    this.setState({ downloaded: false});;
  }
  //handle playlist form input change
  handleChangeContent(e) {
    this.setState({
      content: e.target.value
    });
  }
  //move forward in genre array to display next genre
  moveForward(e) {
    var pos=this.state.pos;
    var list=this.state.list;
    pos++;
    if(pos===5)
    {
      pos=0;
    }
    var genre=list[pos];
    this.setState({pos: pos });
    this.setState({genre: genre });
  }
  //move back in genre array to display previous genre
  moveBack(e) {
    var pos=this.state.pos;
    var list=this.state.list;
    pos--;
    if(pos===-1)
    {
      pos=4
    }
    var genre=list[pos];
    this.setState({pos: pos });
    this.setState({genre: genre });
  }
  //submit genre and start download on server side
  play(e) {
    //set downloading variable to in progress
    this.setState({ downloaded: false});
    this.setState({ downloading: true});
    var _this = this;
    var genre=this.state.genre;
    //if playlist send url to server choosePlaylist end point
    if(genre==="custom")
    {
      var content=this.state.content;
      fetch('/api/choosePlaylist' , {
      method: "POST",
      headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
        },
        body: JSON.stringify({genre: content})
    }).then(response => response.json())
    .then(function(data){
      //when download complete update downloading variable
      _this.setState({ downloaded: data[0].downloaded});
      _this.setState({ downloading: false});
    })
    .catch((error) => {
      console.error('Error:', error);
      _this.setState({ downloading: false});
    });
    }
    //if playlist send url to server chooseGenre end point
    else
    {
    fetch('/api/chooseGenre' , {
    method: "POST",
    headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({genre: genre})
  }).then(response => response.json())
  .then(function(data){
      //when download complete update downloading variable
    _this.setState({ downloaded: data[0].downloaded});
    _this.setState({ downloading: false});
  })
  .catch((error) => {
    console.error('Error:', error);
    _this.setState({ downloading: false});
  });
    }
  }

  render() {
      return(
        <div className="App">
          <Navbar/>
           <div>
          <h1>Choose Game</h1>
          {/*display whatever genre the uset is on*/}
          {(this.state.genre==='pop') &&
          (
          <img className='genre' src='./pop.jpg'  alt="pop"/>
          )}
          {(this.state.genre==='rock') &&
          (
          <img className='genre' src='./rock.jpg'  alt="rock"/>
          )}
          {(this.state.genre==='hiphop') &&
          (
          <img className='genre' src='./hiphop.jpg'  alt="hiphop"/>
          )}
          {(this.state.genre==='electro') &&
          (
          <img className='genre' src='./electro.jpg'  alt="electro"/>
          )}
          {(this.state.genre==='custom') &&
          (
          <img className='genre' src='./custom.jpg'  alt="custom"/>
          )}
          <h3>{this.state.genre}</h3>
          {/*if on custom display playlist form*/}
          {(this.state.genre==='custom') &&
          (
            <div >
            <textarea 
            className="form"
            placeholder="Enter Playlist url"
            onChange={this.handleChangeContent}
            value={this.state.content}
              type="text"
              cols="80"
              rows="1"
              />
          </div>
          )}
          <div>
          {/*icons to move, back forward or submit*/}
          <img className="controls" onClick={this.moveBack} src='rewind.svg' alt="back"/>
          {(this.state.downloading===false) && (
          <button className="b" onClick={this.play}>
            PLAY
          </button>
          )}
          {/*display react-bootstrap spinner if download is in progress*/}
          {(this.state.downloading===true) && (
          <Spinner className="loading" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          )}
          <img className="controls" onClick={this.moveForward} src='fast-Forward.svg' alt="forward"/>
          </div>
          <br/>
          {/*when download is complete display links to pages*/}
          {(this.state.downloaded===true) &&
        (<div><Link to="/game">
           <button className="b1">Single Player</button></Link>
        <Link to="/twoplayer"><button className="b1">Two Player</button></Link></div>)}
        </div>
        </div>
      );
  } 
}

export default Genre;
