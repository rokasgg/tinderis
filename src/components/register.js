import React, { Component } from "react";
import "../index.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { registerAction } from "../redux/actions/registerAction";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      sfsd: "",
      passwordValid: false,
      emailValid: false,
    };
  }
  signUp = () => {
    const { email, password } = this.state;
    let isEmailValid = this.checkEmailChange(email);
    let isPasswordValid = this.checkIfPasswordWorks(password);
    if (isEmailValid && isPasswordValid) {
      this.props.registerAction(
        email,
        password,
        () => this.props.history.push("/login"),
        (mes) => this.showMessage(mes)
      );
    } else {
      if (isEmailValid === false && isPasswordValid === false) {
        this.setState({
          errorMessage:
            "Neteisingai suformatuotas elektroninis paštas ir slaptažodis!",
        });
      }
    }
  };

  showMessage = (message) => {
    console.log("error mes", message);
    if (message.code === "auth/email-already-in-use") {
      this.setState({
        errorMessage: "Naudotojas įvestu elektroniniu paštu jau egzistuoja!",
      });
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
        errorMessage: "Neteisingai suformuotas elektroninis paštas!",
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
        errorMessage: "Neteisingai suformuotas slaptažodis!",
      });
      return false;
    }
  };

  render() {
    console.log(
      "COMING PROPS:",
      this.props.registerSuccess,
      this.props.name,
      this.props
    );
    return (
      <div className="App">
        <div className="flexBox1">REGISTRACIJA</div>
        <div className="background-field">
          {/* <div className="head" style={{ color: "white" }}>
            REGISTRACIJA
          </div> */}
          <div className="inputs">
            <input
              onChange={(val) => this.setState({ email: val.target.value })}
              placeholder="Elektroninis paštas"
              className={this.state.emailValid ? "notValidInput" : "loginInpt"}
            />
            <input
              onChange={(val) => this.setState({ password: val.target.value })}
              placeholder="Slaptažodis"
              className={
                this.state.passwordValid ? "notValidInput" : "passwordInpt"
              }
              type="password"
              onKeyDown={(press) => {
                if (press.key === "Enter") {
                  this.signUp();
                }
              }}
            />
          </div>
          <div className="buttons">
            <Button
              onClick={() => this.signUp()}
              variant="outline-light"
              className="button"
            >
              Registruotis
            </Button>
            <Link to="/login">
              <Button
                onClick={() => {
                  console.log("STATE IS: ", this.state);
                }}
                variant="outline-light"
                className="button"
              >
                Jau turiu paskyrą
              </Button>
            </Link>
          </div>{" "}
          <div className="errorMessageDisplay">{this.state.errorMessage}</div>
        </div>
        <div className="flexBox1">TINDERIS</div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    name: state.regRed.email,
    registerSuccess: state.regRed.registeredIn,
  };
}
export default connect(mapStateToProps, { registerAction })(Register);
