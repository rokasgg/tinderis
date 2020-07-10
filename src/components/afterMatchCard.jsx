import React, { Component } from "react";
import "../index.css";

class AfterMatchCard extends Component {
  render() {
    return (
      <div className="match-card">
        <div className="match-contgrats-message" style={{ marginTop: 10 }}>
          Jūs patinkat vienas kitam!
        </div>
        <div className="match-photo-container">
          <div className="match-photo-1-container">
            <img
              className="match-photo-2"
              src={this.props.usersData ? this.props.usersData.image : null}
              alt="the rock!"
            />
          </div>
          <div className="match-photo-2-container">
            <img
              className="match-photo-1"
              src={this.props.matchImage}
              alt="the rock!"
            />
          </div>
        </div>
        <div className="match-contgrats-message" style={{ marginBottom: 10 }}>
          &#9829; &#10084; Sveikinimai! &#10084; &#9829;
        </div>
        <div className="match-button-container" style={{ marginBottom: 10 }}>
          <div className="match-button" onClick={() => this.props.goChating()}>
            Susirašinėti
          </div>
          <div
            className="match-button"
            onClick={() => this.props.continueToPlay()}
          >
            Žaisti toliau
          </div>
        </div>
      </div>
    );
  }
}

export default AfterMatchCard;
