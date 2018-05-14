import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import TextField from 'material-ui/TextField';

import BoardHeader from '../commons/BoardHeader';
import StudentDialog from './StudentDialog';
import StudentTable from './StudentTable';
import DeleteDialog from './DeleteDialog';

import { getStudentsInfoRequest, studentsInfoEditRequest, studentsInfoRemoveRequest, studentsInfoPwChangeRequest } from 'actions/studentinfo';
import { lectureEditRequest } from 'actions/lecture';

import throwError from 'components/commons/throwError';

class StudentBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            open: false,
            deleteDialogOpen: false,
            editidx: -1,
            editstd: {
                _id: '',
                username: '',
                name: '',
                school: '',
                level: '',
                password: '',
                check_password: ''
            },
            clicked: [],
            filteredClick: [],
            remove_active: false,
            modal_state: true,
            searchOpen: false,
            searchStart: false,
            searchText: '',
            searchResult: []
        }
        this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
        //handle modal open
        this.handleInfoOpen = this.handleInfoOpen.bind(this);
        this.handlePassOpen = this.handlePassOpen.bind(this);
        //handle student data in modal
        this.handleChange = this.handleChange.bind(this);
        this.handleStudentPwChange = this.handleStudentPwChange.bind(this);
        this.handlePwChange = this.handlePwChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        //handle table rows
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleFilteredRowClick = this.handleFilteredRowClick.bind(this);
        //handle button active
        this.handleActive = this.handleActive.bind(this);
        this.searchClassNameById = this.searchClassNameById.bind(this);
        this.focusSearchInput = this.focusSearchInput.bind(this);
        this.blurSearchInput = this.blurSearchInput.bind(this);
        this.onSearchEngineChange = this.onSearchEngineChange.bind(this);
	}
    toggleDeleteDialog(open){
        this.setState({deleteDialogOpen: open});
    }
    handleInfoOpen(e){
        e.stopPropagation();
        let target_id = e.currentTarget.parentNode.parentNode.childNodes[3].innerHTML;
        let target_idx = this.props.studentsData.findIndex(x => { return x.username == target_id; });
        let target_obj = Object.assign({}, this.props.studentsData[target_idx]);
        this.setState({open: true, editidx: target_idx, editstd: target_obj, modal_state: true})
    }
    handlePassOpen(e){
        e.stopPropagation();
        let target_id = e.currentTarget.parentNode.parentNode.childNodes[3].innerHTML;
        let target_idx = this.props.studentsData.findIndex(x => { return x.username == target_id; });
        let target_obj = this.props.studentsData[target_idx];
        target_obj.password = '';
        target_obj.check_password = '';
        this.setState({open: true, editidx: target_idx, editstd: target_obj, modal_state: false})
    }
    handleChange(e) {
        let nextState = {
            editstd: this.state.editstd
        };
        nextState.editstd[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    handleEdit(){
        this.props.onStudentEdit(this.state.editstd, this.state.editidx, false).then(() => {
            if(studentEditStatus.status != "SUCCESS"){
                Materialize.toast('학생 정보가 수정 되었습니다!', 2000);
                this.handleClose();
            }
            else{
                return throwError(false, '학생', this.props.classEditStatus.error);
            }
        });
        
    }
    handleStudentPwChange(id, pw, check_pw){
        return this.props.studentsInfoPwChangeRequest(id, pw, check_pw).then(() => {
            if(this.props.studentPwChangeStatus.status==="SUCCESS") {
                Materialize.toast('학생 정보가 수정 되었습니다!', 2000);
                this.handleClose();
                return true;
            } else {
                let errorMessage = {
                    'Bad password.':'비밀번호는 4자  이상이어야 합니다',
                    'Passwords do not match.': '입력하신 비밀번호가 틀립니다'
                };
                return throwError(false, '학생', this.props.classEditStatus.error, errorMessage[this.props.status.error.message]);
            }
        });
    }
    handlePwChange(){
        this.handleStudentPwChange(this.state.editstd._id, this.state.editstd.password, this.state.editstd.check_password);
    }
    handleClose(){
        this.setState({
            open: false, 
            editidx: -1, 
            editstd: {_id: '',username: '',name: '',school: '',level: '', password: '', check_password: ''}, 
            clicked: [],
            remove_active: false
        })
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
    handleRemove(){
        let clicked = [...this.state.clicked];
        let deleting_stds = [];
        let editting_classes = {};
        //map corresponding classes for deleting students
        try{
            for (let i = 0; i < clicked.length; i++){
                let stdidx = clicked[i];
                let std_id = this.props.studentsData[stdidx]._id;
                let std_class = this.props.studentsData[stdidx].class;
                console.log(std_class.class.class);
                if(std_class != ''){
                    if(editting_classes[std_class] == undefined){
                        editting_classes[std_class] = [];
                    }
                    editting_classes[std_class].push(std_id);
                }
                deleting_stds.push({index: stdidx, id: std_id});
            }
        } catch(err){
            err.code = 0;
            return throwError(false, '', err, '');
        }
        // delete students from accomplishments list of lectures
        this.props.lectureData.map((lec, i) => {
            deleting_stds.map((obj, j) => {
                let std = this.props.studentsData[obj.index];
                if(lec.class == std.class){
                    let accs = [...lec.accomplishments];
                    lec.accomplishments.map((acc, k) => {
                        if(acc._id == std._id)
                            accs.splice(k, 1);
                    })
                    lec.accomplishments = accs;
                    this.props.lectureEditRequest(i, lec);
                }
            })
        })
        // delete students
        for(let i = 0; i < deleting_stds.length; i++){
            this.handleStudentRemove(deleting_stds[i].index, deleting_stds[i].id);
            for(let j = 0; j < deleting_stds.length; j++){
                deleting_stds[j].index -= 1;
            }
        }
        // delete students in classes
        for (let key in editting_classes) {
            let classidx = this.props.classData.findIndex(x => { return x._id == key; });
            console.log(classidx)
            let class_obj = this.props.classData[classidx];
            for(let i = 0; i < editting_classes[key].length; i++){
                console.log(class_obj);
                let std_list_in_class = class_obj.students;
                let std_class_idx = std_list_in_class.indexOf(editting_classes[key][i]);
                std_list_in_class.splice(std_class_idx, 1);
            }
            this.props.onClassEdit(class_obj._id, classidx, class_obj).then(()=>{ console.log(this.props.classData)});
        }
    }
    handleRowClick(rowNumber, columnId){
        let clicked = [...this.state.clicked];
        console.log(rowNumber)
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        this.setState({clicked: clicked, remove_active: clicked.length == 0 ? false : true})
    }
    handleFilteredRowClick(rowNumber, columnId){
        let filteredClick = [...this.state.filteredClick];
        let index = filteredClick.indexOf(rowNumber);
        let push = false
        if(index == -1){
            filteredClick.push(rowNumber);
            index = rowNumber;
            push = true;
        }
        else
            filteredClick.splice(index, 1);
        let clicked = [...this.state.clicked];
        let origIndex = this.state.searchResult[index].index;


        if(push){
            clicked.push(origIndex);
        }
        else{
            origIndex = clicked.indexOf(origIndex);
            clicked.splice(origIndex, 1);
        }
        this.setState({clicked: clicked, filteredClick: filteredClick, remove_active: (filteredClick.length == 0 || clicked.length == 0)? false : true})
    }
    handleActive(){
        return this.state.remove_active ? '' : 'inactive';
    }
    searchClassNameById(id){
        let classData = this.props.classData;
        for(let i = 0; i < classData.length; i++){
            if(classData[i]._id == id){
                return classData[i].name;
            }
        }
    }
    focusSearchInput(){
        this.setState({searchOpen: true});
    }
    blurSearchInput(){ 
        this.setState({searchOpen: false})
        if(this.state.searchText == '')
            this.setState({searchStart: false, searchText: '', filteredClick: []});
    }
    onSearchEngineChange(event, value){
        let data = [];
        let filteredClick = [];
        this.props.studentsData.map((std, i) =>{
            let push=false;
            let obj = std;
            obj.index = i;
            if(obj.name.includes(value)) push = true;
            if(obj.username.includes(value)) push = true;
            if(obj.class.includes(value)) push = true;
            if(obj.school.includes(value)) push = true;
            if(push) data.push(obj);
        })
        if(value == ''){
            this.setState({searchOpen: true, searchStart: false, searchResult: [], filteredClick: [], searchText: ''});
        }
        else{
            if(this.state.clicked != []){
                for(let i = 0; i < this.state.clicked.length; i++){
                    let filteredIndex = data.indexOf(this.props.studentsData[this.state.clicked[i]]);
                    if(filteredIndex != -1){
                        filteredClick.push(filteredIndex);
                    }
                }
            }
            this.setState({searchOpen: true, searchStart: true, searchResult: data, filteredClick: filteredClick, searchText: value});
        }
    }
    render(){
        return(
            <div className="Boards">
                <BoardHeader title='학생관리' remove_active={this.state.remove_active} handleRemove={this.toggleDeleteDialog.bind(undefined, true)}
                            plus_button={false} remove_button={true} search_engine={true} searchOpen={this.state.searchOpen}
                            openDialog={null} handleActive={this.handleActive}
                            onSearchEngineChange={this.onSearchEngineChange} 
                            focusSearchInput={this.focusSearchInput} blurSearchInput={this.blurSearchInput} />
                <div className="Board-contents row">
                    <div className="col m12 boardTable">
                    	<StudentTable studentsData={this.props.studentsData} filteredData={this.state.searchResult} 
                                        searchStart={this.state.searchStart} searchText={this.state.searchText} 
                    					clicked={this.state.clicked} filteredClick={this.state.filteredClick} searchClassNameById={this.searchClassNameById} 
                    					handleInfoOpen={this.handleInfoOpen} handlePassOpen={this.handlePassOpen}
                    					handleFilteredRowClick={this.handleFilteredRowClick} handleRowClick={this.handleRowClick}
                                        style={{height: 'calc(100% - 60px)'}}/>
                    </div>

                </div>
                <StudentDialog modal_state={this.state.modal_state} open={this.state.open} editstd={this.state.editstd} 
                				handleChange={this.handleChange} handleClose={this.handleClose} handleEdit={this.handleEdit} handlePwChange={this.handlePwChange}
                				/>  
                <DeleteDialog dialogOn={this.state.deleteDialogOpen} objNum={this.state.clicked.length} closeDialog={this.toggleDeleteDialog.bind(undefined, false)}
                                deleteFunction={this.handleRemove} />              
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        studentEditStatus: state.studentinfo.editStudents,
        studentRemoveStatus: state.studentinfo.removeStudents,
        studentPwChangeStatus: state.studentinfo.pwChange,

        studentsData: state.studentinfo.getStudents.data,
        classData: state.makeclass.board.data,
        lectureData: state.lecture.board.data,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        studentsInfoRemoveRequest: (id, index) => {
            return dispatch(studentsInfoRemoveRequest(id, index));
        },
        lectureEditRequest: (index, contents) => {
            return dispatch(lectureEditRequest(index, contents));
        },
        studentsInfoPwChangeRequest: (id, pw, check_pw) => {
            return dispatch(studentsInfoPwChangeRequest(id, pw, check_pw));
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentBoard);