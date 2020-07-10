import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";

import "./cssprof/profile.scss";
import "./cssprof/profileTab.scss";
import NavigationBar from "./navigationBar";
import { connect } from "react-redux";
import { loggingOut } from "../redux/actions/logoutAction";
import { getPropsIfLoggedIn } from "../redux/actions/ifLoggedGetProps";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usersDb, fbStorage, firebaseApp } from "../firebase/firebase";
import FileUploader from "react-firebase-file-uploader";
import { formatAge } from "../helpers/formatAge";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      image: "",
      city: "",
      age: "",
      loadgin: false,
      ages: new Date(),
      ageValid: false,
      uploading: false,
    };
  }
  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.getPropsIfLoggedIn(user.email, user.uid, () =>
          this.getProps()
        );
      } else {
        console.log("User is logged out");
        this.props.history.push("/");
      }
    });
  }

  getProps = () => {
    console.log(
      "EJOOJEOJEJOE",
      this.props.usersData,
      formatAge(this.props.usersData.age, "receive")
    );
    if (this.props.usersData === undefined) {
      this.setState({ name: "", age: "", city: "", image: "" });
    } else {
      const { name, age, city, image } = this.props.usersData;
      this.setState({
        name,
        age: formatAge(age, "receive"),
        ages: new Date(`${age.year}-${age.month}-${age.day}`),
        city,
        image,
      });

      formatAge(age, "receive");
    }
  };
  startLoading = () => {
    this.setState({
      loadgin: true,
    });
  };
  finishLoading = (fileName) => {
    this.setState({
      loadgin: false,
      fileName,
    });
  };
  onEditBtnClick = async () => {
    const { name, age, city, image } = this.state;
    if (image !== "" && name !== "" && age !== "" && city !== "")
      await usersDb
        .doc(this.props.userId)
        .update({ name, age, city, image })
        .then()
        .catch((err) => this.setState({ errorMessage: "Įvyko klaida" }));
  };
  handleChange = (date) => {
    let ages = this.formatBirthDate(date);
    this.setState({
      ages: date,
      age: ages,
    });
    this.checkAgeInput(date, "change");
    let yearsOld = formatAge(date, "change");
    console.log("GALU GALE GAUNA METUS ", yearsOld, ages);
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
  checkAgeInput = (date) => {
    let todaysYear = new Date().getFullYear();
    let selectedYear = date.getFullYear();

    let difference = todaysYear - selectedYear;

    let selectedMonth = date.getMonth() + 1;
    let todayMonth = new Date().getMonth() + 1;

    let selectedDay = date.getDate();
    let todaysDay = new Date().getDate();

    if (difference > 18) {
      console.log("Legit age");
      this.setState({ ageValid: false });
    } else {
      if (difference === 18) {
        //CHECK IF MONTH IS MORE THAN TODAYS MONTH
        if (selectedMonth < todayMonth) {
          console.log("Legit age");
          this.setState({ ageValid: false });
        } else {
          if (selectedMonth === todayMonth) {
            //You Sir might have a change!
            if (selectedDay <= todaysDay) {
              console.log("Legit age");
              this.setState({ ageValid: false });
            } else {
              console.log("Not legit age");
              this.setState({ ageValid: true });
            }
          } else {
            console.log("Not legit age");
            this.setState({ ageValid: true });
          }
        }
      } else {
        console.log("Not legit age");
        this.setState({ ageValid: true });
      }
    }
  };
  uploadingStuff = () => {
    this.setState({ uploading: true });
  };
  handleUploadStart = () => {};
  handleUploadSuccess = (fileName) => {
    this.uploadingStuff();
    console.log("asd", fileName);
    fbStorage
      .child(fileName)
      .getDownloadURL()
      .then((link) => this.setState({ image: link, uploading: false }));
  };
  logout() {
    console.log("vyksta kakzs?");
    this.props.loggingOut(() => this.props.history.push("/"));
  }
  render() {
    return (
      <div className="image-background">
        {/* STARTASZ */}
        <NavigationBar currentPage="profile" logOutas={() => this.logout()} />
        {/* ENENENENEND */}
        <div className="profile-tab">
          <div className="profile-box1"></div>
          <div className="profile-box2">
            {this.state.image === "" ? (
              <div className="profile-image-spinner">
                <Spinner animation="border" variant="light" size="lg" />
              </div>
            ) : (
              <img
                className="profile-image"
                src={this.state.image}
                alt="Profile_Picture"
              />
            )}
            <label className="profile-image-icon" for="hell">
              <div style={{ fontSize: "18px", marginRight: 5 }}>
                Pakeisti nuotrauką
              </div>
              <i class="far fa-image"></i>
            </label>
          </div>
          <div className="profile-box3">
            <div className="profile-bo3-everything">
              <div className="profile-text">Vardas</div>
              <input
                className="profile-input"
                value={this.state.name}
                onChange={(text) => {
                  this.setState({ name: text.target.value });
                }}
              />
              <div className="profile-text">Metai</div>

              <DatePicker
                selected={this.state.ages}
                onChange={this.handleChange}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className={
                  this.state.ageValid
                    ? "profile-text-notValid"
                    : "profile-input"
                }
              />
              <div className="profile-text">Miestas</div>
              <input
                className="profile-input"
                value={this.state.city}
                onChange={(text) => {
                  this.setState({ city: text.target.value });
                }}
              />
            </div>
            <div
              className="profile-buttons"
              onClick={() => this.onEditBtnClick()}
            >
              <div className="profile-buttons-child">
                {this.state.loadgin ? (
                  <i class="fas fa-spinner"></i>
                ) : (
                  "Redagtuoti"
                )}
              </div>
            </div>
            <div>
              <FileUploader
                accept="image/*"
                name="sveikas123"
                storageRef={fbStorage}
                onUploadStart={this.handleUploadStart}
                // onUploadError={this.handleUploadError}
                onUploadSuccess={this.handleUploadSuccess}
                onProgress={this.handleProgress}
                id="hell"
                style={{ visibility: "hidden" }}
              />
            </div>
          </div>
          <div className="profile-box4"></div>
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
export default connect(mapStateToProps, {
  loggingOut,
  getPropsIfLoggedIn,
})(Profile);
