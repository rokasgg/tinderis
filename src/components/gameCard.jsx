import React, { Component } from "react";
import "../index.css";
import { calculateAge } from "../helpers/calculateAge";
class GameCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
    };
  }

  componentDidMount() {
    let age = calculateAge(this.props.usersData.age, "receive");
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
