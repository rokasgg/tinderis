import { LOGIN_IF_IN_SYSTEM, LOGIN_FAILED } from "../types";
import { usersDb } from "../../firebase/firebase";
export const getPropsIfLoggedIn = (email, userId, funck) => async (
  dispatch
) => {
  try {
    usersDb
      .where("email", "==", email)
      .get()
      .then((snap) => {
        snap.docs.forEach((res) => {
          let usersData = res.data();
          dispatch({
            type: LOGIN_IF_IN_SYSTEM,
            payload: {
              email,
              userId,
              loggedIn: true,
              usersData,
              registered: true,
            },
          });
          if (funck !== undefined) funck();
          else console.log("Else");
        });
      });
  } catch (err) {
    console.log("erroras prisijungiant try metode", err);
    dispatch({
      type: LOGIN_FAILED,
      payload: {
        email: "",
        password: "",
        userId: "",
        loggedIn: false,
        registered: false,
      },
    });
  }
};
