import {
  LOGIN_IN,
  LOGOUT,
  LOGIN_FAILED,
  LOGIN_IF_IN_SYSTEM,
  REQUIRE_FINISH_REG,
} from "../types";

const loginState = (action) => {
  return {
    email: action.email,
    loggedIn: action.loggedIn,
    userId: action.userId,
    usersData: action.usersData,
    registered: false,
  };
};

const login = (state = [], action) => {
  let newData = null;

  switch (action.type) {
    case LOGIN_IN:
      newData = loginState(action.payload);
      return newData;
    case LOGIN_IF_IN_SYSTEM:
      newData = loginState(action.payload);
      return newData;
    case LOGIN_FAILED:
      newData = loginState({ email: "", userId: "", loggedIn: false });
      return newData;
    case REQUIRE_FINISH_REG:
      newData = loginState(action.payload);
      return newData;
    case LOGOUT:
      newData = loginState(action.payload);
      return newData;

    default:
      return state;
  }
};
export default login;
