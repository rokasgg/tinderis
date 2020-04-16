import React, { Component } from "react";
import "../index.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { LOGGING_IN } from "../redux/actions/loginAction";
import { LOG_IF_IN_SYSTEM } from "../redux/actions/logIFinSystem";
import { firebaseApp } from "../firebase/firebase";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }
  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in", user);
        this.props.LOG_IF_IN_SYSTEM(user.email, user.uid);
        this.props.history.push("/main");
      } else {
        console.log("User is logged out");
        this.props.history.push("/");
      }
    });
  }
  showMessage = (message) => {
    alert("Įvesti duomenys yra neteisingi arba neegzistuoja!");
  };

  navigateToMain = () => {
    this.props.history.push("/main");
  };

  goNextPage = () => {
    if (this.state.email !== "" && this.state.password !== "") {
      this.props.LOGGING_IN(
        this.state.email,
        this.state.password,
        () => this.props.history.push("/finalReg"),
        () => this.showMessage(),
        () => this.navigateToMain()
      );
    } else {
      alert("Prašome užpildyti visus laukelius!");
    }
  };

  render() {
    console.log("propsz:", this.props);
    return (
      <div className="App">
        <div className="head">TINDERIS</div>
        <div className="inputs">
          <input
            onChange={(txt) => this.setState({ email: txt.target.value })}
            placeholder="Elektroninis paštas"
            className="loginInpt"
          />
          <input
            onChange={(txt) => this.setState({ password: txt.target.value })}
            type="password"
            placeholder="Slaptažodis"
            className="passwordInpt"
            onKeyDown={(press) => {
              if (press.key === "Enter") {
                this.goNextPage();
              }
            }}
          />
        </div>
        <div className="buttons">
          <Button
            onClick={() => this.goNextPage()}
            variant="outline-light"
            className="button"
          >
            Prisijungti
          </Button>

          <Link to="/register">
            <Button variant="outline-light" className="button">
              Naujas naudotojas?
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginState: state.loginReducers,
  };
}

export default connect(mapStateToProps, { LOGGING_IN, LOG_IF_IN_SYSTEM })(
  Login
);
