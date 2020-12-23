import React from "react";
import Navbar from "./NavBar";
import { Link } from "react-router-dom";
import { Container, Row, Col} from 'react-bootstrap'

class About extends React.Component {

  render() {
    return (
      <div className="App">
        <Navbar />
        <h1 className="title">
          Melodify Music Guessing Game
        </h1>
        <h4 className="desc">
        A fun game to be played together with friends and family to virtually simulate a party atmosphere
        </h4>
          <Container>
            <Row>
            <Col>
            <img className="about" src="./peopleMusic.jpg" alt="music"/>
            </Col>
              <Col>
            <img className="about" src="./partyMusic.jpg" alt="party"/>
            </Col>
            </Row>
            <Row  className="row">
              <Col>Play single player game</Col>
              <Col>Play two player game</Col>
            </Row>
            <Row className="row">
              <Col>Make game from selected genres playlists</Col>
              <Col>Make game from public playlists on YouTube</Col>
            </Row>
            <Row  className="row">
              <Col>Simple game without downloading songs or applying effects</Col>
              <Col>Effects game to guess song titles after they have been distorted</Col>
            </Row>
            <Row>
            <Col><Link to="/simple"><button className="b1">Simple Game</button></Link>
              </Col>
              <Col><Link to="/game"><button className="b1">Effect Game</button></Link>
              </Col>
            </Row>
          </Container>
      </div>
    )
  }
}

export default About;