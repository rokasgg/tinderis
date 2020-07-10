import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../components/cssprof/profile.scss";

class navigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonClicked: false,
    };
  }
  //   onClick={() => this.logout()}
  render() {
    return (
      <div>
        <div className="nav-box">
          <div className="box1">
            <div
              className="box1-item"
              id={this.props.currentPage === "main" ? "currentPage" : null}
            >
              <Link className="linkas" to="/main">
                Pagrindinis
              </Link>
            </div>
            <div
              className="box1-item"
              id={this.props.currentPage === "profile" ? "currentPage" : null}
            >
              <Link className="linkas" to="/profile">
                Profilis
              </Link>
            </div>
            <div
              className="box1-item"
              id={this.props.currentPage === "messages" ? "currentPage" : null}
            >
              <Link className="linkas" to="/game">
                Žinutės
              </Link>
            </div>
          </div>
          <div className="box2">
            <div className="box2-item">TINDERIS</div>
          </div>
          <div className="box3">
            <div className="box1-item" onClick={() => this.props.logOutas()}>
              Atsijungti
            </div>
          </div>
          <div
            className="box5"
            onClick={() => {
              this.setState({ buttonClicked: !this.state.buttonClicked });
            }}
          >
            <div className="box5-item">
              <i className="fas fa-bars"></i>
            </div>
          </div>
        </div>
        {this.state.buttonClicked ? (
          <div className="box4">
            <ul>
              <li
                className="box4-item"
                id={this.props.currentPage === "main" ? "currentPage" : null}
              >
                <Link
                  className="box4-item"
                  to="/main"
                  style={{ textDecoration: "none" }}
                >
                  Pagrindinis
                </Link>
              </li>
              <li
                className="box4-item"
                id={this.props.currentPage === "profile" ? "currentPage" : null}
              >
                <Link
                  className="box4-item"
                  to="/profile"
                  style={{ textDecoration: "none" }}
                >
                  Profilis
                </Link>
              </li>
              <li
                className="box4-item"
                id={
                  this.props.currentPage === "messages" ? "currentPage" : null
                }
              >
                <Link
                  className="box4-item"
                  to="/game"
                  style={{ textDecoration: "none" }}
                >
                  Žinutės
                </Link>
              </li>
              <li className="box4-item" onClick={() => this.props.logOutas()}>
                Atsijungti
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}
export default navigationBar;
