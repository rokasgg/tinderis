import {REGISTER, REGISTER_FINISHED} from '../types';


const initialState =(action)=> {
    return {
        email:action.email,
        password:action.password,
        registeredIn:action.registeredIn
    }
}
const initialStateAfterReg =(action)=> {
    return {
        age:action.age,
        name:action.name,
        registrationFinished:action.registrationFinished,
        image:action.image,
    }
}

const register = (state = [], action)=>{
    console.log('action', action)
    switch(action.type){
        case REGISTER:
            let regInfo =  initialState(action.payload)
            console.log('Reducer after registration state', regInfo)
            return regInfo; 
        case REGISTER_FINISHED:
            let regEndInfo =  initialStateAfterReg(action.payload)
            console.log('Reducer after FULL registration state', regEndInfo)
            return regEndInfo; 
        default: 
            return state;
    }
}
export default register