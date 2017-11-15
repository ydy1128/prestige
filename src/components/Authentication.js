import React from 'react';
import { Link } from 'react-router';

class Authentication extends React.Component {
    constructor(props) {
        super(props);

        let loginData = this.getCookie('key');
        loginData = JSON.parse(atob(loginData));

        let initial_ref = loginData.role == undefined ? 'student' : loginData.role;

        this.state = {
            username: "",
            password: "",
            name: "",
            school: "",
            level: "",
            level_max: "6",
            ref: initial_ref
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleEnterPress = this.handleEnterPress.bind(this);
    }
    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    handleChange(e) {
        let nextState = {};
        if(e.target.name == 'school' && e.target.value[2] == '초'){
            nextState['level_max'] = '6';
        }
        else{
            nextState['level_max'] = '3';
        }
        if(e.target.name == 'level' && e.target.value > this.state.level_max){
            e.target.value = this.state.level_max;
        }

        nextState[e.target.name] = e.target.value;
        this.setState(nextState);

    }
    handleLogin() {
        let id = this.state.username;
        let pw = this.state.password;
        let url_ref = this.state.ref;
        this.props.onLogin(id, pw, url_ref).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }
    handleRegister() {
        let id = this.state.username;
        let pw = this.state.password;
        let name = this.state.name;
        let school = this.state.school;
        let level = this.state.level;

        let url_ref = this.state.ref;

        this.props.onRegister(id, pw, name, school, level, url_ref).then(
            (result) => {
                if(!result) {
                    this.setState({
                        username: '',
                        password: ''
                    });
                }
            }
        );
    }
    handleEnterPress(e) {
        if(e.charCode==13) {
            if(this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }
    handleRef(ref){
        this.setState((prevState) => {
            if(prevState.ref != ref){
                let new_ref = prevState.ref == 'student' ? 'teacher' : 'student';
                return {ref: new_ref}
            }
        });
    }
    isActive(ref){
        if(ref == this.state.ref){
            return 'tab-buttons center active';
        }
        else{
            return 'tab-buttons center';
        }
    }
    render() {
        const authBoxes =(
            <div>
                <div className="input-field col s12 username">
                    <label>아이디</label>
                    <input
                    name="username"
                    type="text"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.username} 
                    />
                </div>
                <div className="input-field col s12">
                    <label>패스워드</label>
                    <input
                    name="password"
                    type="password"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.password}
                    onKeyPress={this.props.mode ? this.handleEnterPress : undefined}/>
                </div>
            </div>
        )
        const footerView = (
            <div className="footer">
                <div className="card-content">
                    <div className="right" >
                        {this.props.mode ? '회원이 아니신가요?' : '이미 회원이신가요?'}
                        {this.props.mode ? (<Link to="/register"> 회원가입</Link>) : (<Link to="/login"> 로그인</Link>)}
                    </div>
                </div>
            </div>
        )
        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        {authBoxes}
                        <a  className="waves-effect btn"
                            onClick={this.handleLogin}>로그인</a>
                    </div>
                </div>
                {footerView}
            </div>
        );
        const studentView = (
            <div>
                <div className="input-field col s12 school">
                    <label>학교</label>
                    <input
                    name="school"
                    type="text"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.school} 

                    />
                </div>
                <div className="input-field col s12 level">
                    <label>학년</label>
                    <input
                        name="level"
                        type="number"
                        className="validate"
                        onChange={this.handleChange}
                        value={this.state.level}
                        min="1"
                        max={this.state.level_max}/>
                </div>
            </div>
        )
        const registerView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        {authBoxes}
                        <div className="input-field col s12">
                            <label>{this.state.ref == "student" ? '이름' : '성함'}</label>
                            <input
                            name="name"
                            type="text"
                            className="validate"
                            onChange={this.handleChange}
                            value={this.state.name}
                            onKeyPress={!this.props.mode && this.state.ref=='teacher' ? this.handleEnterPress : undefined}/>
                        </div>
                        {this.state.ref == "student" ? studentView : undefined}
                        <a className="waves-effect waves-light btn"
                            onClick={this.handleRegister}>가입</a>
                    </div>
                </div>
                {footerView}
            </div>
        );

        return (
            <div className="container auth">
                <div className="card">
                    <div className="header white-text center">
                        <div className="card-content">{this.props.mode ? "로그인" : "회원가입"}</div>
                    </div>
                    <div className="tabs">
                        <div className={this.isActive('student')} onClick={this.handleRef.bind(this, 'student')}>학생</div>
                        <div className={this.isActive('teacher')} onClick={this.handleRef.bind(this, 'teacher')}>선생님</div>
                    </div>
                    {this.props.mode ? loginView : registerView }
                </div>
            </div>
        );
    }
}

Authentication.propTypes = {
    mode: React.PropTypes.bool,
    onLogin: React.PropTypes.func,
    onRegister: React.PropTypes.func
};

Authentication.defaultProps = {
    mode: true,
    onLogin: (id, pw) => { console.error("login function not defined"); },
    onRegister: (id, pw) => { console.error("register function not defined"); }
};

export default Authentication;