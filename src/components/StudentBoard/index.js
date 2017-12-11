import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

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
            remove_active: false,
            modal_state: true
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
        this.handleRowSelection = this.handleRowSelection.bind(this);
        //handle button active
        this.handleActive = this.handleActive.bind(this);
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
        if(this.state.remove_active){
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
    }
    handleRowClick(rowNumber, columnId){
        let clicked = [...this.state.clicked];
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        console.log(clicked)
        this.setState({clicked: clicked, remove_active: clicked.length == 0 ? false : true})
    }
    handleRowSelection(rowIds){
        this.setState({clicked: rowIds})
    }
    handleActive(){
        return this.state.remove_active ? '' : 'inactive';
    }
    render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4>학생관리</h4></div>
                <div className="icons col m8">
                    <a onClick={this.handleRemove}>
                        <FontAwesome id="stdBoardRemove" className={'remove-button right ' + this.handleActive()} name="trash-o" />
                    </a>
                </div>
            </div>
        )
        return(
            <div className="Boards">
                { boardHeader }
                <div className="Board-contents row">
                    <div className="col m12">
                    	<StudentTable studentsData={this.props.studentsData} 
                    					clicked={this.state.clicked}
                    					handleInfoOpen={this.handleInfoOpen} handlePassOpen={this.handlePassOpen}
                    					handleRowSelection={this.handleRowSelection} handleRowClick={this.handleRowClick}/>
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
