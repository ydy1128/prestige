import React from 'react';
import { Header } from 'components';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from 'actions/authentication';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    // get cookie by name
    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    componentDidMount() {


        // get loginData from cookie
        let loginData = this.getCookie('key');

        // if loginData is undefined, do nothing
        if(typeof loginData === "undefined") return;

        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));

        // if not logged in, do nothing
        if(!loginData.isLoggedIn) return;
        let url_ref = loginData.role;
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest(url_ref).then(
            () => {
                console.log(this.props.status);
                // if session is not valid
                if(!this.props.status.valid) {
                	let current_role = loginData.role;
                	console.log(current_role)
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        username: '',
                        role: current_role
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
            <div className="App">
                {isAuth ? undefined : <Header isLoggedIn={this.props.status.isLoggedIn}
                								onLogout={this.handleLogout}/>}
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