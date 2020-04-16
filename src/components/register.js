import React, { Component } from 'react';
import '../index.css'
import {Button} from 'react-bootstrap'
import {Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {registerAction} from '../redux/actions/registerAction';

class Register extends Component{
    constructor(){
        super()
        this.state={
            email:'',
            password:'',
            errorMessage:null,sfsd:''
        }
    }
    signUp =()=>{
        const { email, password} = this.state;
        if(email!== '' && password!== ''){
            this.props.registerAction(email, password,()=> this.props.history.push('/login'));
        }
        else( this.setState({errorMessage:'Prašome užpildyti visus laukelius!'}))
    }
    render(){
        console.log('COMING PROPS:', this.props.registerSuccess,this.props.name, this.props)
        return(
            <div className='App'>
                <div className='head'>
                    TINDERIS
                </div>
                <div className='inputs'>
                    <input onChange={(val)=>this.setState({email:val.target.value})} placeholder='Elektroninis paštas' className='loginInpt'/>
                    <input onChange={(val)=>this.setState({password:val.target.value})} placeholder='Slaptažodis' className='passwordInpt' type='password' onKeyDown={press =>{
                        if(press.key === 'Enter'){
                            this.signUp()
                        }
                    }}/>
                    <div style={{color:'white'}}>{this.state.errorMessage}</div>
                </div>
                <div className='buttons'>
                    <Button onClick={()=>this.signUp()} variant="outline-light" className='button'>Registruotis</Button>
                    <Link to='/login'><Button onClick={()=>{console.log("STATE IS: ", this.state)}} variant="outline-light" className='button' >Jau turiu paskyrą </Button>
               </Link> </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        name:state.regRed.email,
        registerSuccess:state.regRed.registeredIn
    }
}
export default connect(mapStateToProps,{registerAction})(Register)