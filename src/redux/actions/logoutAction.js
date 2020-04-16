import {LOGOUT} from '../types'; 
import { firebaseApp } from '../../firebase/firebase';

export const loggingOut = (navigateToLogin)=>async dispatch=> {
    dispatch({type:LOGOUT,payload:{
        email:'', password:'', loggedIn:false
    }}) 
    firebaseApp.auth().signOut();
    navigateToLogin();
}