import React from 'react';
import { Link } from 'react-router';

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            name: "",
            ref: "student"
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
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
                    value={this.state.username}/>
                </div>
                <div className="input-field col s12">
                    <label>패스워드</label>
                    <input
                    name="password"
                    type="password"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.password}/>
                </div>
            </div>
        )
        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        {authBoxes}
                        <a className="waves-effect btn">로그인</a>
                    </div>
                </div>

                <div className="footer">
                    <div className="card-content">
                        <div className="right" >
                        회원이 아니신가요? <Link to="/register">회원가입</Link>
                        </div>
                    </div>
                </div>

            </div>
        );
        const registerView = (
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
                        value={this.state.name}/>
                    </div>
                    <a className="waves-effect waves-light btn">가입</a>
                </div>
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