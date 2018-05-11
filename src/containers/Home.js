import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import axios from 'axios';

import { classBoardRequest, classPostRequest, classEditRequest, classRemoveRequest } from 'actions/makeclass';
import { getStudentsInfoRequest, 
        studentsInfoEditRequest,
        studentsInfoRemoveRequest, 
        studentsInfoPwChangeRequest,
        passNotificationInfo } from 'actions/studentinfo';
import { lectureBoardRequest, lectureEditRequest } from 'actions/lecture';
import { getMemoListRequest } from 'actions/memolist';
import { homeworkBoardRequest } from 'actions/homework';

import { ClassBoard,
          TeacherDashBoard,
          StudentDashBoard,
          StudentBoard,
          HomeworkBoard,
          TeacherLectureBoard,
          StudentLectureBoard
} from 'components';

import throwError from 'components/commons/throwError';
import { getLoginData } from 'components/commons/SessionData';
import { BeforeLogin } from 'components/HomeView';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // TEACHER_DASHBOARD, TEACHER_STUDENTBOARD, TEACHER_CLASSBOARD, TEACHER_LECTUREBOARD, TEACHER_HWBOARD
        // STUDENT_DASHBOARD, STUDENT_LECTUREBOARD, STUDENT_HWBOARDBOARD
        this.state = {
            view_type: getLoginData().role == 'teacher' ? 'TEACHER_DASHBOARD' : 'STUDENT_DASHBOARD'
        }
        this.handleClassEdit = this.handleClassEdit.bind(this);

        this.handleStudentEdit = this.handleStudentEdit.bind(this);

        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.setMenuActive = this.setMenuActive.bind(this);
    }
    componentDidMount(){
        if(getLoginData().role == 'teacher'){
            this.props.getStudentsInfoRequest().then(() =>{
            });
            this.props.getMemoListRequest().then(() =>{
            });
            this.props.lectureBoardRequest().then(() =>{
            });
            this.props.homeworkBoardRequest().then(() =>{
            });
        }
        else{
            this.props.lectureBoardRequest().then(() => {
              this.props.homeworkBoardRequest().then(() => {
                let fullArray = [...this.props.lectureData, ...this.props.homeworkData];
                fullArray.sort((a, b) =>{
                  let date = new Date();

                  let aNum = a.dueDate == undefined ? a.date : a.dueDate;
                  let aDate = a.dueDate == undefined ? new Date(aNum) : new Date(parseInt(aNum));
                  if (a.dueDate == undefined) aDate = new Date(aDate.getDate() + 7);
                  let bNum = b.dueDate == undefined ? b.date : b.dueDate;
                  let bDate = b.dueDate == undefined ? new Date(bNum) : new Date(parseInt(bNum));
                  if (b.dueDate == undefined) bDate = new Date(bDate.getDate() + 7);
                  return aDate - bDate;
                })
                fullArray = fullArray.filter((obj) => {
                  let isLecture = obj.dueDate == undefined;
                  let date = isLecture ? new Date(obj.date) : new Date(parseInt(obj.dueDate));
                  let expiryDate = new Date();
                  let checkDate = isLecture ? new Date(obj.date) : new Date(parseInt(obj.dueDate));
                  if(isLecture)
                      checkDate.setDate(date.getDate() + 7);
                  return checkDate >= expiryDate;

                })
                this.props.passNotificationInfo(fullArray);
              })
            })
        }
        this.props.classBoardRequest().then(() => {
        });
    }
    handleStudentEdit(stdobj, index, silent){
        return this.props.studentsInfoEditRequest(stdobj._id, index, stdobj).then(() =>{
            if(this.props.studentEditStatus.status === "SUCCESS") {
                if(!silent) { Materialize.toast('학생 정보가 수정 되었습니다!', 2000); return true; }
            }
            else {
                return throwError(silent, '학생', this.props.classEditStatus.error, '');
            }
        })
    }

    handleClassEdit(id, index, contents){
        return this.props.classEditRequest(id, index, contents).then(() => {
                if(this.props.classEditStatus.status==="SUCCESS") {
                    Materialize.toast('수업 정보가 수정 되었습니다.', 2000);
                    return true;
                }
                else {
                    let errorMessage = {
                        'Empty contents.':'모든 정보를 채워주세요',
                        'Class name already exists.':'존재하는 수업 이름입니다',
                    };
                    return throwError(false, '수업', this.props.classEditStatus.error, errorMessage[this.props.classEditStatus.error.message]);
                }
            }
        );
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
                return (
                            <TeacherDashBoard />
                            /*<button onClick={this.loadCsvClassData}>load classes</button>
                            <button onClick={this.loadCsvStudentsData}>load students</button>*/
                        );
            case 'TEACHER_STUDENTBOARD':
                return (<StudentBoard onStudentEdit={this.handleStudentEdit} onClassEdit={this.handleClassEdit}/>);
            case 'TEACHER_CLASSBOARD':
                return (<ClassBoard onClassEdit={this.handleClassEdit} onStudentEdit={this.handleStudentEdit}
                                />);
            case 'TEACHER_LECTUREBOARD':
                return (<TeacherLectureBoard />);
            case 'TEACHER_HOMEWORKBOARD':
                return (<HomeworkBoard userType='teacher'/>);
            case 'STUDENT_HOMEWORKBOARD':
                return (<HomeworkBoard userType='student'/>);
            case 'STUDENT_DASHBOARD':
                return (<StudentDashBoard />);
            case 'STUDENT_LECTUREBOARD':
                return (<StudentLectureBoard />);
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
    	const teacherMenu = (
			<ul className="">
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_DASHBOARD')}    name="TEACHER_DASHBOARD"    ><FontAwesome name="dashboard"  onClick={this.handleMenuClick}/></a></li>
                <li><a className={'waves-effect '+this.setMenuActive('TEACHER_STUDENTBOARD')} name="TEACHER_STUDENTBOARD" ><FontAwesome name="street-view" onClick={this.handleMenuClick} /></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_CLASSBOARD')}   name="TEACHER_CLASSBOARD"   ><FontAwesome name="university"  onClick={this.handleMenuClick}/></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_LECTUREBOARD')} name="TEACHER_LECTUREBOARD" ><FontAwesome name="tv" onClick={this.handleMenuClick} /></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('TEACHER_HOMEWORKBOARD')}name="TEACHER_HOMEWORKBOARD"      ><FontAwesome name="file-o" onClick={this.handleMenuClick} /></a></li>
			</ul>
    	)
    	const studentMenu = (
			<ul className="">
				<li><a className={'waves-effect '+this.setMenuActive('STUDENT_DASHBOARD')}    name="STUDENT_DASHBOARD"    ><FontAwesome name="dashboard"  onClick={this.handleMenuClick}/></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('STUDENT_LECTUREBOARD')} name="STUDENT_LECTUREBOARD" ><FontAwesome name="tv" onClick={this.handleMenuClick} /></a></li>
				<li><a className={'waves-effect '+this.setMenuActive('STUDENT_HOMEWORKBOARD')}name="STUDENT_HOMEWORKBOARD"      ><FontAwesome name="file-o" onClick={this.handleMenuClick} /></a></li>                
			</ul>
    	)
    	const sideMenu = (
			<div className="Side-menu" style={{paddingTop: 80}}>
				{getLoginData().role == 'teacher' ? teacherMenu : studentMenu}
			</div>
    	)
    	const afterLoginView = (
    		<div className="row Main-loggedin">
    			{ sideMenu }
    			<div className="Boards-wrapper" style={{paddingTop: 80}}>
                    { this.getView() }
    			</div>

    		</div>
    	)
        const beforeLoginView = (
            <BeforeLogin />
            
        )

        return (
        	<div style={{height: '100%', width: '100%'}}>
	        	{ this.props.isLoggedIn ? afterLoginView : beforeLoginView }
        	</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,

        classEditStatus: state.makeclass.editClass,
        classRemoveStatus: state.makeclass.removeClass,

        studentEditStatus: state.studentinfo.editStudents,

        lectureData: state.lecture.board.data,
        homeworkData: state.homework.board.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMemoListRequest: () => {
            return dispatch(getMemoListRequest());
        },
        getStudentsInfoRequest: (classname) => {
            return dispatch(getStudentsInfoRequest(classname));
        },
        studentsInfoEditRequest: (id, index, obj) => {
            return dispatch(studentsInfoEditRequest(id, index, obj));
        },

        classBoardRequest: (isInitial, listType, id, username) => {
            return dispatch(classBoardRequest(isInitial, listType, id, username));
        },
        classEditRequest: (id, index, contents) => {
            return dispatch(classEditRequest(id, index, contents));
        },
        lectureBoardRequest: () => {
            return dispatch(lectureBoardRequest());
        },
        homeworkBoardRequest: (id) => {
            return dispatch(homeworkBoardRequest(id));
        },
        passNotificationInfo: (noti) => {
            return dispatch(passNotificationInfo(noti));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
