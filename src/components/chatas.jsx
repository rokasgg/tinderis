import React, { Component } from "react";
import "../index.css";
import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { regEndAction } from "../redux/actions/regEndReducer";
import { LOG_IF_IN_SYSTEM } from "../redux/actions/logIFinSystem";
import { dbaseGetMessages } from "../firebase/firebase";
import { FaRegPaperPlane } from "react-icons/fa";
import * as Scroll from "react-scroll";
import {
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text_messages: [],
      textMessage: "",
      message: "",
      comesNewMessages: false,
      newMessagesCount: 0,
      newLengthOfMessages: null,
      previesLengthOfMessages: null,
    };
  }
  componentDidMount() {
    this.scrollAfterMount();
    this.listenerForNewMessages();
  }
  scrollDown = () => {
    if (this.getPosition()) {
      let lastInd = this.state.text_messages.length - 1;
      scroller.scrollTo(`messageNr:${lastInd}`, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        containerId: "chat2",
      });
      this.setState({ comesNewMessages: false });
    } else {
      let old = this.state.previesLengthOfMessages;
      let newOld = this.state.newLengthOfMessages;
      let newMessagesCount = old - newOld;

      this.setState({ comesNewMessages: true, newMessagesCount });
    }
  };
  scrollAfterMount = () => {
    let lastInd = this.state.text_messages.length - 1;
    scroller.scrollTo(`messageNr:${lastInd}`, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      containerId: "chat2",
    });
    this.setState({ comesNewMessages: false });
  };
  getOldMessagesNumb = () => {
    let previesMesArray = Array.from(this.state.text_messages);
    let previesLengthOfMessages = previesMesArray.length;
    this.setState({ previesLengthOfMessages });
  };
  getNewMessagesNumb = () => {
    let previesMesArray = Array.from(this.state.text_messages);
    let newLengthOfMessages = previesMesArray.length;
    this.setState({ newLengthOfMessages });
  };
  getPosition = () => {
    this.getNewMessagesNumb();
    var element = document.getElementById("chat2");
    var sum = element.scrollHeight - element.scrollTop;
    if (sum <= 500) {
      return true;
    } else {
      return false;
    }
  };
  componentWillUnmount() {
    console.log("UNMOUNTEEEEEEEEEEEEEEEEEEEEEd");
  }

  listenerForNewMessages = () => {
    let nesMessages = [];
    dbaseGetMessages
      .doc(this.props.profileInfo.chatId)
      .collection("messages")
      .orderBy("timeStamp", "desc")
      .limit(10)
      .onSnapshot(
        (snap) => {
          let changes = snap.docChanges();
          console.log("ITEMs LENGHT", changes.length);
          changes.forEach((ite) => {
            if (ite.type === "added") {
              nesMessages.push(ite.doc.data());
            }
            if (ite.type === "removed") {
              let itemsIndex = nesMessages.findIndex(
                (item) => item.timeStamp === ite.doc.data().timeStamp
              );
              if (itemsIndex > -1) {
                nesMessages.splice(itemsIndex, 1);
              }
            }
          });
          function compare(a, b) {
            const bandA = a.timeStamp;
            const bandB = b.timeStamp;

            let comparison = 0;
            if (bandA > bandB) {
              comparison = 1;
            } else if (bandA < bandB) {
              comparison = -1;
            }
            return comparison;
          }
          nesMessages.sort(compare);
          this.setState({ text_messages: nesMessages });
        },
        (err) => {
          console.log("Nepavyko isgauti zinutes", err);
        }
      );
  };
  doIt = async (text) => {
    let date = new Date();
    let yearStamp = date.getFullYear();
    let monthStamp =
      date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    let dayStamp =
      date.getDate() < 10 ? `0${date.getDate() + 1}` : date.getDate();
    let hourStamp =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    let minuteStamp =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    let secondStamp =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    let milSecStamp =
      date.getMilliseconds() < 100
        ? `0${date.getMilliseconds()}`
        : date.getMilliseconds();
    let dateStamp = `${yearStamp}-${monthStamp}-${dayStamp}`;
    let timeStamp = `${hourStamp}:${minuteStamp}:${secondStamp}.${milSecStamp}`;

    let message = {
      userId: this.props.userId,
      textMessage: text,
      timeStamp,
      dateStamp,
    };

    try {
      dbaseGetMessages
        .doc(this.props.profileInfo.chatId)
        .collection("messages")
        .add(message);
    } catch (err) {
      console.log("error", err);
    }
  };

  onStateChate = (newMessages) => {
    this.doIt(newMessages);
  };

  render() {
    console.log("paziurim", this.state.text_messages);
    return (
      <div className="chat-box">
        <div className="chat-container1">
          <img
            className="match-message-image"
            src={this.props.profileInfo ? this.props.profileInfo.image : null}
            alt="the rock!"
          />
        </div>
        <div className="chat-container2">
          <div className="chat-profile-text">
            Name: {this.props.profileInfo.name}
          </div>
          <div className="chat-profile-text">
            Age: {this.props.profileInfo ? this.props.profileInfo.age : null}
          </div>
          <div className="chat-profile-text">
            City: {this.props.profileInfo ? this.props.profileInfo.city : null}
          </div>
        </div>
        <div className="chat-container3">
          <div className="chat-chatborder" id="name">
            <div className="chat-name">
              {this.props.profileInfo ? this.props.profileInfo.name : null}
            </div>
          </div>

          <div
            className="chat-chatborder2"
            id="chat2"
            ref={(ref) => (this.chatBox = ref)}
          >
            {this.state.text_messages.map((text, index) => {
              if (text.userId === this.props.profileInfo.userId) {
                return (
                  <div className="text-box" name={`messageNr:${index}`}>
                    <div className="text_message_from_match">
                      <div className="match-chat-text-message-style">
                        {text.textMessage}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className="text-box-for-match"
                    name={`messageNr:${index}`}
                  >
                    <div className="text_message">
                      <div className="match-chat-text-message-style">
                        {text.textMessage}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {this.state.comesNewMessages ? (
              <div
                className="newMessages"
                onClick={() => this.scrollAfterMount()}
              >
                New Messages {this.state.newMessagesCount}
              </div>
            ) : null}
          </div>

          <div className="chat-chatborder3">
            <input
              className="chat-text-input"
              placeholder="Rašykite..."
              ref={(el) => (this._input = el)}
              onChange={(txt) => this.setState({ message: txt.target.value })}
              onKeyPress={(press) => {
                if (press.key === "Enter") {
                  sendTextMessage(this);
                  this.scrollDown();
                }
              }}
            ></input>
            <div className="chat-input-send-icon">
              <FaRegPaperPlane
                className="send-icon"
                onClick={() => sendTextMessage(this)}
              />
            </div>
          </div>
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

function sendTextMessage(klass) {
  console.log("SENDING MESSAGE", klass.state.message);
  klass.getOldMessagesNumb();
  klass.setState({ message: "" });
  klass.onStateChate(klass.state.message);
  klass._input.focus();
  klass._input.value = "";
}

export default connect(mapStateToProps, {
  loggingOut,
  regEndAction,
  LOG_IF_IN_SYSTEM,
})(Chat);
