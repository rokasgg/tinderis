import React, { Component, Suspense } from "react";
import "../index.css";
import "./cssprof/profile.scss";

import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { regEndAction } from "../redux/actions/regEndReducer";
import { LOG_IF_IN_SYSTEM } from "../redux/actions/logIFinSystem";
import { getPropsIfLoggedIn } from "../redux/actions/ifLoggedGetProps";
import NavigationBar from "./navigationBar";
import Spinner from "react-bootstrap/Spinner";
import { firebaseApp, usersDb } from "../firebase/firebase";

// import Chat from "./chatas";
const Chat = React.lazy(() => import("./chatas"));

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
      isItSpinning: false,
    };
  }

  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.getPropsIfLoggedIn(user.email, user.uid);
        this.getMatches(user);
      } else {
        console.log("User is logged out");
        this.props.history.push("/");
      }
    });
  }

  navToRegistration = () => {
    this.props.history.push("/finalReg");
  };

  navigateToMain = () => {
    this.props.history.push("/main");
  };

  startSpinner = () => {
    this.setState({ isItSpinning: true });
  };
  getMatches = (user) => {
    this.startSpinner();
    const allData = [];
    usersDb
      .doc(user.uid)
      .collection("matches")
      .get()
      .then((snap) => {
        snap.docs.forEach((res) => {
          allData.push(res.data());
        });
        this.setState({ allData, isItSpinning: false });
      });
  };
  logout() {
    this.props.loggingOut(() => this.props.history.push("/"));
  }
  onRightArrowClick = () => {
    this.scrolling(document.getElementById("chat"), 300, 500);
  };

  onLeftClick = () => {
    this.scrolling(document.getElementById("chat"), -300, 500);
  };

  scrolling = (element, change, duration) => {
    let start = element.scrollLeft;
    let currentTime = 0;
    let increment = 20;

    console.log("startas", start);

    var animateScroll = function () {
      currentTime += increment;
      var val = mathisHardsad(currentTime, start, change, duration);
      element.scrollLeft = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };

  render() {
    return (
      <div className="App">
        {/* STARTASZ */}
        <NavigationBar currentPage="messages" logOutas={() => this.logout()} />
        {/* ENENENENEND */}

        <div className="matchs-list">
          <div
            className="match-list-left-arrow"
            onClick={() => this.onLeftClick()}
          >
            &#8249;
          </div>
          <div className="list-of-match-row" id="chat">
            {this.state.allData.length > 0 ? (
              this.state.allData.map((profile) => {
                return match_cards(this, profile);
              })
            ) : (
              <div
                className="match-cards"
                style={{
                  justifyContent: "center",
                  alignSelf: "center",
                  color: "white",
                }}
              >
                {this.state.isItSpinning ? (
                  <Spinner animation="grow" variant="light" size="sm" />
                ) : (
                  "Sarasas tuscias"
                )}
              </div>
            )}
          </div>
          <div
            className="match-list-right-arrow"
            onClick={() => this.onRightArrowClick()}
          >
            &#8250;
          </div>
        </div>

        {this.state.wantToChat1 ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Chat
              text_messages={this.state.text_messages}
              profileInfo={this.state.matchData}
              klass={this}
              onStateChate={(data) => this.onStateChate(data)}
            />
          </Suspense>
        ) : null}
        {this.state.wantToChat2 ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Chat
              text_messages={this.state.text_messages}
              profileInfo={this.state.matchData}
              klass={this}
              onStateChate={(data) => this.onStateChate(data)}
            />
          </Suspense>
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
    <div className="match-cards" onClick={() => openChat(klass, profile)}>
      <div className="match-image-container">
        <img className="match-chat-image" src={profile.image} alt="the rock!" />
      </div>
      <div className="match-text-cotainer">
        <div className="match-text">{profile.name}</div>
      </div>
    </div>
  );
}
function mathisHardsad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

export default connect(mapStateToProps, {
  loggingOut,
  regEndAction,
  LOG_IF_IN_SYSTEM,
  getPropsIfLoggedIn,
})(Game);
