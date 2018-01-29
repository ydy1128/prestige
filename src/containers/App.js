import React from 'react';
import { Header } from 'components';
import { connect } from 'react-redux';
import getLoginData from 'components/commons/SessionData';
import { getStatusRequest, logoutRequest } from 'actions/authentication';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.loginStatus = this.loginStatus.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    loginStatus(){
        let loginData = getLoginData();
        if(typeof loginData === "undefined") return;

        // if not logged in, do nothing
        if(!loginData.isLoggedIn) return;
        let url_ref = loginData.role;
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        return this.props.getStatusRequest(url_ref).then(
            () => {
                console.log(this.props.status);
                // if session is not valid
                if(!this.props.status.valid) {
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        username: '',
                        role: url_ref
                    };

                    document.cookie='key=' + btoa(JSON.stringify(loginData));

                    // and notify
                    let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                    Materialize.toast($toastContent, 4000);

                }
            }
        );
    }
    handleLogout() {
        let loginData = this.getCookie('key');
        loginData = JSON.parse(atob(loginData));
        let url_ref = loginData.role;

        this.props.logoutRequest(url_ref).then(
            () => {
                Materialize.toast('Good Bye!', 2000);

                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: '',
                    role: url_ref
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            }
        );
    }
    render(){

        let re = /(login|register)/;
        let isAuth = re.test(this.props.location.pathname);

        return (
            <div style={{width: '100%', height: '100%', minWidth: 1024, minHeight: 768}}>
                {isAuth ? undefined : <Header isLoggedIn={this.props.status.isLoggedIn}
                								onLogout={this.handleLogout}
                                                loginStatus={this.loginStatus}
                                                userInfo={this.props.status.currentUser} />}
                { this.props.children }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: (url_ref) => {
            return dispatch(getStatusRequest(url_ref));
        },
        logoutRequest: (url_ref) => {
            return dispatch(logoutRequest(url_ref));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);