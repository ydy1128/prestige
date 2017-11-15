import React from 'react';
import { connect } from 'react-redux';
import { getStudentsInfoRequest, studentsInfoEditRequest, classEditRequest } from 'actions/makeclass';
import FontAwesome from 'react-fontawesome';

import StudentObj from './StudentObj';

class MakeClass extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            classname: '',
            classday: '',
            dayarray: ['','','','','','',''],
            starttime: '',
            endtime: '',
            mode: true,
            newClass: true,
            edittingIndex: -1,
            edittingId: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.dayChange = this.dayChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.toggleDisabled = this.toggleDisabled.bind(this);
        this.addToClass = this.addToClass.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
	componentDidMount(){
        console.log(this.state.classname)

        this.props.getStudentsInfoRequest(this.state.classname).then(
            () => {
                console.log('data: ', this.props.studentsData);
            }
        );
        console.log('current class: ', this.props.currentClass)
	}
    componentWillReceiveProps(nextProps) {
        console.log('next props: ', nextProps)
        let tempdayarray = [];
        nextProps.currentClass.days.split('').map(function(day, i){
            switch(day){
                case '월':
                    $('#fill-mon').prop('checked',true);
                    tempdayarray[0] = '월';
                    break;
                case '화':
                    $('#fill-tue').prop('checked',true);
                    tempdayarray[1] = '화';
                    break;
                case '수':
                    $('#fill-wed').prop('checked',true);
                    tempdayarray[2] = '수';
                    break;
                case '목':
                    $('#fill-thu').prop('checked',true);
                    tempdayarray[3] = '목';
                    break;
                case '금':
                    $('#fill-fri').prop('checked',true);
                    tempdayarray[4] = '금';
                    break;
                case '토':
                    $('#fill-sat').prop('checked',true);
                    tempdayarray[5] = '토';
                    break;
                case '일':
                    $('#fill-sun').prop('checked',true);
                    tempdayarray[6] = '일';
                    break;
            }
        })

        let nextState = {
            classname: nextProps.currentClass.name,
            starttime: nextProps.currentClass.starttime,
            endtime: nextProps.currentClass.endtime,
            edittingIndex: nextProps.currentClass.index,
            edittingId: nextProps.currentClass._id,
            newClass: false,
            dayarray: tempdayarray,
            mode: nextProps.currentClass.flag
        };
        this.setState(nextState);
    }
    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        console.log(e.target.value)
        this.setState(nextState);
    }
    dayChange(e){
        console.log(e.target.id)
        let tempdayarray = this.state.dayarray;
        switch(e.target.id.split('-')[1]){
            case 'mon':
                tempdayarray[0] = e.target.checked ? '월' : '';
                break;
            case 'tue':
                tempdayarray[1] = e.target.checked ? '화' : '';
                break;
            case 'wed':
                tempdayarray[2] = e.target.checked ? '수' : '';
                break;
            case 'thu':
                tempdayarray[3] = e.target.checked ? '목' : '';
                break;
            case 'fri':
                tempdayarray[4] = e.target.checked ? '금' : '';
                break;
            case 'sat':
                tempdayarray[5] = e.target.checked ? '토' : '';
                break;
            case 'sun':
                tempdayarray[6] = e.target.checked ? '일' : '';
                break;
        }
        let daystring = tempdayarray.join('');
        console.log(daystring)
    }
    handleCancel(){
        let defaultState = {
            classname: '',
            classday: '',
            dayarray: ['','','','','','',''],
            starttime: '',
            endtime: '',
            edittingIndex: -1,
            edittingIndex: '',
            newClass: true
        }
        this.setState(defaultState);
        $('.filled-in').prop('checked',false);
    }
    changeMode(){
        let nextState = {mode: !this.state.mode};
        this.setState(nextState);
    }
    toggleDisabled(name){
        if(this.state.mode){
            if(name == 'nextbutton'){
                return 'btn-flat right waves-effect';
            }
            else{
                return 'btn-flat left waves-effect disabled';
            }
        }
        else{
            if(name == 'nextbutton'){
                return 'btn-flat right waves-effect disabled';
            }
            else{
                return 'btn-flat left waves-effect';
            }
        }
    }
    addToClass(){
        for (let key in this.refs){
            let newObj = this.refs[key].addToClass();
            if(newObj != undefined){
                newObj.class = this.state.classname;
                this.props.studentsInfoEditRequest(newObj._id, newObj).then(() =>{

                });
            }
        }
    }
    handlePost(){
        let contents = {
            name: this.state.classname,
            days: this.state.dayarray.join(''),
            startTime: this.state.starttime,
            endTime: this.state.endtime
        }
        this.props.onPost(contents).then(() =>{
            this.handleCancel();
        })
    }
    handleEdit() {
        let contents = {
            name: this.state.classname,
            days: this.state.dayarray.join(''),
            startTime: this.state.starttime,
            endTime: this.state.endtime
        }
        let request = this.props.classEditRequest(this.state.edittingId, this.state.edittingIndex, contents).then(
            () => {
                if(this.props.classEditStatus.status==="SUCCESS") {
                    Materialize.toast('수업 정보가 수정 되었습니다.', 2000);
                    this.handleCancel();
                } 
                else {
                    let errorMessage = [
                        '',
                        '모든 정보를 채워주세요.',
                        '세션이 만료 되었습니다. <br />로그인 하세요.',
                        '수업이 더이상 존재하지 않습니다.',
                        '권한이 없습니다.'
                    ];
                    
                    let error = this.props.classEditStatus.error;
                    
                    // NOTIFY ERROR
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);
                
                    // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
                    if(error === 3) {
                        setTimeout(()=> {location.reload(false)}, 2000);
                    }
                    
                }
            }
        );
        
        return request;
    }
    render() {
    	const classInfo = (
    		<div>
                <div className="input-field col s12 classname">
                    <input 
                        placeholder=" "
                        type="text" 
                        name="classname"
                        className="validate"
                        onChange={this.handleChange}
                        value={this.state.classname} />
                    <label>반 이름</label>
                </div>
                <div className="col s12">
                    <label>요일</label>
                    <p className="classday">
                        <input type="checkbox" className="filled-in" id="fill-mon" name="mon_checked" onChange={this.dayChange} checked={this.state.mon_checked}/>
                        <label htmlFor="fill-mon">월</label>
                        <input type="checkbox" className="filled-in" id="fill-tue" onChange={this.dayChange} />
                        <label htmlFor="fill-tue">화</label>
                        <input type="checkbox" className="filled-in" id="fill-wed" onChange={this.dayChange} />
                        <label htmlFor="fill-wed">수</label>
                        <input type="checkbox" className="filled-in" id="fill-thu" onChange={this.dayChange} />
                        <label htmlFor="fill-thu">목</label>
                        <input type="checkbox" className="filled-in" id="fill-fri" onChange={this.dayChange} />
                        <label htmlFor="fill-fri">금</label>
                        <input type="checkbox" className="filled-in" id="fill-sat" onChange={this.dayChange} />
                        <label htmlFor="fill-sat">토</label>
                        <input type="checkbox" className="filled-in" id="fill-sun" onChange={this.dayChange} />
                        <label htmlFor="fill-sun">일</label>
                    </p>
                </div>
                <div className="col s12 starttime">
                    <label htmlFor="classStartPicker">시작 시간</label>
                    <input
                        id="classStartPicker"
                        type="time"
                        name="starttime"
                        className="timepicker"
                        onChange={this.handleChange}
                        value={this.state.starttime}
                        />
                </div>
                <div className="col s12 endtime">
                    <label htmlFor="classEndPicker">마침 시간</label>
                    <input
                        id="classEndPicker"
                        type="time"
                        name="endtime"
                        className="timepicker"
                        onChange={this.handleChange}
                        value={this.state.endtime}
                        />
                </div> 
            </div>
    	)
        const mapToComponents1 = data => {
            return data.map((stdobj, i) => {
                let childname = 'child'+i;
                if(stdobj != undefined && stdobj.state){
                    return (<StudentObj ref={childname} data={stdobj.data} key={stdobj.data._id}/>);
                }
            });
        };
        const mapToComponents2 = data => {
            return data.map((stdobj, i) => {
                let childname = 'child'+i;
                if(stdobj != undefined && !stdobj.state){
                    return (<StudentObj ref={childname} data={stdobj.data} key={stdobj.data._id}/>);
                }
            });
        };
    	const studentsInfo = (
            <div className="row Edit-students">
        		<div className="row Students-list">
                        <ul className="collection with-header col s6">
                            <li className="collection-header center"><b>전체 학생</b></li>
                            <li className="collection-header row">
                                <span className="col s2">
                                    <input type="checkbox" id="all-box1"/>
                                    <label htmlFor="all-box1"></label>
                                </span>
                                <span className="col s3"><b>이름</b></span>
                                <span className="col s3"><b>학교</b></span>
                                <span className="col s3"><b>학년</b></span>
                            </li>
                        </ul>
                        <ul className="collection with-header col s6">
                            <li className="collection-header center"><b>반 학생</b></li>
                            <li className="collection-header row">
                                <span className="col s2">
                                    <input type="checkbox" id="all-box2"/>
                                    <label htmlFor="all-box1\2"></label>
                                </span>
                                <span className="col s3">이름</span>
                                <span className="col s3">학교</span>
                                <span className="col s3">학년</span>
                            </li>
                        </ul>
                        <ul className="collection col s6">
                            <div className="scroll">{mapToComponents1(this.props.studentsData)}</div>
                        </ul>
                        <ul className="collection col s6">
                            <div className="scroll">{mapToComponents2(this.props.studentsData)}</div>
                        </ul>
                </div>
                <div className="row Students-buttons">
                    <div className="col s6">
                        <a className="right waves-effect waves-green btn-flat" onClick={this.addToClass}><FontAwesome name="plus" /> 추가</a>
                    </div>
                    <div className="col s6">
                        <a className="right waves-effect waves-green btn-flat"><FontAwesome name="minus" /> 제거</a>
                    </div>
                </div>
            </div>
    	)
        return (
            <div id="classInfoModal" className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4>{ this.state.mode ? "반편성" : "학생관리" }</h4>
                    { this.state.mode ? classInfo : studentsInfo }           
	            </div>
                <div className="modal-footer">
                    <a className="modal-action modal-close waves-effect waves-green btn-flat left">반 제거</a>
                    <a className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.handleCancel}>취소</a>
                    <a className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.state.newClass? this.handlePost : this.handleEdit}>저장</a>
                </div>
            </div>
        );
    }
}

MakeClass.propTypes = {
    studentsData: React.PropTypes.array,
    onPost: React.PropTypes.func
};

MakeClass.defaultProps = {
    studentsData: [],
    currentClass: undefined,
    onPost: (contents) => { console.error('post function not defined'); }
};


const mapStateToProps = (state) => {
    return {
        studentsData: state.makeclass.getstudents.data,
        editStatus: state.makeclass.editStudents,
        currentClass: state.makeclass.editClassPrep,
        classEditStatus: state.makeclass.editClass
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStudentsInfoRequest: (classname) => {
            return dispatch(getStudentsInfoRequest(classname));
        },
        studentsInfoEditRequest: (id, obj) => {
            return dispatch(studentsInfoEditRequest(id, obj));
        },
        classEditRequest: (id, index, contents) => {
            return dispatch(classEditRequest(id, index, contents));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MakeClass);
