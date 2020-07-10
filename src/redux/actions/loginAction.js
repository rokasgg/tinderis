import { LOGIN_IN, LOGIN_FAILED } from "../types";
import { firebaseApp } from "../../firebase/firebase";
export const LOGGING_IN = (
  email,
  password,
  navToRegEnd,
  message,
  navigateInToSystem
) => async (dispatch) => {
  try {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        let userId = res.user.uid;
        console.log("sadsa");
        dispatch({
          type: LOGIN_IN,
          payload: {
            email,
            password,
            userId,
            loggedIn: true,
          },
        });
        firebaseApp
          .firestore()
          .collection("users")
          .where("email", "==", email)
          .get()
          .then((res) => {
            if (res.docs.length !== 0) {
              console.log("sad", res);
              navigateInToSystem();
            } else {
              navToRegEnd();
            }
          });
      })
      .catch((err) => {
        console.log("firebase erroras prisijungiant", err);
        dispatch({
          type: LOGIN_FAILED,
          payload: {
            email,
            password,
            loggedIn: false,
          },
        });
        message(err);
      });
  } catch (err) {
    console.log("erroras prisijungiant try metode", err);
    dispatch({
      type: LOGIN_FAILED,
      payload: {
        email,
        password,
        loggedIn: false,
      },
    });
    message();
  }
};
