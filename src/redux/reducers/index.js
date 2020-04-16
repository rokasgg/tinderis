import { combineReducers } from "redux";
import loginReducers from './loginReducer';
import regRed from './regRed';

export default combineReducers({
    loginReducers,regRed
})