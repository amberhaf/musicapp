import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import Navbar from "./NavBar";

class Genre extends Component {
  constructor(props) {
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
    var _this = this;
    var boo = true;
    fetch('/api/clear' , {
    method: "POST",
    headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({genre: boo})
  }).then(response => response.json())
  .then(function(data){
    console.log('Success:', data[0].downloaded);
    _this.setState({ downloaded: data[0].downloaded});
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  }
  
  handleChangeContent(e) {
    this.setState({
      content: e.target.value
    });
  }

  moveForward(e) {
    var pos=this.state.pos;
    var list=this.state.list;
    pos++;
    if(pos==5)
    {
      pos=0;
    }
    var genre=list[pos];
    this.setState({pos: pos });
    this.setState({genre: genre });
  }

  moveBack(e) {
    var pos=this.state.pos;
    var list=this.state.list;
    pos--;
    if(pos==-1)
    {
      pos=4
    }
    var genre=list[pos];
    this.setState({pos: pos });
    this.setState({genre: genre });
  }

  play(e) {
    this.setState({ downloaded: false});
    this.setState({ downloading: true});
    var _this = this;
    var genre=this.state.genre;

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
      console.log('Success:', data[0].downloaded);
      _this.setState({ downloaded: data[0].downloaded});
      _this.setState({ downloading: false});
    })
    .catch((error) => {
      console.error('Error:', error);
      _this.setState({ downloading: false});
    });
    }
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
    console.log('Success:', data[0].downloaded);
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
          {(this.state.genre==='pop') &&
          (
          <img className='genre' src='./pop.jpg' />
          )}
          {(this.state.genre==='rock') &&
          (
          <img className='genre' src='./rock.jpg' />
          )}
          {(this.state.genre==='hiphop') &&
          (
          <img className='genre' src='./hiphop.jpg' />
          )}
          {(this.state.genre==='electro') &&
          (
          <img className='genre' src='./electro.PNG' />
          )}
          {(this.state.genre==='custom') &&
          (
          <img className='genre' src='./custom.jpg' />
          )}
          <h3>{this.state.genre}</h3>
          {(this.state.genre==='custom') &&
          (
            <div>
            <textarea 
            className="form-control"
            placeholder="Enter Playlist url"
            onChange={this.handleChangeContent}
            value={this.state.content}
              type="text"
              cols="30"
              rows="1"
              />
          </div>
          )}
          <p>
          <img className="controls" onClick={this.moveBack} src='rewind.svg'/>
          {(this.state.downloading===false) && (
          <button className="b" onClick={this.play}>
            Submit
          </button>
          )}
          {(this.state.downloading===true) && (
          <Spinner className="loading" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          )}
          <img className="controls" onClick={this.moveForward} src='fast-Forward.svg'/>
          </p>
          <br/>
          {(this.state.downloaded===true) &&
        (<div><button><Link to="/game">Single Player</Link></button>
        <button><Link to="/twoplayer">Two Player</Link></button></div>)}
        </div>
        </div>
      );
  } 
}

export default Genre;
