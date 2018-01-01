import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import TextField from 'material-ui/TextField';

import StudentDialog from './StudentDialog';
import StudentTable from './StudentTable';
class StudentBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            open: false,
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
            searchText: '',
            searchResult: []
        }
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
        //handle button active
        this.handleActive = this.handleActive.bind(this);
        this.searchClassNameById = this.searchClassNameById.bind(this);
        this.focusSearchInput = this.focusSearchInput.bind(this);
        this.blurSearchInput = this.blurSearchInput.bind(this);
        this.onSearchEngineChange = this.onSearchEngineChange.bind(this);
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
                let std_list_in_class = class_obj.students;
                let std_class_idx = std_list_in_class.indexOf(editting_classes[key][i]);
                std_list_in_class.splice(std_class_idx, 1);
            }
            this.props.onClassEdit(class_obj._id, classidx, class_obj).then(()=>{ console.log(this.props.classData)});
        }
    }
    handleRowClick(rowNumber, columnId){
        let clicked = [...this.state.clicked];
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        this.setState({clicked: clicked, remove_active: clicked.length == 0 ? false : true})
    }
    handleFilteredRowClick(rowNumber, columnId){
        let fileteredClick = [...this.state.filteredClick];
        let clicked = [...this.state.clicked];
        let index = filteredClick.indexOf(rowNumber);
        let origIndex = clicked.indexOf(this.state.filteredData[index].index);
        console.log(this.state.filteredData[index]);
        console.log(this.state.studentsData[origIndex]);
        if(index == -1){
            clicked.push(origIndex);
            filteredClick.push(index);
        }
        else{
            clicked.splice(origIndex, 1);
            filteredClick.splice(index, 1);
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
        this.refs.searchEngine.focus();
        this.setState({searchOpen: true});
    }
    blurSearchInput(){
        this.setState({searchOpen: false, searchText: ''});
    }
    onSearchEngineChange(event, value){
        let data = [];
        this.props.studentsData.map((std, i) =>{
            let push=false;
            let obj = Object.assign({}, std);
            obj.index = i;
            if(obj.name.includes(value)) push = true;
            if(obj.username.includes(value)) push = true;
            if(obj.class.includes(value)) push = true;
            if(obj.school.includes(value)) push = true;
            if(push) data.push(obj);
        })
        if(value == '')
            this.setState({searchOpen: false, searchText: ''});
        else
            this.setState({searchResult: data, searchText: value});
    }
    render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div style={{width: '155px'}} className="col m4"><h4>학생관리</h4></div>
                <div style={{width: 'calc(100% - 155px)'}}className="icons col m8">
                    <a onClick={this.state.remove_active? this.handleRemove : null}>
                        <FontAwesome id="stdBoardRemove" className={'remove-button right ' + this.handleActive()} name="trash-o" />
                    </a>
                    <a onClick={this.focusSearchInput}>
                        <FontAwesome  className={'search-button left '} name="search" />
                    </a>
                    <TextField name="searchEngine" onChange={this.onSearchEngineChange} onFocus={this.focusSearchInput} ref="searchEngine" style={{height: '55px', margin: '10px 10px -20px -20px', padding: '0 10px'}}/>
                </div>
                
            </div>
        )
        return(
            <div className="Boards">
                { boardHeader }
                <div className="Board-contents row">
                    <div className="col m12">
                    	<StudentTable studentsData={this.props.studentsData} filteredData={this.state.searchResult} 
                                        searchOpen={this.state.searchOpen} searchText={this.state.searchText} 
                    					clicked={this.state.clicked} searchClassNameById={this.searchClassNameById} 
                    					handleInfoOpen={this.handleInfoOpen} handlePassOpen={this.handlePassOpen}
                    					handleFilteredRowClick={this.handleFilteredRowClick} handleRowClick={this.handleRowClick}/>
                    </div>

                </div>
                <StudentDialog modal_state={this.state.modal_state} open={this.state.open} editstd={this.state.editstd} 
                				handleChange={this.handleChange} handleClose={this.handleClose} handleEdit={this.handleEdit} handlePwChange={this.handlePwChange}
                				/>                
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
