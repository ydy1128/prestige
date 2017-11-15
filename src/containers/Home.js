import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { classBoardRequest, classPostRequest } from 'actions/makeclass';

import { ClassBoard } from 'components';
import { MakeClass } from 'components';


class Home extends React.Component {
    constructor(props) {
        super(props);        
        this.handlePost = this.handlePost.bind(this);
    }
    componentDidMount(){
        $('.modal').modal({
            dismissible: false,
        });
        this.props.classBoardRequest().then(
            () => {
                console.log('classData(Home): ', this.props.classData);
            }
        );
    }
    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    getLoginData(){
    	let loginData = this.getCookie('key');
        if(loginData == undefined){
            loginData = {};
        }
        else{
        	loginData = JSON.parse(atob(loginData));
        }

    	return loginData;
    }
    handleClick(ref){
    	let loginData = this.getLoginData();
    	console.log(loginData);
    	loginData.role = ref;
    	document.cookie='key=' + btoa(JSON.stringify(loginData));
    }
    handlePost(contents){
        return this.props.classPostRequest(contents).then(
            () => {
                console.log(this.props.postStatus.status)
                if(this.props.postStatus.status === "SUCCESS") {
                    // TRIGGER LOAD NEW MEMO
                    // TO BE IMPLEMENTED
                    Materialize.toast('수업이 개설 되었습니다!', 2000);
                }
                else {
                    let $toastContent;
                    switch(this.props.postStatus.error) {
                        case 1:
                            $toastContent = $('<span style="color: #FFB4BA">세션이 만료 되었습니다. <br />로그인 하세요.</span>');
                            Materialize.toast($toastContent, 2000);
                            setTimeout(()=> {location.reload(false);}, 2000);
                            break;
                        case 2:
                            $toastContent = $('<span style="color: #FFB4BA">모든 정보를 채워주세요.</span>');
                            Materialize.toast($toastContent, 2000);
                            break;
                        default:
                            $toastContent = $('<span style="color: #FFB4BA">서버 에러 발생. <br /> 관리자에게 문의하세요.</span>');
                            Materialize.toast($toastContent, 2000);
                            break;
                    }
                }
            }
        );
    }
    render() {
    	const beforeLoginView = (
        	<div className="row Main-contents">
        		<h1>프레스티지 수시영어전문학원</h1>
        		<div className="col s12 m6 Main-buttons">
        			<div className="card">
        				<div className="card-image">
        					<Link to="login" onClick={this.handleClick.bind(this, 'student')}>
	        					<img src="img/students.jpg" />
	        					<span className="card-title">학생 로그인</span>
        					</Link>
        				</div>
        			</div>
        		</div>
        		<div className="col s12 m6 Main-buttons">
        			<div className="card">
        				<div className="card-image">
        					<Link to="/login" onClick={this.handleClick.bind(this, 'teacher')}>
	        					<img src="img/teachers.png" />
	        					<span className="card-title">선생님 로그인</span>
        					</Link>
        				</div>
        			</div>
        		</div>
        		<div className="col m12 Main-footer">
        			<Link to="/register" className="Register-button">회원가입</Link>
        		</div>
        	</div>
    	);
    	const teacherMenu = (
			<ul className="">
				<li><a className="waves-effect active">대시보드</a></li>
				<li><a className="waves-effect">수업관리</a></li>
				<li><a className="waves-effect">강의관리</a></li>
				<li><a className="waves-effect">숙제관리</a></li>
				<li><a className="waves-effect">질문관리</a></li>
			</ul>
    	)
    	const studentMenu = (
			<ul className="">
				<li><a className="waves-effect active">대시보드</a></li>
				<li><a className="waves-effect">강의게시판</a></li>
				<li><a className="waves-effect">숙제게시판</a></li>
				<li><a className="waves-effect">질문게시판</a></li>
			</ul>
    	)
    	const sideMenu = (
			<div className="Side-menu">
				{this.getLoginData().role == 'student' ? studentMenu : teacherMenu}
			</div>
    	)
    	const afterLoginView = (
    		<div className="row Main-loggedin">
    			{ sideMenu }
    			<div className="Boards-wrapper">
                    <ClassBoard data={this.props.classData}/>
    			</div>

    		</div>
    	)
    	
        return (
        	<div className="row Main">
                <MakeClass onPost={this.handlePost}/>
	        	{ this.props.isLoggedIn ? afterLoginView : beforeLoginView }
        	</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,
        classData: state.makeclass.board.data,
        postStatus: state.makeclass.post
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        classPostRequest: (contents) => {
            return dispatch(classPostRequest(contents));
        },
        classBoardRequest: (isInitial, listType, id, username) => {
            return dispatch(classBoardRequest(isInitial, listType, id, username));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);