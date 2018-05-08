import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import ClassList from './ClassList';
import ClassDialog from './ClassDialog';
import BoardHeader from 'components/commons/BoardHeader';
import DeleteDialog from './DeleteDialog';
import { classBoardRequest, classPostRequest, classEditRequest, classRemoveRequest } from 'actions/makeclass';
import { lectureEditRequest } from 'actions/lecture';

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

            studentSearchOpen: false,
            studentSearchStart: false,
            studentSearchText: '',
            filteredAllStudents: [],
            filteredSelectedStudents: [],
            filteredClickInAllStudents: [],
            filteredClickInSelectedStudents: [],

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
        this.focusStudentSearchInput = this.focusStudentSearchInput.bind(this);
        this.blurStudentSearchInput = this.blurStudentSearchInput.bind(this);
        this.onStudentSearchChange = this.onStudentSearchChange.bind(this);

        this.handleClassPost = this.handleClassPost.bind(this);
        this.handleClassRemove = this.handleClassRemove.bind(this);
	}
    //Dialog Mode and Open state
    toggleDialog(setOpen){
        this.setState({dialogOpen: setOpen})
    }
    toggleDialogMode(setMode){
        this.setState({dialogMode: setMode})
    }
    openDialog(mode, event){
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
        console.log(type, rowNumber)
        let nextState = {};
        let clicked = [...this.state[type]];
        let index = clicked.indexOf(rowNumber);
        console.log(index)
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
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
        this.setState({selectedStudents: selectedStudents,allStudents: students,clickedInAllStudents: [], studentSearchText: '', studentSearchStart: false, studentSearchOpen: false})
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
        this.setState({selectedStudents: selectedStudents,allStudents: students,clickedInSelectedStudents: [], studentSearchText: '', studentSearchStart: false, studentSearchOpen: false})
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
        return daystring;
    }
    handleClassPost(contents){
        return this.props.classPostRequest(contents).then(() => {
            if(this.props.classPostStatus.status === "SUCCESS") {
                Materialize.toast('수업이 개설 되었습니다!', 2000);
                return true;
            }
            else {
                let errorMessage = {
                    'Empty contents.':'모든 정보를 채워주세요',
                    'Class name already exists.':'존재하는 수업 이름입니다'
                };
                return throwError(false, '수업', this.props.classPostStatus.error, errorMessage[this.props.classPostStatus.error.message]);
            }
        });
    }
    handlePost(){
        let contents = Object.assign({}, this.state.editClass);
        contents.days = this.processDays(this.state.editClass.days);
        this.handleClassPost(contents).then((success) =>{
            if(success) this.closeDialog();
        })
    }
    handleEdit() {
        let contents = Object.assign({}, this.state.editClass);
        contents.days = this.processDays(this.state.editClass.days);
        let classindex = this.props.data.findIndex(x => x._id == contents._id);
        this.state.selectedStudents.map((obj, i) => {
            let index = this.props.studentsData.findIndex(x => x._id==obj._id);
            if(this.props.studentsData[index].class != obj.class){
                this.props.onStudentEdit(obj, index, true);
                contents.students.push(obj._id);
                this.props.lectureData.map((lec, j) => {
                    if(lec.class == contents._id){
                        let accs = [...lec.accomplishments];
                        if(!lec.accomplishments.includes(obj._id)){
                            accs.push({_id: obj._id, accomplishments: 0, startTime: '', endTime: ''})
                        }
                        lec.accomplishments = accs;
                        this.props.lectureEditRequest(j, lec);
                    }
                })
            }
        });
        this.state.allStudents.map((obj, i) =>{
            let index = this.props.studentsData.findIndex(x => x._id==obj._id);
            let indexInClass = contents.students.findIndex(x => x == obj._id);
            if(this.props.studentsData[index].class != obj.class){
                this.props.onStudentEdit(obj, index, true);
                contents.students.splice(indexInClass, 1);
                this.props.lectureData.map((lec, j) => {
                    if(lec.class == contents._id){
                        let accs = [...lec.accomplishments];
                        lec.accomplishments.map((acc, k) => {
                            if(acc._id == obj._id)
                                accs.splice(k, 1);
                        })
                        lec.accomplishments = accs;
                        this.props.lectureEditRequest(j, lec);
                    }
                })
            }
        });
        this.props.onClassEdit(contents._id, classindex, contents).then((success) => {
            if(success) this.closeDialog();
        })
    }
    handleRemove(){
        let clicked = [...this.state.clicked];
        let student_ids = [];
        this.state.clicked.map((index, i) => {
            student_ids = [...student_ids, ...this.props.data[index].students];
            this.handleClassRemove(this.props.data[index]._id, index);
        });
        for (let i = 0; i < student_ids.length; i++){
            let std_idx = this.props.studentsData.findIndex(x => x._id == student_ids[i]);
            let std_obj = this.props.studentsData[std_idx]
            std_obj.class = '';
            this.props.onStudentEdit(std_obj, std_idx, true);
        }
        this.setState({
            clicked: [],
            remove_active: true
        })
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
    focusStudentSearchInput(){
        this.setState({studentSearchOpen: true});
    }
    blurStudentSearchInput(){
        this.setState({studentSearchOpen: false})
        if(this.state.studentSearchText == '')
            this.setState({studentSearchStart: false, studentSearchText: '', filteredAllStudents: [], filteredSelectedStudents: []});
    }
    onStudentSearchChange(event, value){
        let studentData = [];
        let selectedStudentData = [];
        let filteredClickInAllStudents = [];
        let filteredClickInSelectedStudents = [];
        this.state.allStudents.map((std, i) => {
            let push = false;
            std.index = i;
            if(std.name.includes(value)) push = true;
            if(std.school.includes(value)) push = true;
            if((''+std.level).includes(value)) push = true;
            if(push) studentData.push(std);
        })
        this.state.selectedStudents.map((std, i) => {
            let push = false;
            std.index = i;
            if(std.name.includes(value)) push = true;
            if(std.school.includes(value)) push = true;
            if((''+std.level).includes(value)) push = true;
            if(push) selectedStudentData.push(std);
        })
        if(value == '')
            this.setState({studentSearchOpen: true, studentSearchStart: false, filteredClickInAllStudents: [], filteredClickInSelectedStudents: [], 
                            filteredAllStudents: [], filteredSelectedStudents: [], studentSearchText: ''})
        else{
            if(this.state.clickedInAllStudents != []){
                for(let i = 0; i < this.state.clickedInAllStudents.length; i++){
                    let filteredIndex = studentData.indexOf(this.state.allStudents[this.state.clickedInAllStudents[i]]);
                    if(filteredIndex != -1)
                        filteredClickInAllStudents.push(filteredIndex);
                }
            }
            if(this.state.clickedInSelectedStudents != []){
                for(let i = 0; i < this.state.clickedInSelectedStudents.length; i++){
                    let filteredIndex = selectedStudentData.indexOf(this.state.selectedStudents[this.state.clickedInSelectedStudents[i]]);
                    if(filteredIndex != -1)
                        filteredClickInSelectedStudents.push(filteredIndex);
                }
            }
            this.setState({studentSearchOpen: true, studentSearchStart: true, filteredClickInAllStudents: filteredClickInAllStudents, filteredClickInSelectedStudents: filteredClickInSelectedStudents, 
                            filteredAllStudents: studentData, filteredSelectedStudents: selectedStudentData, studentSearchText: value});
        }
    }
	render(){
		return(
            <div className="Boards">
                <BoardHeader title='수업관리' remove_active={this.state.remove_active} handleRemove={this.toggleDeleteDialog.bind(undefined, true)}
                                plus_button={true} remove_button={true} search_engine={true} searchOpen={this.state.searchOpen}
                                openDialog={this.openDialog.bind(undefined, true)} handleActive={this.removeActive}
                                onSearchEngineChange={this.onSearchEngineChange} 
                                focusSearchInput={this.focusSearchInput} blurSearchInput={this.blurSearchInput} />
	            <div className="Board-contents row">
                    <div className="col m12 boardTable">
                        <ClassList classData={this.props.data} filteredData={this.state.searchResult}
                                    searchStart={this.state.searchStart} searchText={this.state.searchText} 
                                    clicked={this.state.clicked} filteredClick={this.state.filteredClick}
                                    processData={this.processData}
                                    handleClick={this.handleListClick}  handleFilteredClick={this.handleFilteredListClick}
                                    openClassMode={this.openDialog.bind(undefined, true)} openStudentMode={this.openDialog.bind(undefined, false)} />
                    </div>
	            </div>
                <ClassDialog mode={this.state.dialogMode} newClass={this.state.newClass} open={this.state.dialogOpen} data={this.state.editClass}
                             allStudents={this.state.allStudents} selectedStudents={this.state.selectedStudents} clickedInSelectedStudents={this.state.clickedInSelectedStudents} clickedInAllStudents={this.state.clickedInAllStudents}
                             filteredAllStudents={this.state.filteredAllStudents} filteredSelectedStudents={this.state.filteredSelectedStudents}  
                             filteredClickInAllStudents={this.state.filteredClickInAllStudents} filteredClickInSelectedStudents={this.state.filteredClickInSelectedStudents}
                             searchStart={this.state.studentSearchStart}
                             handleDataChange={this.handleDialogDataChange} onCellClick={this.onCellClick}
                             handlePost={this.handlePost} handleEdit={this.handleEdit}
                             addToClass={this.addToClass} removeFromClass={this.removeFromClass} handleClose={this.closeDialog} 
                             focusSearchInput={this.focusStudentSearchInput} blurSearchInput={this.blurStudentSearchInput} onSearchEngineChange={this.onStudentSearchChange}/>
                <DeleteDialog dialogOn={this.state.deleteDialogOpen} objNum={this.state.clicked.length} closeDialog={this.toggleDeleteDialog.bind(undefined, false)}
                                deleteFunction={this.handleRemove} />    
            </div>
		)
	}
}

ClassBoard.propTypes = {
    data: React.PropTypes.array,
    currentUser: React.PropTypes.string,
};

ClassBoard.defaultProps = {
    data: [],
    currentUser: '',
};

const mapDispatchToProps = (dispatch) => {
    return {
        classPostRequest: (contents) => {
            return dispatch(classPostRequest(contents));
        },
        classRemoveRequest: (id, index) => {
            return dispatch(classRemoveRequest(id, index));
        },
        lectureEditRequest: (index, contents) =>{
            return dispatch(lectureEditRequest(index, contents));
        }
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.makeclass.board.data,
        studentsData: state.studentinfo.getStudents.data,
        lectureData: state.lecture.board.data,

        classPostStatus: state.makeclass.post,
        classRemoveStatus: state.makeclass.removeClass,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassBoard);