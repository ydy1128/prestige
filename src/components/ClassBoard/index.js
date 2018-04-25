import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import ClassList from './ClassList';
import ClassDialog from './ClassDialog';
import BoardHeader from 'components/commons/BoardHeader';
import DeleteDialog from './DeleteDialog';

class ClassBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            clicked: [],
            remove_active: false,
            newClass: true,
            dialogOpen: false,
            deleteDialogOpen: false,
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
            clickedInSelectedStudents: [],

            filteredClick: [],
            searchStart: false,
            searchOpen: false,
            searchText: '',
            searchResult: [],
        }
        //Dialog Mode and Open state
        this.toggleDialog = this.toggleDialog.bind(this);
        this.toggleDialogMode = this.toggleDialogMode.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
        //Handling Dialog Data
        this.processData = this.processData.bind(this);
        this.processStudentData = this.processStudentData.bind(this);
        this.handleDialogDataChange = this.handleDialogDataChange.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
        this.addToClass = this.addToClass.bind(this);
        this.removeFromClass = this.removeFromClass.bind(this);
        this.handleListClick = this.handleListClick.bind(this);
        this.handleFilteredListClick = this.handleFilteredListClick.bind(this);

        this.removeActive = this.removeActive.bind(this);
        this.activateModal = this.activateModal.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.focusSearchInput = this.focusSearchInput.bind(this);
        this.blurSearchInput = this.blurSearchInput.bind(this);
        this.onSearchEngineChange = this.onSearchEngineChange.bind(this);

	}
    //Dialog Mode and Open state
    toggleDialog(setOpen){
        this.setState({dialogOpen: setOpen})
    }
    toggleDialogMode(setMode){
        this.setState({dialogMode: setMode})
    }
    openDialog(mode){
        this.toggleDialogMode(mode);
        this.toggleDialog(true);
    }
    closeDialog(){
        this.toggleDialog(false);
        this.setState({ allStudents: [], selectedStudents: [], clickedInAllStudents: [], clickedInSelectedStudents: [], newClass: true,
                        editClass: {_id: '',name: '',days: {'월': false,'화': false,'수': false,'목': false,'금': false,'토': false,'일': false  },
                        startTime: '00:00 AM',endTime: '00:00 PM',teacher: '',students: []}})
    }
    toggleDeleteDialog(open){
        this.setState({deleteDialogOpen: open})
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
            if(studentsIds.includes(obj._id) && obj.class == classobj._id){
                selectedStudents.push(Object.assign({}, obj));
            }
            //check if other class has student
            else{
                let push = true;
                this.props.data.map((cls, j) =>{
                    if(cls.students.includes(obj._id) && obj.class == cls._id){
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
            newObj.class = this.state.editClass._id;
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


    handleListClick(event, clicked){
        let clicked_array = [...this.state.clicked];
        let remove_active = false;

        let index = parseInt(event.target.name.split('-')[1]);
        let index_in_clicked = clicked_array.findIndex(x => x == index);
        if(clicked){
            clicked_array.push(index);
        }
        else{
            clicked_array.splice(index_in_clicked, 1);
        }
        console.log(clicked_array);

        if(clicked_array.length > 0){
            remove_active = true;
        }
        else{
            remove_active = false;
        }
        this.setState({
            clicked: clicked_array,
            remove_active: remove_active
        })
    }
    handleFilteredListClick(rowNumber, event, clicked){
        let filteredClick = [...this.state.filteredClick];
        console.log(event, clicked, rowNumber)
        let index = filteredClick.indexOf(rowNumber);
        let push = false;
        if(index == -1){
            filteredClick.push(rowNumber);
            index = rowNumber;
            push = true;
        }
        else
            filteredClick.splice(index, 1);
        let clickedArray = [...this.state.clicked];
        let origIndex = this.state.searchResult[index].index;


        if(push){
            clickedArray.push(origIndex);
        }
        else{
            origIndex = clickedArray.indexOf(origIndex);
            clickedArray.splice(origIndex, 1);
        }
        // console.log(clicked, filteredClick)
        this.setState({clicked: clickedArray, filteredClick: filteredClick, remove_active: (filteredClick.length == 0 || clickedArray.length == 0)? false : true})
    }
    removeActive(remove_button){
        if(remove_button){
            return this.state.remove_active? 'inactive':'';
        }
        else{
            return this.state.remove_active? '':'inactive';
        }
    }
    activateModal(){
        if(this.state.remove_active)
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
        this.props.onClassPost(contents).then((success) =>{
            if(success) this.closeDialog();
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
        this.props.onClassEdit(contents._id, classindex, contents).then((success) => {
            if(success) this.closeDialog();
        })
    }
    handleRemove(){
        let props = this.props;
        let clicked = [...this.state.clicked];
        let student_ids = [];
        // console.log(clicked)
        this.state.clicked.map(function(index, i){
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
            clicked: [],
            remove_active: true
        })
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
        this.props.data.map((cls, i) =>{
            let push=false;
            let obj = cls;
            obj.index = i;

            if(obj.name.includes(value)) push = true;
            if(obj.days.includes(value)) push = true;
            if(obj.startTime.includes(value)) push = true;
            if(obj.endTime.includes(value)) push = true;
            if(push) data.push(obj);
            console.log(data)
        })
        if(value == ''){
            this.setState({searchOpen: true, searchStart: false, searchResult: [], filteredClick: [], searchText: ''});
        }
        else{
            if(this.state.clicked != []){
                for(let i = 0; i < this.state.clicked.length; i++){
                    let filteredIndex = data.indexOf(this.props.data[this.state.clicked[i]]);
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
                <BoardHeader title='수업관리' remove_active={this.state.remove_active} handleRemove={this.toggleDeleteDialog.bind(undefined, true)}
                                plus_button={true} remove_button={true} search_engine={true} searchOpen={this.state.searchOpen}
                                openDialog={this.openDialog.bind(true)} handleActive={this.removeActive}
                                onSearchEngineChange={this.onSearchEngineChange} 
                                focusSearchInput={this.focusSearchInput} blurSearchInput={this.blurSearchInput} />
	            <div className="Board-contents row">
                    <div className="col m12 boardTable">
                        <ClassList classData={this.props.data} filteredData={this.state.searchResult}
                                    searchStart={this.state.searchStart} searchText={this.state.searchText} 
                                    clicked={this.state.clicked} filteredClick={this.state.filteredClick}
                                    processData={this.processData}
                                    handleClick={this.handleListClick}  handleFilteredClick={this.handleFilteredListClick}
                                    openClassMode={this.openDialog.bind(true)} openStudentMode={this.openDialog.bind(false)} />
                    </div>
	            </div>
                <ClassDialog mode={this.state.dialogMode} newClass={this.state.newClass} open={this.state.dialogOpen} data={this.state.editClass}
                             allStudents={this.state.allStudents} selectedStudents={this.state.selectedStudents} clickedInSelectedStudents={this.state.clickedInSelectedStudents} clickedInAllStudents={this.state.clickedInAllStudents}
                             handleDataChange={this.handleDialogDataChange} onCellClick={this.onCellClick}
                             handlePost={this.handlePost} handleEdit={this.handleEdit}
                             addToClass={this.addToClass} removeFromClass={this.removeFromClass} handleClose={this.closeDialog} />
                <DeleteDialog dialogOn={this.state.deleteDialogOpen} objNum={this.state.clicked.length} closeDialog={this.toggleDeleteDialog.bind(undefined, false)}
                                deleteFunction={this.handleRemove} />    
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