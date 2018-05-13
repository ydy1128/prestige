import React from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { connect } from 'react-redux';
import {studentsInfoEditRequest, studentsInfoPwChangeRequest} from 'actions/studentinfo';
import {updateUserRequest} from 'actions/authentication';

import throwError from 'components/commons/throwError';

import './style.scss';

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state={
            accountOpen: false,
            userInfo: {
                username: '',
                name: '',
                role: '',
                password: '',
                school: '',
                level: '',
                class: '',
            },
            editMode: false,
        }
        this.handlePopover = this.handlePopover.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.findClassById = this.findClassById.bind(this);
    }
    componentDidMount(){
        if(this.props.loginStatus() == undefined){
            throwError(true, '', {code: 401}, undefined);      
        }
        else
            this.props.loginStatus().then(()=>{
                console.log(this.props.userinfo)
                if(this.props.userinfo != undefined){
                    let userInfo = Object.assign({}, this.props.userInfo.user);
                    userInfo.role = this.props.userInfo.role;
                    this.setState({userInfo: userInfo});
                }
            })
    }
    handlePopover(event){
        event.preventDefault();
        this.setState({
            accountOpen: true,
            anchorEl: event.currentTarget,
        });
    }
    handleClose(){
        let userInfo = this.state.userInfo;
        userInfo.password = '';
        this.setState({accountOpen: false, editMode: false, userInfo: userInfo});
    }
    handleClick(){
        if(this.state.editMode){
            this.props.updateUserRequest(this.state.userInfo, this.state.userInfo.role).then(()=>{
                if(this.props.status.status == 'SUCCESS'){
                    this.setState({editMode: false});
                    Materialize.toast('계정 정보가 수정 되었습니다.', 2000);
                }
                else{
                    let errorMessage = {
                        'Bad password.':'비밀번호는 4자  이상이어야 합니다',
                    };
                    return throwError(false, '계정', this.props.status.error, errorMessage[this.props.status.error.message]);
                }
            })
            
        }
        else{
            this.setState({editMode: true});
        }
    }
    dataChange(event, data){
        let nextState = {};
        nextState.userInfo = this.state.userInfo;
        nextState.userInfo[event.target.name] = data;
        this.setState(nextState);
    }
    findClassById(id){
        for(let i = 0; i < this.props.classData.length; i++){
            let cls = this.props.classData[i];
            if(cls._id == id){
                console.log(cls.name)
                return cls.name;
            }
        }
        return '';
    }
    render() {
        const accountButton = (
            <a className="account-button">
                <FontAwesome className='account-logo right header-buttons' name='user-circle' onClick={this.handlePopover} />
            </a>
        );
        const logoutButton = (
            <a onClick={this.props.onLogout} className="logout-button">
                <FontAwesome className='logout-logo right header-buttons' name='sign-out' />
            </a>
        );
        const userInfoDiv = (
            <div className="row" style={{margin: 0, textAlign: 'center', width: 220}}>
                <h5 style={{margin: 0, paddingTop: 10}}>계정정보</h5>
                <div className="col m12" style={{marginTop: -10}}>
                    <TextField floatingLabelText="아이디" name="username" value={this.state.userInfo.username}
                        style={{width: 190, cursor: this.state.editMode? 'text' :'default'}}
                        disabled={true}
                        inputStyle={{margin: 0, padding: '20px 0 0 0', color: 'black'}}
                    />
                </div>
                <div className="col m12" style={{marginTop: -10}}>
                    <TextField floatingLabelText="이름" name="name" value={this.state.userInfo.name}
                        style={{width: 190, cursor: this.state.editMode? 'text' :'default'}}
                        disabled={!this.state.editMode}
                        inputStyle={{margin: 0, padding: '20px 0 0 0', color: 'black'}}
                        onChange={this.dataChange}
                    />
                </div>
                {this.state.editMode ? 
                <div className="col m12" style={{marginTop: -10}}>
                    <TextField floatingLabelText="새 패스워드" name="password" value={this.state.userInfo.password}
                        type="password"
                        style={{width: 190, cursor: this.state.editMode? 'text' :'default'}}
                        disabled={!this.state.editMode}
                        inputStyle={{margin: 0, padding: '20px 0 0 0', color: 'black'}}
                        onChange={this.dataChange}
                    />
                </div>
                : null}
                {this.state.userInfo.role == 'student' ?
                <div>
                    <div className="col m12" style={{marginTop: -10}}>
                        <TextField floatingLabelText="학교" name="school" value={this.state.userInfo.school}
                            style={{width: 190, cursor: this.state.editMode? 'text' :'default'}}
                            disabled={!this.state.editMode}
                            inputStyle={{margin: 0, padding: '20px 0 0 0', color: 'black'}}
                            onChange={this.dataChange}
                        />
                    </div>
                    <div className="col m12" style={{marginTop: -10}}>
                        <TextField floatingLabelText="학년" name="level" value={this.state.userInfo.level}
                            style={{width: 190, cursor: this.state.editMode? 'text' :'default'}}
                            disabled={!this.state.editMode}
                            inputStyle={{margin: 0, padding: '20px 0 0 0', color: 'black'}}
                            onChange={this.dataChange}
                        />
                    </div>
                    {this.state.editMode ? null :
                    <div className="col m12" style={{marginTop: -10}}>
                        <TextField floatingLabelText="반" name="class" value={this.findClassById(this.state.userInfo.class)}
                            style={{width: 190, cursor: this.state.editMode? 'text' :'default'}}
                            disabled={!this.state.editMode}
                            inputStyle={{margin: 0, padding: '20px 0 0 0', color: 'black'}}
                        />
                    </div>
                    }
                </div>
                : null}
                <div className="col m12" style={{paddingTop: 10, paddingBottom: 20, textAlign: 'right'}}>
                    <RaisedButton label={this.state.editMode? '저장' : '수정'} primary={this.state.editMode} secondary={!this.state.editMode} onClick={this.handleClick}/>
                </div>
            </div>
        );
        return (
            <div className="App-Header" style={{backgroundColor: this.props.isLoggedIn ? '#86272d' : 'none'}}>
	            <a className="App-logo">PRESTIGE</a>
                { this.props.isLoggedIn ? logoutButton  : undefined }
                { this.props.isLoggedIn ? accountButton  : undefined }
                <Popover
                    open={this.state.accountOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'middle',}}
                    targetOrigin={{ vertical: 'bottom', horizontal: 'middle',}}
                    onRequestClose={this.handleClose}
                    animation={PopoverAnimationVertical}
                >
                    
                    <Paper zDepth={1}>
                        { userInfoDiv }
                    </Paper>
                </Popover>
            </div>
        );
    }
}
const styles = {
    container: {
        paddingBottom: 20,
    },
    labels: {
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#bdbdbd'
    },
    entries: {
        textAlign: 'left',
        fontSize: 17,
        fontWeight: 'bold',
        borderBottom: '1px solid #d3d3d3',
    }
}

Header.propTypes = {
    isLoggedIn: React.PropTypes.bool,
    onLogout: React.PropTypes.func
};

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => { console.error("logout function not defined");}
};

const mapStateToProps = (state) => {
    return {
        status: state.authentication.update,
        classData: state.makeclass.board.data,
        userinfo: state.authentication.status.currentUser,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        studentsInfoEditRequest: (id, index, obj) => {
            return dispatch(studentsInfoEditRequest(id, index, obj));
        },
        studentsInfoPwChangeRequest: (id, pw, check_pw) => {
            return dispatch(studentsInfoPwChangeRequest(id, pw, check_pw));
        },
        updateUserRequest: (obj, url_ref) =>{
            return dispatch(updateUserRequest(obj, url_ref));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);