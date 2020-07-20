import { LOGIN_IF_IN_SYSTEM, LOGIN_FAILED, REQUIRE_FINISH_REG } from "../types";
import { usersDb } from "../../firebase/firebase";
export const LOG_IF_IN_SYSTEM = (
  email,
  userId,
  navToRegEnd,
  navToMain
) => async (dispatch) => {
  try {
    usersDb
      .where("email", "==", email)
      .get()
      .then((snap) => {
        if (snap.docs.length > 0) {
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
            navToMain();
          });
        } else {
          dispatch({
            type: REQUIRE_FINISH_REG,
            payload: {
              email,
              userId,
              loggedIn: true,
              usersData: {},
              registered: false,
            },
          });
          navToRegEnd();
        }
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
      },
    });
  }
};
