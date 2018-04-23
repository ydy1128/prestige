import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import TextField from 'material-ui/TextField';

import BoardHeader from '../commons/BoardHeader';
import StudentDialog from './StudentDialog';
import StudentTable from './StudentTable';
import DeleteDialog from './DeleteDialog';

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
        let target_obj = this.props.studentsData[target_idx];
        console.log(target_obj)
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
        this.props.onStudentEdit(this.state.editstd, this.state.editidx, false);
        this.handleClose();
    }
    handlePwChange(){
        this.props.onStudentPwChange(this.state.editstd._id, this.state.editstd.password, this.state.editstd.check_password);
        this.handleClose();
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
    handleRemove(){
        let clicked = [...this.state.clicked];
        let deleting_stds = [];
        let editting_classes = {};
        for (let i = 0; i < clicked.length; i++){
            let stdidx = clicked[i];
            let std_id = this.props.studentsData[stdidx]._id;
            let std_class = this.props.studentsData[stdidx].class;
            if(std_class != ''){
                if(editting_classes[std_class] == undefined){
                    editting_classes[std_class] = [];
                }
                editting_classes[std_class].push(std_id);
            }
            deleting_stds.push({index: stdidx, id: std_id});
        }
        for(let i = 0; i < deleting_stds.length; i++){
            this.props.onStudentRemove(deleting_stds[i].index, deleting_stds[i].id).then(()=>{ console.log(this.props.studentsData)});
            for(let j = 0; j < deleting_stds.length; j++){
                deleting_stds[j].index -= 1;
            }
        }
        for (let key in editting_classes) {
            let classidx = this.props.classData.findIndex(x => { return x.name == key; });
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
        this.setState({clicked: clicked, filteredClick: filteredClick, remove_active: (filteredClick == 0 || clicked == 0)? false : true})
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

StudentBoard.propTypes = {
    studentsData: React.PropTypes.array,
}
StudentBoard.defaultProps = {
    studentsData: [],
}
export default StudentBoard;
