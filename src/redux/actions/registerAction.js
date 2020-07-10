import { REGISTER, REGISTER_FAILED } from "../types";
import { firebaseApp } from "../../firebase/firebase";

export const registerAction = (
  email,
  password,
  callback,
  errorMessageDisplay
) => async (dispatch) => {
  console.log("FIRE REG ACTION!");
  try {
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("respone", res);
        let userId = res.user.uid;
        dispatch({
          type: REGISTER,
          payload: {
            email,
            password,
            userId,
            registeredIn: true,
          },
        });
        callback();
      })
      .catch((err) => {
        console.log("erroras reginantisjkl", err);
        dispatch({
          type: REGISTER_FAILED,
          payload: {
            email: "",
            password: "",
            registeredIn: false,
          },
        });
        errorMessageDisplay(err);
      });
  } catch (err) {
    console.log("erroras reginantis", err);
    dispatch({
      type: REGISTER_FAILED,
      payload: {
        email: "",
        password: "",
        registeredIn: false,
      },
    });
  }
};
