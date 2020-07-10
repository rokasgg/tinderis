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
      emailValid: false,
      passwordValid: false,
      errorMessage: "",
    };
  }
  componentWillMount() {
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
  }
  showMessage = (message) => {
    if (message.code === "auth/user-not-found") {
      this.setState({
        errorMessage:
          "Naudotojas įvestu elektroniniu paštu neegzistuoja arba buvo pašalintas!",
      });
    } else if (message.code === "auth/wrong-password") {
      this.setState({
        errorMessage: "Įvestas slaptažodis yra neteisingas!",
      });
    } else if (message.code === "auth/too-many-requests") {
      this.setState({
        errorMessage:
          "Viršytas bandymų limitas prisijungti prie sistemos! Prašome pabandyti vėliau!",
      });
    }
  };

  navToRegistration = () => {
    this.props.history.push("/finalReg");
  };

  navigateToMain = () => {
    this.props.history.push("/main");
  };

  goNextPage = () => {
    const { email, password } = this.state;
    let emailValid = this.checkEmailChange(email);
    let passwordValid = this.checkIfPasswordWorks(password);
    console.log("check sir", emailValid, passwordValid);
    if (emailValid && passwordValid) {
      this.props.LOGGING_IN(
        this.state.email,
        this.state.password,
        () => this.props.history.push("/finalReg"),
        (mes) => this.showMessage(mes),
        () => this.navigateToMain()
      );
    } else {
      if (passwordValid === false && emailValid === false) {
        this.setState({
          errorMessage:
            "Neteisingai įvestas elektroninis paštas ir slaptažodis!",
        });
      }
    }
  };

  checkEmailChange = (val) => {
    const regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]{1,3}$/;
    if (regex.test(val)) {
      this.setState({ emailValid: false });
      return true;
    } else {
      this.setState({
        emailValid: true,
        errorMessage: "Neteisingai įvestas elektroninis paštas!",
      });
      return false;
    }
  };

  checkIfPasswordWorks = (val) => {
    const regex = /[a-zA-Z0-9.+-]{6,}/;
    if (regex.test(val)) {
      this.setState({ passwordValid: false });
      return true;
    } else {
      this.setState({
        passwordValid: true,
        errorMessage: "Neteisingai įvestas slaptažodis!",
      });
      return false;
    }
  };

  render() {
    console.log("propsz:", this.props);
    return (
      <div className="App">
        {/* <div className="navigation-bar">
          <div className="nav-leftSide"></div>
          <div className="nav-middleside">
            <div className="head">TINDERIS</div>
          </div>
          <div className="nav-rightside"></div>
        </div> */}
        <div className="flexBox1">TINDERIS</div>

        <div className="background-color">
          <div className="inputs">
            <input
              onChange={(txt) => this.setState({ email: txt.target.value })}
              placeholder="Elektroninis paštas"
              className={this.state.emailValid ? "notValidInput" : "loginInpt"}
            />
            <input
              onChange={(txt) => this.setState({ password: txt.target.value })}
              type="password"
              placeholder="Slaptažodis"
              className={
                this.state.passwordValid ? "notValidInput" : "loginInpt"
              }
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
          <div className="errorMessageDisplay">{this.state.errorMessage}</div>
        </div>
        <div className="flexBox1"></div>
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
