import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import axios from 'axios';

import { classBoardRequest, classPostRequest, classEditRequest, classRemoveRequest } from 'actions/makeclass';
import { getStudentsInfoRequest, studentsInfoEditRequest, studentsInfoRemoveRequest, studentsInfoPwChangeRequest } from 'actions/studentinfo';
import { lectureBoardRequest } from 'actions/lecture';

import { ClassBoard,
          StudentBoard,
          HWBoard,
          TeacherLectureBoard,

          StudentLectureBoard
} from 'components';

import throwError from 'components/commons/throwError';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // TEACHER_DASHBOARD, TEACHER_STUDENTBOARD, TEACHER_CLASSBOARD, TEACHER_LECTUREBOARD, TEACHER_HWBOARD
        // STUDENT_DASHBOARD, STUDENT_LECTUREBOARD, STUDENT_HWBOARD
        // this.state = {
        //     view_type: 'TEACHER_STUDENTBOARD'
        // }

        //Commented for dev purposes

        this.state = {
            view_type: this.getLoginData().role == 'teacher' ? 'TEACHER_DASHBOARD' : 'STUDENT_DASHBOARD'
        }
        this.handleClassPost = this.handleClassPost.bind(this);
        this.handleClassEdit = this.handleClassEdit.bind(this);
        this.handleClassRemove = this.handleClassRemove.bind(this);

        this.handleStudentEdit = this.handleStudentEdit.bind(this);
        this.handleStudentPwChange = this.handleStudentPwChange.bind(this);
        this.handleStudentRemove = this.handleStudentRemove.bind(this);

        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.setMenuActive = this.setMenuActive.bind(this);
    }
    componentWillMount(){
        if(this.getLoginData().role == 'teacher'){
            this.props.getStudentsInfoRequest().then(() =>{
                console.log('studentsData', this.props.studentsData)
            });
        }
            this.props.classBoardRequest().then(() => {
                console.log('classData', this.props.classData)
            });
        this.props.lectureBoardRequest().then(() =>{
            console.log('lectureData', this.props.lectureData)
        });

    }
    componentDidMount(){

    }
    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    getLoginData(){
    	let loginData = this.getCookie('key');
        if(loginData == undefined)
            loginData = {};
        else
        	loginData = JSON.parse(atob(loginData));
    	return loginData;
    }
    handleClick(ref){
    	let loginData = this.getLoginData();
    	loginData.role = ref;
    	document.cookie='key=' + btoa(JSON.stringify(loginData));
    }

    handleStudentEdit(stdobj, index, silent){
        return this.props.studentsInfoEditRequest(stdobj._id, index, stdobj).then(() =>{
            if(this.props.studentEditStatus.status === "SUCCESS") {
                if(silent) { Materialize.toast('학생 정보가 수정 되었습니다!', 2000); return true; }
            }
            else {
                return throwError(silent, '학생', this.props.classEditStatus.error, '');
            }
        })
    }
    handleStudentPwChange(id, pw, check_pw){
        return this.props.studentsInfoPwChangeRequest(id, pw, check_pw).then(() => {
            if(this.props.studentPwChangeStatus.status==="SUCCESS") {
                Materialize.toast('학생 정보가 수정 되었습니다!', 2000);
                return true;
            } else {
                return throwError(false, '학생', this.props.classEditStatus.error, '');
            }
        });
    }
    handleStudentRemove(index, id, silent){
        return this.props.studentsInfoRemoveRequest(id, index).then(() => {
            if(!silent){
                if(this.props.studentRemoveStatus.status==="SUCCESS") {
                    Materialize.toast('학생 정보가 삭제 되었습니다!', 2000);
                    return true;
                } else {
                    return throwError(false, '학생', this.props.classRemoveStatus.error, '');
                }
            }
        });
    }
    handleClassPost(contents){
        return this.props.classPostRequest(contents).then(() => {
            if(this.props.classPostStatus.status === "SUCCESS") {
                Materialize.toast('수업이 개설 되었습니다!', 2000);
                return true;
            }
            else {
                return throwError(false, '수업', this.props.classPostStatus.error, '');
            }
        });
    }
    handleClassEdit(id, index, contents){
        return this.props.classEditRequest(id, index, contents).then(() => {
                if(this.props.classEditStatus.status==="SUCCESS") {
                    Materialize.toast('수업 정보가 수정 되었습니다.', 2000);
                    return true;
                }
                else {
                    return throwError(false, '수업', this.props.classEditStatus.error, '');
                }
            }
        );
    }
    handleClassRemove(id, index){
        this.props.classRemoveRequest(id, index).then(() => {
            if(this.props.classRemoveStatus.status==="SUCCESS") {
                Materialize.toast('수업이 삭제 되었습니다!', 2000);
                return true;
            } else {
                return throwError(false, '수업', this.props.classRemoveStatus.error, '');
            }
        });
    }
    handleMenuClick(e){
        console.log(e.target.parentNode.name)
        this.setState({
            view_type: e.target.parentNode.name
        })
    }
    loadCsvClassData(){
        axios.post('/api/class/test');
    }
    loadCsvStudentsData(){
        axios.post('/api/student/test');
    }
    getView(){
        switch(this.state.view_type){
            case 'TEACHER_DASHBOARD':
                return (<div>
                            DashBoard
                            <button onClick={this.loadCsvClassData}>load classes</button>
                            <button onClick={this.loadCsvStudentsData}>load students</button>
                        </div>);
            case 'TEACHER_STUDENTBOARD':
                return (<StudentBoard studentsData={this.props.studentsData}
                                classData={this.props.classData}
                                onStudentEdit={this.handleStudentEdit}
                                onStudentPwChange={this.handleStudentPwChange}
                                onStudentRemove={this.handleStudentRemove}
                                onClassEdit={this.handleClassEdit}/>);
            case 'TEACHER_CLASSBOARD':
                return (<ClassBoard data={this.props.classData}
                                onClassPost={this.handleClassPost}
                                onClassEdit={this.handleClassEdit}
                                studentsData={this.props.studentsData}
                                onRemove={this.handleClassRemove}
                                onStudentEdit={this.handleStudentEdit}
                                />);
            case 'TEACHER_LECTUREBOARD':
                return (<TeacherLectureBoard classData={this.props.classData}
                                lectureData={this.props.lectureData} />);
            case 'TEACHER_HWBOARD':
                return (<HWBoard />);
            case 'STUDENT_DASHBOARD':
                return (<div>DASHBOARD</div>);
            case 'STUDENT_LECTUREBOARD':
                return (<StudentLectureBoard classData={this.props.classData}
                                lectureData={this.props.lectureData} />);
            case 'STUDENT_HWBOARD':
                return (<div>HWBOARD</div>);
            default:
                return (<div>Get View Error</div>);
        }
    }
    setMenuActive(view_type){
        if(this.state.view_type === view_type){
            return 'active';
        }
        return '';
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
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_DASHBOARD')}    name="TEACHER_DASHBOARD"    ><FontAwesome name="dashboard"  onClick={this.handleMenuClick}/></a></li>
                <li><a className={'waves-effect '+this.setMenuActive('TEACHER_STUDENTBOARD')} name="TEACHER_STUDENTBOARD" ><FontAwesome name="street-view" onClick={this.handleMenuClick} /></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_CLASSBOARD')}   name="TEACHER_CLASSBOARD"   ><FontAwesome name="university"  onClick={this.handleMenuClick}/></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_LECTUREBOARD')} name="TEACHER_LECTUREBOARD" ><FontAwesome name="tv" onClick={this.handleMenuClick} /></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_HWBOARD')}      name="TEACHER_HWBOARD"      ><FontAwesome name="file-o" onClick={this.handleMenuClick} /></a></li>
			</ul>
    	)
    	const studentMenu = (
			<ul className="">
				<li><a className={'waves-effect '+this.setMenuActive('STUDENT_DASHBOARD')}    name="STUDENT_DASHBOARD"    ><FontAwesome name="dashboard"  onClick={this.handleMenuClick}/></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('STUDENT_LECTUREBOARD')} name="STUDENT_LECTUREBOARD" ><FontAwesome name="tv" onClick={this.handleMenuClick} /></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('STUDENT_HWBOARD')}      name="STUDENT_HWBOARD"      ><FontAwesome name="file-o" onClick={this.handleMenuClick} /></a></li>
			</ul>
    	)
    	const sideMenu = (
			<div className="Side-menu">
				{this.getLoginData().role == 'teacher' ? teacherMenu : studentMenu}
			</div>
    	)
    	const afterLoginView = (
    		<div className="row Main-loggedin">
    			{ sideMenu }
    			<div className="Boards-wrapper">
                    { this.getView() }
    			</div>

    		</div>
    	)

        return (
        	<div className="row Main">
	        	{ this.props.isLoggedIn ? afterLoginView : beforeLoginView }
        	</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,

        classData: state.makeclass.board.data,
        classPostStatus: state.makeclass.post,
        classEditStatus: state.makeclass.editClass,
        classRemoveStatus: state.makeclass.removeClass,

        studentsData: state.studentinfo.getStudents.data,
        studentEditStatus: state.studentinfo.editStudents,
        studentPwChangeStatus: state.studentinfo.pwChange,
        studentRemoveStatus: state.studentinfo.removeStudents,

        lectureData: state.lecture.board.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStudentsInfoRequest: (classname) => {
            return dispatch(getStudentsInfoRequest(classname));
        },
        studentsInfoEditRequest: (id, index, obj) => {
            return dispatch(studentsInfoEditRequest(id, index, obj));
        },
        studentsInfoPwChangeRequest: (id, pw, check_pw) => {
            return dispatch(studentsInfoPwChangeRequest(id, pw, check_pw));
        },
        studentsInfoRemoveRequest: (id, index) => {
            return dispatch(studentsInfoRemoveRequest(id, index));
        },
        classBoardRequest: (isInitial, listType, id, username) => {
            return dispatch(classBoardRequest(isInitial, listType, id, username));
        },
        classPostRequest: (contents) => {
            return dispatch(classPostRequest(contents));
        },
        classEditRequest: (id, index, contents) => {
            return dispatch(classEditRequest(id, index, contents));
        },
        classRemoveRequest: (id, index) => {
            return dispatch(classRemoveRequest(id, index));
        },
        lectureBoardRequest: () => {
            return dispatch(lectureBoardRequest());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
