import React from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import update from 'react-addons-update';

import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

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
            students: [],
            selectedStudents: [],
            clickedStudents: [],
            clickedSelectedStudents: [],
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
        this.removeFromClass = this.removeFromClass.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        this.onStudentCellClick = this.onStudentCellClick.bind(this);
        this.onSelectedStudentCellClick = this.onSelectedStudentCellClick.bind(this);
    }
    componentWillMount(){

    }
	componentDidMount(){

	}
    componentWillReceiveProps(nextProps) {
        console.log('next props: ', nextProps)
        let tempdayarray = [], selectedStudents = [], students = [];
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
        this.props.studentsData.map(function(obj, i){
            if(nextProps.currentClass.students.includes(obj._id)){
                selectedStudents.push(Object.assign({}, obj));
            }
            else{
                students.push(Object.assign({}, obj));
            }
        });
        let nextState = {
            classname: nextProps.currentClass.name,
            starttime: nextProps.currentClass.starttime,
            endtime: nextProps.currentClass.endtime,
            edittingIndex: nextProps.currentClass.index,
            edittingId: nextProps.currentClass._id,
            newClass: nextProps.currentClass.name == ''?true:false,
            dayarray: tempdayarray,
            selectedStudents: selectedStudents,
            students: students,
            clickedStudents: [],
            clickedSelectedStudents: [],
            mode: nextProps.currentClass.flag
        };

        this.setState(nextState);
    }
    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        let selectedStudents = [];
        if(e.target.name == 'classname'){
            selectedStudents = [...this.state.selectedStudents];
            selectedStudents.map(function(std, i){
                std.class = e.target.value;
            })
            nextState.selectedStudents = selectedStudents;
        }
        this.setState(nextState);
    }
    dayChange(e){
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
            clickedStudents: [],
            clickedSelectedStudents: [],
            newClass: true,
            mode: true
        }
        for (let key in this.refs){
            let stdobj = this.refs[key].getObj();
            let [side, id] = key.split('-');
            let index = this.props.studentsData.findIndex(x => x._id==id);
            if(index != -1){
                stdobj.class = this.props.studentsData[index].class;
            }
        }

        defaultState.students = [];
        defaultState.selectedStudents = [];
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
        let students = [...this.state.students], selectedStudents = [...this.state.selectedStudents];
        console.log(this.state.clickedStudents)
        for(let i = 0; i < this.state.clickedStudents.length; i++){
            let index = this.state.clickedStudents[i];
            let newObj = students[index];
            newObj.class = this.state.classname;
            selectedStudents.push(newObj);
        }
        for(let i = 0; i < this.state.clickedStudents.length; i++){
            let index = this.state.clickedStudents[i];
            students.splice(index, 1);
        }
        this.setState({
            selectedStudents: selectedStudents,
            students: students,
            clickedStudents: []
        })
    }
    removeFromClass(){
        let students = [...this.state.students], selectedStudents = [...this.state.selectedStudents];
        for(let i = 0; i < this.state.clickedSelectedStudents.length; i++){
            let index = this.state.clickedSelectedStudents[i];
            let newObj = selectedStudents[index];
            newObj.class = this.state.classname;
            students.push(newObj);
        }
        for(let i = 0; i < this.state.clickedSelectedStudents.length; i++){
            let index = this.state.clickedSelectedStudents[i];
            selectedStudents.splice(index, 1);
        }
        this.setState({
            selectedStudents: selectedStudents,
            students: students,
            clickedSelectedStudents: []
        })
    }
    handlePost(){
        console.log('handlePost called: ', this.state.newClass)
        let contents = {
            name: this.state.classname,
            days: this.state.dayarray.join(''),
            startTime: this.state.starttime,
            endTime: this.state.endtime
        }
        this.props.onClassPost(contents).then(() =>{
            this.handleCancel();
        })
    }
    handleEdit() {
        console.log('handleEdit called: ', this.state.newClass)
        let contents = { 
            name: this.state.classname,
            days: this.state.dayarray.join(''),
            startTime: this.state.starttime,
            endTime: this.state.endtime,
            students: this.state.selectedStudents
        }
        let success = true;
        let props = this.props;
        let addingStudents = this.state.selectedStudents.filter( function( el ) {
            let index = props.studentsData.findIndex(x => x._id==el._id);
            if(props.studentsData[index].class != el.class){
                props.onStudentEdit(el, index, true);
            }
        });

        let removingStudents = this.state.students.filter( function( el ) {
            let index = props.studentsData.findIndex(x => x._id==el._id);
            if(props.studentsData[index].class != el.class){
                props.onStudentEdit(el, index, true);
            }
        });
        this.props.onClassEdit(this.state.edittingId, this.state.edittingIndex, contents).then(() => {
            this.handleCancel();
        })
    }
    onStudentCellClick(rowNumber, columnId){
        let clicked = [...this.state.clickedStudents];
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        this.state.clickedStudents = clicked;
    }
    onSelectedStudentCellClick(rowNumber, columnId){
        let clicked = [...this.state.clickedSelectedStudents];
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        this.state.clickedSelectedStudents = clicked;
    }
    render() {
    	const classInfo = (
    		<div>
                <div className="input-field col s12 classname">
                    <input 
                        placeholder="-"
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
        const mapToComponents = data => {
            return data.map((stdobj, i) => {
                return(
                    <TableRow key={stdobj._id}>
                        <TableRowColumn>{stdobj.name}</TableRowColumn>
                        <TableRowColumn>{stdobj.school}</TableRowColumn>
                        <TableRowColumn>{stdobj.level}학년</TableRowColumn>
                    </TableRow>
                )
            });
        };
    	const studentsInfo = (
            <div className="row Edit-students">
        		<div className="row Students-list">
                    <div className="col s6">
                        <Table style={{border: '1px solid #d3d3d3'}} onCellClick={this.onStudentCellClick} fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                            <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                                <TableRow>
                                    <TableHeaderColumn colSpan="3" style={{textAlign: 'center'}}>
                                        전체 학생
                                    </TableHeaderColumn>
                                </TableRow>
                                <TableRow>
                                    <TableHeaderColumn>이름</TableHeaderColumn>
                                    <TableHeaderColumn>학교</TableHeaderColumn>
                                    <TableHeaderColumn>학년</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={true} deselectOnClickaway={true} showRowHover={true} stripedRows={false}>
                               {mapToComponents(this.state.students)}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableRowColumn colSpan="3" style={{textAlign: 'right'}}>
                                        <a className="right waves-effect waves-green btn-flat" onClick={this.addToClass}><FontAwesome name="plus" /> 추가</a>
                                    </TableRowColumn>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    <div className="col s6" style={{height: '100%'}}>
                        <Table style={{border: '1px solid #d3d3d3'}} onCellClick={this.onSelectedStudentCellClick} fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                            <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                                <TableRow>
                                    <TableHeaderColumn colSpan="3" style={{textAlign: 'center'}}>
                                        반 학생
                                    </TableHeaderColumn>
                                </TableRow>
                                <TableRow>
                                    <TableHeaderColumn>이름</TableHeaderColumn>
                                    <TableHeaderColumn>학교</TableHeaderColumn>
                                    <TableHeaderColumn>학년</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={true} deselectOnClickaway={true} showRowHover={true} stripedRows={false}>
                               {mapToComponents(this.state.selectedStudents)}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableRowColumn colSpan="3" style={{textAlign: 'right'}}>
                                        <a className="right waves-effect waves-green btn-flat"onClick={this.removeFromClass}><FontAwesome name="minus" /> 제거</a>
                                    </TableRowColumn>
                                </TableRow>
                            </TableFooter>
                        </Table>
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
    onClassPost: React.PropTypes.func,
    onClassEdit: React.PropTypes.func
};

MakeClass.defaultProps = {
    studentsData: [],
    currentClass: {
        days: '',
        starttime: '',
        endtime: '',
        flag: true,
        index: -1,
        name: '',
        students: []
    },
    onClassPost: (contents) => { console.error('post function not defined'); },
    onClassEdit: (contents) => { console.error('edit function not defined'); }
};


const mapStateToProps = (state) => {
    return {
        editStatus: state.makeclass.editStudents,
        currentClass: state.makeclass.editClassPrep,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MakeClass);
