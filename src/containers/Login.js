import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { loginRequest } from 'actions/authentication';

class Login extends React.Component {
	constructor(props){
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
	}
	handleLogin(username, pw, url_ref){
		return this.props.loginRequest(username, pw, url_ref).then(
			() => {
				if(this.props.status === "SUCCESS"){
					// create session data
                    console.log(this.props.userid)
					let loginData = {
                        isLoggedIn: true,
                        id: this.props.user._id,
                        username: username,
                        role: url_ref
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    Materialize.toast('Welcome, ' + username + '!', 2000);
                    browserHistory.push('/');
                    return true;
				}
				else {
                    let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
			}
		)
	}
    render() {
        return (
            <div>
                <Authentication mode={true}
				                onLogin={this.handleLogin}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status,
        userid: state.authentication.status.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw, url_ref) => { 
            return dispatch(loginRequest(id,pw, url_ref)); 
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);