import React, { Component } from "react";
import "../index.css";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { regEndAction } from "../redux/actions/regEndReducer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fbStorage } from "../firebase/firebase";
import FileUploader from "react-firebase-file-uploader";
class FinalRegistrationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      age: new Date("2002"),
      ages: "",
      city: "",
      image: "",
      imageName: "Pridėti nuotrauką",
      nameValid: false,
      ageValid: false,
      cityInputValid: false,
    };
  }
  logout() {
    this.props.loggingOut(() => this.props.history.push("/"));
  }

  handleChange = (date) => {
    let age = this.formatBirthDate(date);
    console.log("age", age);
    this.setState({ ages: age, age: date });
    this.checkAgeInput(date);
  };
  checkAgeInput = (date) => {
    let todaysYear = new Date().getFullYear();
    let selectedYear = date.getFullYear();
    let difference = todaysYear - selectedYear;
    console.log("todaysYear", todaysYear, date.getFullYear());
    if (difference >= 18) {
      this.setState({ ageValid: false });
    } else {
      this.setState({ ageValid: true });
    }
  };

  formatBirthDate = (date) => {
    let selectedYear = `${date.getFullYear()}`;
    let selectedMonth =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : `${date.getMonth() + 1}`;
    let selectedDay =
      date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;

    let birthDate = {
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    };
    return birthDate;
  };

  checkEmailInput = () => {
    const regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]{1,3}$/;
    if (regex.test(this.state.name)) {
      console.log("true");
    } else {
      console.log("false");
    }
  };

  finistRegistration = () => {
    const { name, ages, city } = this.state;
    if (
      this.state.ageValid === false &&
      this.state.nameValid === false &&
      this.state.cityInputValid === false
    ) {
      if (name !== "" && ages !== "" && city !== "") {
        if (this.state.image !== "") {
          let image = this.state.image;
          this.props.regEndAction(
            this.props.email,
            name,
            ages,
            city,
            image,
            this.props.userId,
            () => this.props.history.push("/main")
          );
        } else {
          let image =
            "https://www.pngkey.com/png/full/107-1072091_computer-icons-user-profile-facebook-instagram-instagram-profile.png";
          this.props.regEndAction(
            this.props.email,
            name,
            ages,
            city,
            image,
            this.props.userId,
            () => this.props.history.push("/main")
          );
        }
      } else {
        alert("Prašome užpildyti visus laukelius!");
      }
    } else {
      alert("Įvesti duomenys neatitinka reikalavimu!");
    }
  };
  checkIfNameIsGood = (value) => {
    const reg = /[a-zA-Z]{6,}/;
    if (reg.test(value)) {
      return true;
    } else {
      return false;
    }
  };
  checkIfMoreThan6 = (val) => {
    const reg = /[a-zA-Z]{1,}/;
    console.log("Show me", reg.test(val));
    if (reg.test(val)) {
      this.setState({ name: val, nameValid: false });
    } else {
      this.setState({ name: val, nameValid: true });
    }
  };

  checkIfCityValid = (val) => {
    const reg = /^[a-zA-Z]+$/;
    console.log("Show me", reg.test(val));
    if (reg.test(val)) {
      this.setState({ city: val, cityInputValid: false });
    } else {
      this.setState({ city: val, cityInputValid: true });
    }
  };
  handleUploadStart = () => {};
  handleUploadSuccess = (fileName) => {
    console.log("asd", fileName);
    fbStorage
      .child(fileName)
      .getDownloadURL()
      .then((link) => this.setState({ image: link, imageName: fileName }));
  };
  render() {
    console.log("FinalRegistrationScreen screen propsai", this.props);
    return (
      <div className="App">
        <div className="navigation-bar">
          <div className="nav-leftSide"></div>
          <div className="nav-middleside">
            <div className="head">TINDERIS</div>
          </div>
          <div className="nav-rightside"></div>
        </div>
        <div className="background-field">
          <div
            className="welcomeMessage"
            style={{
              color: "white",
              fontSize: "20px",

              margin: "15px",
            }}
          >
            Sveiki prisijungę, {this.props.email}! Jums teliko užpildyti
            informaciją apie save.
          </div>

          <div className="inputContainer">
            <input
              onChange={(val) => this.checkIfMoreThan6(val.target.value)}
              placeholder="Vardas"
              className={this.state.nameValid ? "notValidInput" : "loginInpt"}
            />
            <DatePicker
              selected={this.state.age}
              onChange={this.handleChange}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className={this.state.ageValid ? "notValidInput" : "passwordInpt"}
            />
            <input
              onChange={(val) => this.checkIfCityValid(val.target.value)}
              placeholder="Miestas"
              className={
                this.state.cityInputValid ? "notValidInput" : "passwordInpt"
              }
            />

            <label
              for="imageUploadId"
              // onChange={(val) => this.setState({ image: val.target.value })}
              // style={{
              //   display: "flex",
              //   justifyContent: "flex-start",
              //   alignItems: "center",
              //   paddingLeft: "15px",
              // }}
              className="addImage"
            >
              {this.state.imageName}
            </label>

            <FileUploader
              accept="image/*"
              name="sveikas123"
              storageRef={fbStorage}
              onUploadStart={this.handleUploadStart}
              // onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
              id="imageUploadId"
              style={{ visibility: "hidden" }}
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
