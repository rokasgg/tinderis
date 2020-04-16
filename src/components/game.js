import React, { Component } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { regEndAction } from "../redux/actions/regEndReducer";
import { LOG_IF_IN_SYSTEM } from "../redux/actions/logIFinSystem";
import {
  firebaseApp,
  usersDb,
  dbase,
  dbaseGetMessages,
} from "../firebase/firebase";
import * as Scroll from "react-scroll";

import {
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";
import Chat from "./chatas";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      age: "",
      city: "",
      image: "",
      allData: [],
      text_messages: [],
      wantToChat: false,
      matchData: {},
      textMessage: "",
      nesMessages: [],
      wantToChat1: false,
      wantToChat2: false,
    };
  }

  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.LOG_IF_IN_SYSTEM(user.email, user.uid);
        const allData = [];
        usersDb
          .doc(user.uid)
          .collection("matches")
          .get()
          .then((snap) => {
            snap.docs.forEach((res) => {
              allData.push(res.data());
              this.setState({ allData });
            });
          });
      } else {
        console.log("User is logged out");
        this.props.history.push("/");
      }
    });
  }
  logout() {
    this.props.loggingOut(() => this.props.history.push("/"));
  }

  render() {
    return (
      <div className="App">
        <div className="head">Poros</div>
        <div className="navigation-bar">
          <div className="nav-leftSide">
            <div className="nav-item">
              <Link className="link" to="/main">
                Pagrindinis
              </Link>
            </div>
            <div className="nav-item" onClick={this.doIt}>
              Profilis
            </div>
            <div className="nav-item">
              <Link className="link" to="/game">
                Žinutės
              </Link>
            </div>
          </div>

          <div className="nav-rightside">
            <div className="nav-item">
              <div onClick={() => this.logout()}>Atsijungti</div>
            </div>
          </div>
        </div>

        <div className="welcomeMessage">
          {this.state.nesMessages
            ? this.state.nesMessages.map((mes) => {
                return <div>{mes.textMessage} ./</div>;
              })
            : null}
        </div>
        <div className="match-list">
          {this.state.allData.length > 0
            ? this.state.allData.map((profile) => {
                return match_cards(this, profile);
              })
            : "Sarasas tuscias"}
        </div>
        {this.state.wantToChat1 ? (
          <Chat
            text_messages={this.state.text_messages}
            profileInfo={this.state.matchData}
            klass={this}
            onStateChate={(data) => this.onStateChate(data)}
          />
        ) : null}
        {this.state.wantToChat2 ? (
          <Chat
            text_messages={this.state.text_messages}
            profileInfo={this.state.matchData}
            klass={this}
            onStateChate={(data) => this.onStateChate(data)}
          />
        ) : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    email: state.loginReducers.email,
    userId: state.loginReducers.userId,
    usersData: state.loginReducers.usersData,
  };
}
function openChat(klass, profile) {
  console.log("sad", profile);
  if (klass.state.wantToChat1) {
    klass.setState({
      wantToChat1: false,
      wantToChat2: true,
      matchData: profile,
    });
  } else if (klass.state.wantToChat2) {
    klass.setState({
      wantToChat1: true,
      wantToChat2: false,
      matchData: profile,
    });
  } else {
    klass.setState({
      wantToChat1: false,
      wantToChat2: true,
      matchData: profile,
    });
  }
}

function match_cards(klass, profile) {
  return (
    <div className="match-chat-card" onClick={() => openChat(klass, profile)}>
      <div className="match-chat-image-container">
        <img className="match-chat-image" src={profile.image} alt="the rock!" />
      </div>
      <div className="match-chat-text-cotainer">
        <div className="match-chat-text">{profile.name}</div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, {
  loggingOut,
  regEndAction,
  LOG_IF_IN_SYSTEM,
})(Game);
