import React, { Component } from "react";
import "../index.css";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { regEndAction } from "../redux/actions/regEndReducer";
import { LOG_IF_IN_SYSTEM } from "../redux/actions/logIFinSystem";
import { firebaseApp, usersDb, dbase } from "../firebase/firebase";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      allData: [],
      dislikedCardDeckIDs: [],
      affectedCards: [],
      matchAge: "",
      matchName: "",
      matchImage: "",
    };
  }
  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in", user);
        this.props.LOG_IF_IN_SYSTEM(user.email, user.uid);
      } else {
        console.log("User is logged out");
        this.props.history.push("/");
      }
    });
    this.getCards();
  }

  getCards = () => {
    const allData = [];
    usersDb.get().then((snap) => {
      snap.docs.forEach((res) => {
        let usersInfo = res.data();

        if (usersInfo.userId !== this.props.userId) {
          console.log(this.props.userId, "8=D", usersInfo);
          allData.push(res.data());
        }
      });
    });
    this.setState({ allData }, console.log("(o)(o)", this.state.allData));
    setTimeout(() => {
      this.filterDislikedAndLikedCards();
    }, 2000);
  };

  checkIfDeckNumberIsLow = (deck) => {
    let decksNumber = deck.length;
    if (decksNumber < 6) {
      this.getCards();
    }
  };

  filterDislikedAndLikedCards = async () => {
    let affectedCards = [];
    await usersDb
      .doc(this.props.userId)
      .collection("affected_cards")
      .get()
      .then((snap) => {
        snap.docs.forEach((res) => {
          console.log("(. )( .)", res.data());
          affectedCards.push(res.data());
        });
      });

    let mutableCardDeck = Array.from(this.state.allData);
    let doneCards = Array.from(this.state.dislikedCardDeckIDs);
    console.log("(. )( .), new card", affectedCards);
    await affectedCards.forEach((item) => {
      let nextArray = mutableCardDeck.filter(
        (card) => card.userId !== item.userId
      );
      mutableCardDeck = nextArray;
      console.log("(. )( .), new", mutableCardDeck);
    });
    this.setState({ allData: mutableCardDeck });
  };

  logout() {
    this.props.loggingOut(() => this.props.history.push("/"));
  }
  dislikeUser = (likedUsersId) => {
    usersDb
      .doc(this.props.userId)
      .collection("affected_cards")
      .add({ userId: likedUsersId.userId });
  };
  likeUser = (likedUsersId) => {
    usersDb
      .doc(this.props.userId)
      .collection("affected_cards")
      .add({ userId: likedUsersId.userId });
    usersDb
      .doc(likedUsersId.userId)
      .collection("gotLikeFrom")
      .add({ userId: this.props.userId });
  };

  checkIfaMatch = (likedUsersId) => {
    console.log("BOOB", likedUsersId);
    let likedusersData = likedUsersId;
    let thisUsersData = this.props.usersData;
    usersDb
      .doc(this.props.userId)
      .collection("gotLikeFrom")
      .where("userId", "==", likedUsersId.userId)
      .get()
      .then((res) => {
        console.log("resrsers", res.docs.length, "resrsers");
        if (res.docs.length === 0) {
          this.setState({
            itsAMatch: false,
            matchAge: "",
            matchName: "",
            matchImage: "",
            matchCity: "",
          });
        } else {
          this.setState({
            itsAMatch: true,
            matchAge: likedUsersId.age,
            matchName: likedUsersId.name,
            matchImage: likedUsersId.image,
            matchCity: likedUsersId.city,
          });

          dbase
            .doc()
            .collection("messages")
            .add({ mess: "sveiksasad" })
            .then((res) => {
              likedusersData.chatId = res.parent.parent.id;
              thisUsersData.chatId = res.parent.parent.id;
              usersDb
                .doc(this.props.userId)
                .collection("matches")
                .add(likedusersData);

              usersDb
                .doc(likedUsersId.userId)
                .collection("matches")
                .add(thisUsersData);
            });
        }
      })
      .catch((er) => {
        this.setState({
          itsAMatch: false,
          matchAge: "",
          matchName: "",
          matchImage: "",
          matchCity: "",
        });
      });
  };

  swipeLeft = (cardID) => {
    console.log("LEFT <<<<", cardID);
    let likedUsersId = cardID;
    let array = Array.from(this.state.allData);
    const newArray = array.filter((item) => item.userId !== cardID.userId);
    let dislikedCardDeckIDs = Array.from(this.state.dislikedCardDeckIDs);
    dislikedCardDeckIDs.push(cardID);
    this.setState(
      {
        allData: newArray,
        dislikedCardDeckIDs,
      },
      console.log("result is: ", dislikedCardDeckIDs, this.state.allData)
    );
    this.dislikeUser(likedUsersId);
  };
  swipeRight = (cardID) => {
    // firebase gauni palaikintojo card id ir pridedi prie zmogaus gautu like saraso savo id
    console.log("RIGHT >>>", cardID);
    let likedUsersId = cardID;
    let array = Array.from(this.state.allData);
    const newArray = array.filter((item) => item.userId !== cardID.userId);
    let dislikedCardDeckIDs = Array.from(this.state.dislikedCardDeckIDs);
    dislikedCardDeckIDs.push(cardID);
    this.setState(
      {
        allData: newArray,
        dislikedCardDeckIDs,
      },
      console.log("result is: ", dislikedCardDeckIDs, this.state.allData)
    );
    this.likeUser(likedUsersId);
    this.checkIfaMatch(likedUsersId);
  };

  render() {
    return (
      <div className="App">
        <div className="head">TINDERIS</div>
        <div className="navigation-bar">
          <div className="nav-leftSide">
            <div className="nav-item">
              <Link className="link" to="/main">
                Pagrindinis
              </Link>
            </div>
            <div className="nav-item">
              <Link className="link" to="/profile">
                Profilis
              </Link>
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
          Sveiki prisijungę prie TinderCOPIJOS seimos,{" "}
          {this.props.usersData ? this.props.usersData.name : ""}!
        </div>
        <div className="cards-list">
          {this.state.allData.map((usersData) => {
            return (
              <div className="card">
                <div className="card-image-container">
                  <img
                    className="card-image"
                    src={usersData.image}
                    alt="the rock!"
                  />
                </div>
                <div className="card-text-container">
                  <div className="card-text">
                    {usersData.name}, {usersData.age}
                  </div>
                  <div className="card-text">{usersData.city}</div>
                </div>
                <div className="card-buttons">
                  <div
                    className="card-button-left"
                    onClick={() => this.swipeLeft(usersData)}
                  >
                    <div className="oval">No</div>
                  </div>
                  <div
                    className="card-button-right "
                    onClick={() => this.swipeRight(usersData)}
                  >
                    <div
                      className="oval"
                      style={{ backgroundColor: "#338d4e" }}
                    >
                      Yes
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {this.state.itsAMatch ? (
            <div className="match-card">
              <div
                className="match-contgrats-message"
                style={{ marginTop: 10 }}
              >
                Jūs patinkat vienas kitam!
              </div>
              <div className="match-photo-container">
                <div className="match-photo-1-container">
                  <img
                    className="match-photo-2"
                    src={
                      this.props.usersData ? this.props.usersData.image : null
                    }
                    alt="the rock!"
                  />
                </div>
                <div className="match-photo-2-container">
                  <img
                    className="match-photo-1"
                    src={this.state.matchImage}
                    alt="the rock!"
                  />
                </div>
              </div>
              <div
                className="match-contgrats-message"
                style={{ marginBottom: 10 }}
              >
                &#9829; &#10084; Sveikinimai! &#10084; &#9829;
              </div>
              <div
                className="match-button-container"
                style={{ marginBottom: 10 }}
              >
                <div
                  className="match-button"
                  onClick={() => this.props.history.push("./game")}
                >
                  Susirašinėti
                </div>
                <div
                  className="match-button"
                  onClick={() => this.setState({ itsAMatch: false })}
                >
                  Žaisti toliau
                </div>
              </div>
            </div>
          ) : null}
        </div>
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
export default connect(mapStateToProps, {
  loggingOut,
  regEndAction,
  LOG_IF_IN_SYSTEM,
})(Main);
