import { REGISTER_FINISHED_FAILED, REGISTER_FINISHED } from "../types";
import { firebaseApp } from "../../firebase/firebase";

export const regEndAction = (
  email,
  name,
  age,
  city,
  image,
  userId,
  callback
) => async (dispatch) => {
  console.log("FIRE REG-END ACTION!");
  try {
    try {
      firebaseApp
        .firestore()
        .collection("users")
        .doc(userId)
        .set({ email, name, age, city, image, userId });
      dispatch({
        type: REGISTER_FINISHED,
        payload: {
          email,
          name,
          age,
          city,
          image,
          userId,
          registrationFinished: true,
        },
      });
      callback();
    } catch {
      console.log("erroras baiginejant registracija");
      dispatch({
        type: REGISTER_FINISHED_FAILED,
        payload: {
          email,
          name,
          age,
          city,
          image,
          registrationFinished: false,
        },
      });
    }
  } catch (err) {
    console.log("erroras baiginejant registracija ", err);
    dispatch({
      type: REGISTER_FINISHED_FAILED,
      payload: {
        name,
        age,
        city,
        image,
        registrationFinished: false,
      },
    });
  }
};
