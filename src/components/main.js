import React, { Component } from "react";
import "../index.css";
import "./cssprof/profile.scss";
import Spinner from "react-bootstrap/Spinner";

import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { regEndAction } from "../redux/actions/regEndReducer";
import { LOG_IF_IN_SYSTEM } from "../redux/actions/logIFinSystem";
import { firebaseApp, usersDb, dbase } from "../firebase/firebase";
import AfterMatchCard from "./afterMatchCard";
import GameCard from "./gameCard";
import NavigationBar from "./navigationBar";

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
      gettingData: false,
      itsAMatch: false,
      checkBox: false,
    };
  }
  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in", user);
        this.props.LOG_IF_IN_SYSTEM(
          user.email,
          user.uid,
          () => this.navToRegistration(),
          () => this.navigateToMain()
        );
      } else {
        console.log("User is logged out");
        this.props.history.push("/");
      }
    });
    this.getCards();
  }

  navToRegistration = () => {
    this.props.history.push("/finalReg");
  };

  navigateToMain = () => {
    this.props.history.push("/main");
  };

  startSpinning = () => {
    this.setState({ gettingData: true });
  };

  getCards = () => {
    this.startSpinning();
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

    setTimeout(() => {
      this.filterDislikedAndLikedCards(allData);
    }, 2000);
  };

  checkIfDeckNumberIsLow = (deck) => {
    let decksNumber = deck.length;
    if (decksNumber < 4) {
      this.getCards();
    }
  };

  filterDislikedAndLikedCards = async (allData) => {
    let affectedCards = [];
    await usersDb
      .doc(this.props.userId)
      .collection("affected_cards")
      .get()
      .then((snap) => {
        snap.docs.forEach((res) => {
          console.log(res.data());
          affectedCards.push(res.data());
        });
      });
    let mutableCardDeck = Array.from(allData);
    console.log("new card", affectedCards);
    affectedCards.forEach((item) => {
      let nextArray = mutableCardDeck.filter(
        (card) => card.userId !== item.userId
      );
      mutableCardDeck = nextArray;
      console.log("new", mutableCardDeck);
    });
    this.setState({ allData: mutableCardDeck, gettingData: false });
  };

  logout() {
    console.log("Logout?");
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
            .add({ mess: "test" })
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
        {/* STARTASZ */}
        <NavigationBar currentPage="main" logOutas={() => this.logout()} />
        {/* ENENENENEND */}

        {this.state.allData.length > 0 ? (
          <div className="cards-list">
            {this.state.allData.map((usersData) => {
              return (
                <GameCard
                  usersData={usersData}
                  onSwipeLeft={(usersInfo) => this.swipeLeft(usersInfo)}
                  onSwipeRight={(usersInfo) => this.swipeRight(usersInfo)}
                />
              );
            })}
            {this.state.itsAMatch ? (
              <AfterMatchCard
                goChating={() => this.props.history.push("./game")}
                continueToPlay={() => this.setState({ itsAMatch: false })}
                matchImage={this.state.matchImage}
                usersData={this.props.usersData}
              />
            ) : null}
          </div>
        ) : (
          <div className="cards-list">
            <div
              style={{
                justifyContent: "center",
                alignSelf: "center",
                color: "white",
              }}
            >
              {this.state.gettingData ? (
                <Spinner animation="grow" variant="light" size="sm" />
              ) : (
                "Daugiau naudotoju nebera!"
              )}
            </div>
          </div>
        )}
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
