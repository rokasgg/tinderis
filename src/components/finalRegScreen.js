import React, { Component } from "react";
import "../index.css";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { regEndAction } from "../redux/actions/regEndReducer";

class FinalRegistrationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      age: "",
      city: "",
      image: "",
    };
  }
  logout() {
    this.props.loggingOut(() => this.props.history.push("/"));
  }
  finistRegistration = () => {
    const { name, age, city, image } = this.state;
    this.props.regEndAction(
      this.props.email,
      name,
      age,
      city,
      image,
      this.props.userId,
      () => this.props.history.push("/main")
    );
  };
  render() {
    console.log("FinalRegistrationScreen screen propsai", this.props);
    return (
      <div className="App">
        <div className="head">TINDERIS</div>

        <div className="welcomeMessage">
          Sveiki prisijungę, {this.props.email}! Jums teliko užpildyti
          informaciją apie save.
        </div>
        <div className="inputContainer">
          <input
            onChange={(val) => this.setState({ name: val.target.value })}
            placeholder="Vardas"
            className="loginInpt"
          />
          <input
            onChange={(val) => this.setState({ age: val.target.value })}
            placeholder="Metai"
            className="passwordInpt"
          />
          <input
            onChange={(val) => this.setState({ city: val.target.value })}
            placeholder="Miestas"
            className="passwordInpt"
          />
          <input
            onChange={(val) => this.setState({ image: val.target.value })}
            placeholder="Pridėti nuotrauką"
            className="passwordInpt"
          />
        </div>
        <div className="buttons">
          <Button
            onClick={() => this.finistRegistration()}
            variant="outline-light"
            className="button"
          >
            Registruotis
          </Button>
        </div>

        <div>
          <Button variant="outline-light" onClick={() => this.logout()}>
            Atsijungti
          </Button>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    email: state.loginReducers.email,
    userId: state.loginReducers.userId,
  };
}
export default connect(mapStateToProps, { loggingOut, regEndAction })(
  FinalRegistrationScreen
);
