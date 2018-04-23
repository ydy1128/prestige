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
                    console.log(this.props.user)
					let loginData = {
                        isLoggedIn: true,
                        id: this.props.user._id,
                        username: username,
                        role: url_ref
                    };
                    console.log(loginData)
                    console.log(this.props.user.user.name, url_ref)
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                    let msg = '환영합니다,\n' + this.props.user.user.name + 
                        (url_ref == 'teacher' ? ' 선생님' : ' 학생') + ' !';
                    Materialize.toast(msg, 2000);
                    browserHistory.push('/');
                    return true;
				}
				else {
                    let $toastContent = $('<span style="color: #FFB4BA">아이디 혹은 패스워드를 확인해주세요</span>');
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
        user: state.authentication.status.currentUser
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