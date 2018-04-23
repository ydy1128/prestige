import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { registerRequest } from 'actions/authentication';

import throwError from 'components/commons/throwError';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);    
    }
    
    handleRegister(id, pw, name, school, level, url_ref) {
    	console.log(url_ref, '2')
        return this.props.registerRequest(id, pw, name, school, level, url_ref).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    Materialize.toast('계정 생성 완료! 로그인하세요', 2000);
                    browserHistory.push('/login');
                    return true;
                } else {
                    /*
                        ERROR CODES:
                            1: BAD USERNAME
                            2: BAD PASSWORD
                            3: USERNAME EXISTS
                    */
                    let errorMessage = {
                        'Empty content exists.':'모든 필드를 채워주세요',
                        'Bad username.':'아이디는 영문 숫자 포함 4자 이상이어야 합니다',
                        'Bad password.':'비밀번호는 4자  이상이어야 합니다',
                        'Username already exists.':'존재하는 아이디 입니다'
                    };
                    console.log(this.props.errorCode, errorMessage[this.props.errorCode.message]);
                    // let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
                    // Materialize.toast($toastContent, 2000);

                    throwError(false, "", this.props.errorCode, errorMessage[this.props.errorCode.message])
                    return false;
                }
            }
        );
    }
    render() {
        return (
            <div>
                <Authentication mode={false}
                				onRegister={this.handleRegister}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (id, pw, name, school, level, url_ref) => {
            return dispatch(registerRequest(id, pw, name, school, level, url_ref));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);