import React, { Component } from "react";
import "../index.css";

class GameCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
    };
  }
  calculateAge = (date, status) => {
    let todaysYear = new Date().getFullYear();
    let todayMonth = new Date().getMonth() + 1;
    let todaysDay = new Date().getDate();

    if (status === "receive") {
      let birthYear = parseInt(date.year);
      let birthMonth = parseInt(date.month);
      let birthDay = parseInt(date.day);
      let differences = todaysYear - birthYear;
      if (differences > 18) {
        const age = differences;

        if (birthMonth < todayMonth) {
          let olderAge = differences;

          return olderAge;
        } else {
          if (birthMonth === todayMonth) {
            //You Sir might have a change!
            if (birthDay <= todaysDay) {
              let olderAge = differences;

              return olderAge;
            } else {
              let ageRemains = differences - 1;

              return ageRemains;
            }
          } else {
            let ageRemains = differences - 1;

            return ageRemains;
          }
        }
      } else {
        if (differences === 18) {
          //CHECK IF MONTH IS MORE THAN TODAYS MONTH
          if (birthMonth < todayMonth) {
            let olderAge = differences;

            return olderAge;
          } else {
            if (birthMonth === todayMonth) {
              //You Sir might have a change!
              if (birthDay <= todaysDay) {
                let olderAge = differences;

                return olderAge;
              } else {
                let ageRemains = differences - 1;

                return ageRemains;
              }
            } else {
              let ageRemains = differences - 1;

              return ageRemains;
            }
          }
        } else {
          console.log("17metis or less");
          return null;
        }
      }
    } else if (status === "change") {
      let selectedYear = date.getFullYear();
      let selectedMonth = date.getMonth() + 1;

      let selectedDay = date.getDate();
      let difference = todaysYear - selectedYear;
      if (difference > 18) {
        const age = difference;

        if (selectedMonth < todayMonth) {
          let olderAge = difference;
          console.log("Age is ", olderAge);
          return olderAge;
        } else {
          if (selectedMonth === todayMonth) {
            //You Sir might have a change!
            if (selectedDay <= todaysDay) {
              let olderAge = difference;
              console.log("Age is ", olderAge);
              return olderAge;
            } else {
              let ageRemains = difference - 1;
              console.log("Age is ", ageRemains);
              return ageRemains;
            }
          } else {
            let ageRemains = difference - 1;
            console.log("Age is ", ageRemains);
            return ageRemains;
          }
        }
      } else {
        if (difference === 18) {
          //CHECK IF MONTH IS MORE THAN TODAYS MONTH
          if (selectedMonth < todayMonth) {
            let olderAge = difference;
            console.log("Age is ", olderAge);
            return olderAge;
          } else {
            if (selectedMonth === todayMonth) {
              //You Sir might have a change!
              if (selectedDay <= todaysDay) {
                let olderAge = difference;
                console.log("Age is ", olderAge);
                return olderAge;
              } else {
                let ageRemains = difference - 1;
                console.log("Age is ", ageRemains);
                return ageRemains;
              }
            } else {
              let ageRemains = difference - 1;
              console.log("Age is ", ageRemains);
              return ageRemains;
            }
          }
        } else {
          console.log("17metis or less");
          return null;
        }
      }
    }
  };
  componentDidMount() {
    let age = this.calculateAge(this.props.usersData.age, "receive");
    this.setState({ age });
  }

  render() {
    return (
      <div className="card">
        <div className="card-image-container">
          <img
            className="card-image"
            src={this.props.usersData.image}
            alt="the rock!"
          />
        </div>
        <div className="card-text-container">
          <div className="card-text">
            {this.props.usersData.name},{" "}
            {this.state.age ? this.state.age : null}
          </div>
          <div className="card-text">{this.props.usersData.city}</div>
        </div>
        <div className="card-buttons">
          <div
            className="card-button-left"
            onClick={() => this.props.onSwipeLeft(this.props.usersData)}
          >
            <div className="oval">&#10005;</div>
          </div>
          <div
            className="card-button-right "
            onClick={() => this.props.onSwipeRight(this.props.usersData)}
          >
            <div
              className="oval"
              style={{ backgroundColor: "rgba(18, 144, 60, 0.801)" }}
            >
              &#10003;
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GameCard;
