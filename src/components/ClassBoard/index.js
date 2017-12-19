import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import ClassList from './ClassList';
import ClassDialog from './ClassDialog';

class ClassBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            selected: [],
            plus_active: true,
            newClass: true,
            dialogOpen: false,
            dialogMode: true,
            editClass: {
                _id: '',
                name: '',
                days: {
                    '월': false,
                    '화': false,
                    '수': false,
                    '목': false,
                    '금': false,
                    '토': false,
                    '일': false  
                },
                startTime: '00:00 AM',
                endTime: '00:00 PM',
                teacher: '',
                students: [],
            },
            allStudents: [],
            selectedStudents: [],
            clickedInAllStudents: [],
            clickedInSelectedStudents: []
        }
        //Dialog Mode and Open state
        this.toggleDialog = this.toggleDialog.bind(this);
        this.toggleDialogMode = this.toggleDialogMode.bind(this);
        this.openDialogStudentMode = this.openDialogStudentMode.bind(this);
        this.openDialogClassMode = this.openDialogClassMode.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        //Handling Dialog Data
        this.processData = this.processData.bind(this);
        this.processStudentData = this.processStudentData.bind(this);
        this.handleDialogDataChange = this.handleDialogDataChange.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
        this.addToClass = this.addToClass.bind(this);
        this.removeFromClass = this.removeFromClass.bind(this);
        this.handleListClick = this.handleListClick.bind(this);

        this.getPlusActive = this.getPlusActive.bind(this);
        this.activateModal = this.activateModal.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
	}
    //Dialog Mode and Open state
    toggleDialog(setOpen){
        this.setState({dialogOpen: setOpen})
    }
    toggleDialogMode(setMode){
        this.setState({dialogMode: setMode})
    }
    openDialogClassMode(){
        this.toggleDialogMode(true);
        this.toggleDialog(true);
    }
    openDialogStudentMode(){
        this.toggleDialogMode(false);
        this.toggleDialog(true);
    }
    closeDialog(){
        this.toggleDialog(false);
        this.setState({ allStudents: [], selectedStudents: [], clickedInAllStudents: [], clickedInSelectedStudents: [], newClass: true,
                        editClass: {_id: '',name: '',days: {'월': false,'화': false,'수': false,'목': false,'금': false,'토': false,'일': false  },
                        startTime: '00:00 AM',endTime: '00:00 PM',teacher: '',students: []}})
    }
    //Handling Dialog Data
    processData(index, event){
            let classobj = Object.assign({}, this.props.data[index]);
            let daysobj  = {
                '월': classobj.days.includes('월'),
                '화': classobj.days.includes('화'),
                '수': classobj.days.includes('수'),
                '목': classobj.days.includes('목'),
                '금': classobj.days.includes('금'),
                '토': classobj.days.includes('토'),
                '일': classobj.days.includes('일')  
            } 
            classobj.days = daysobj
            this.processStudentData(classobj);
            this.setState({editClass: classobj, newClass: false})
    }
    processStudentData(classobj){
        let studentsIds = classobj.students;
        let allStudents = this.state.allStudents, selectedStudents = this.state.selectedStudents;
        this.props.studentsData.map((obj, i) =>{
            if(studentsIds.includes(obj._id)){
                selectedStudents.push(Object.assign({}, obj));
            }
            else{
                let push = true;
                this.props.data.map((cls, j) =>{
                    if(cls.students.includes(obj._id)){
                        push = false;
                    }
                })
                if(push){
                    allStudents.push(Object.assign({}, obj));
                }

            }
        })
        this.setState({
            allStudents: allStudents,
            selectedStudents: selectedStudents
        })
    }
    handleDialogDataChange(e, secondData){
        let nextState = {};
        nextState.editClass = this.state.editClass;
        if (typeof secondData == 'string'){
            nextState.editClass[e.target.name] = secondData;
            if(e.target.name == 'name'){
                this.changeClassNameInStudents(e, nextState);
            }
        }
        else if(typeof secondData == 'boolean'){
            nextState.editClass.days[e.target.name] = secondData;
        }
        else{
            nextState.editClass[e] = this.convertToTimeString(secondData);
        }
        this.setState(nextState);
    }
    changeClassNameInStudents(e, nextState){
        let selectedStudents = [...this.state.selectedStudents];
        selectedStudents.map(function(std, i){
            std.class = e.target.value;
        })
        nextState.selectedStudents = selectedStudents;
    }
    convertToTimeString(date){
        let dateString = date.toLocaleTimeString();
        let timeSplit = dateString.split(' ');
        let timeNum = timeSplit[0].split(':');
        timeNum.splice(2, 1);
        let value = timeNum.join(':') + ' ' + timeSplit[1];
        return value;
    }
    onCellClick(type, rowNumber, columnId){
        let nextState = {};
        let clicked = [...this.state[type]];
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        console.log(clicked);
        nextState[type] = clicked;
        nextState.newClass = false;
        this.setState(nextState);
    }    
    addToClass(){
        let students = [...this.state.allStudents], selectedStudents = [...this.state.selectedStudents];
        let removingIds = [];
        for(let i = 0; i < this.state.clickedInAllStudents.length; i++){
            let index = this.state.clickedInAllStudents[i];
            let newObj = students[index];
            newObj.class = this.state.editClass.name;
            selectedStudents.push(newObj);
            removingIds.push(newObj._id);
        }
        for(let i = 0; i < removingIds.length; i++){
            let removingindex = students.findIndex(x=>x._id == removingIds[i]);
            students.splice(removingindex, 1);
        }
        this.setState({selectedStudents: selectedStudents,allStudents: students,clickedInAllStudents: []})
    }
    removeFromClass(){
        let students = [...this.state.allStudents], selectedStudents = [...this.state.selectedStudents];
        let removingIds = [];
        for(let i = 0; i < this.state.clickedInSelectedStudents.length; i++){
            let index = this.state.clickedInSelectedStudents[i];
            let newObj = selectedStudents[index];
            newObj.class = '';
            students.push(newObj);
            removingIds.push(newObj._id);
        }
        for(let i = 0; i < removingIds.length; i++){
            let removingindex = selectedStudents.findIndex(x=>x._id == removingIds[i]);
            selectedStudents.splice(removingindex, 1);
        }
        this.setState({selectedStudents: selectedStudents,allStudents: students,clickedInSelectedStudents: []})
    }


    handleListClick(event, selected){
        let selected_array = [...this.state.selected];
        let plus_active = true;

        console.log(selected);
        console.log(event.target.name.split('-')[1])
        let index = parseInt(event.target.name.split('-')[1]);
        let index_in_selected = selected_array.findIndex(x => x == index);
        if(selected){
            selected_array.push(index);
        }
        else{
            selected_array.splice(index_in_selected, 1);
        }
        console.log(selected_array);

        if(selected_array.length > 0){
            plus_active = false;
        }
        else{
            plus_active = true;
        }
        this.setState({
            selected: selected_array,
            plus_active: plus_active
        })
    }

    getPlusActive(plus_button){
        if(plus_button){
            return this.state.plus_active? '':'inactive';
        }
        else{
            return this.state.plus_active? 'inactive':'';
        }
    }
    activateModal(){
        if(this.state.plus_active)
            return 'modal-trigger';
        else
            return '';
    }

    processDays(days){
        let daystring = '';
        for(let key in days){
            if(days[key]){
                daystring += key;
            }
        }
        console.log(daystring);
        return daystring;
    }
    handlePost(){
        let contents = Object.assign({}, this.state.editClass);
        contents.days = this.processDays(this.state.editClass.days);
        console.log(contents)
        this.props.onClassPost(contents).then(() =>{
            this.closeDialog();
        })
    }
    handleEdit() {
        let contents = Object.assign({}, this.state.editClass);
        contents.days = this.processDays(this.state.editClass.days);
        let classindex = this.props.data.findIndex(x => x._id == contents._id);
        let props = this.props;
        this.state.selectedStudents.map(function(obj, i){
            let index = props.studentsData.findIndex(x => x._id==obj._id);
            console.log(obj);
            console.log(contents.name, props.studentsData[index].class, obj.class)
            if(props.studentsData[index].class != obj.class){
                props.onStudentEdit(obj, index, true);
                contents.students.push(obj._id);
            }
        });
        this.state.allStudents.map(function(obj, i){
            let index = props.studentsData.findIndex(x => x._id==obj._id);
            let indexInClass = contents.students.findIndex(x => x == obj._id);
            if(props.studentsData[index].class != obj.class){
                console.log(contents.students);
                props.onStudentEdit(obj, index, true);
                contents.students.splice(indexInClass, 1);
            }
            
        });
        this.props.onClassEdit(contents._id, classindex, contents).then(() => {
            this.closeDialog();
        })
    }
    handleRemove(){
        let props = this.props;
        let selected = [...this.state.selected];
        let student_ids = [];
        // console.log(selected)
        this.state.selected.map(function(index, i){
            student_ids = [...student_ids, ...props.data[index].students];
            props.onRemove(props.data[index]._id, index);
        });
        for (let i = 0; i < student_ids.length; i++){
            let std_idx = this.props.studentsData.findIndex(x => x._id == student_ids[i]);
            let std_obj = this.props.studentsData[std_idx]
            std_obj.class = '';
            props.onStudentEdit(std_obj, std_idx, true);
        }
        this.setState({
            selected: [],
            plus_active: true
        })
    }
	render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4>수업관리</h4></div>
                <div className="icons col m8">
                    <a onClick={this.state.plus_active ? null : this.handleRemove}>
                        <FontAwesome className={'remove-button right ' + this.getPlusActive(false)} name="trash-o" />
                    </a>
                    <a onClick={this.state.plus_active ? this.openDialogClassMode : null}>
                        <FontAwesome className={'plus-button right ' + this.getPlusActive(true)} name="plus" />
                    </a>
                </div>
            </div>
        )

		return(
            <div className="Boards">
                { boardHeader }
	            <div className="Board-contents row">
                    <div className="col m12">
                        <ClassList classData={this.props.data} selected={this.state.selected}
                                    processData={this.processData} handleClick={this.handleListClick}
                                   openClassMode={this.openDialogClassMode} openStudentMode={this.openDialogStudentMode} />
                    </div>
	            </div>
                <ClassDialog mode={this.state.dialogMode} newClass={this.state.newClass} open={this.state.dialogOpen} data={this.state.editClass}
                             allStudents={this.state.allStudents} selectedStudents={this.state.selectedStudents} clickedInSelectedStudents={this.state.clickedInSelectedStudents} clickedInAllStudents={this.state.clickedInAllStudents}
                             handleDataChange={this.handleDialogDataChange} handleCheck={this.handleDialogDayCheck} onCellClick={this.onCellClick}
                             handlePost={this.handlePost} handleEdit={this.handleEdit}
                             addToClass={this.addToClass} removeFromClass={this.removeFromClass} handleClose={this.closeDialog} />
            </div>
		)
	}
}

ClassBoard.propTypes = {
    data: React.PropTypes.array,
    currentUser: React.PropTypes.string,
    onRemove: React.PropTypes.func,
};

ClassBoard.defaultProps = {
    data: [],
    currentUser: '',
    onRemove: (id, index) => { console.error('remove function not defined'); }
};

export default ClassBoard;