import React from "react";
import { connect } from 'react-redux';
import { lecturePostRequest, lectureEditRequest, lectureRemoveRequest } from 'actions/lecture';
import throwError from 'components/commons/throwError';

var container = (Present) =>{
	class Container extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                dialogOpen: false,
                deleteDialogOpen: false,
                dialogEditMode: true,
                newOne: true,
                clicked: [],
                filteredClick: [],
                classData: [],
                editlec: -1,
                currObj: {
                	_id: '',
                	name: '',
                	link: '',
                	class: '',
                	className: '',
                	accomplishments: [],
                },
                remove_active: false,
                searchStart: false,
                searchOpen: false,
                searchText: '',
                searchResult: [],

            };
            this.filterAutocompleteData = this.filterAutocompleteData.bind(this);

            this.toggleDialog = this.toggleDialog.bind(this);
            this.openDialog = this.openDialog.bind(this);
            this.closeDialog = this.closeDialog.bind(this);
            this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
            this.toggleEditMode = this.toggleEditMode.bind(this);
            this.openEditMode = this.openEditMode.bind(this);
            this.closeEditMode = this.closeEditMode.bind(this);
            this.setNew = this.setNew.bind(this);

	        this.searchClassNameById = this.searchClassNameById.bind(this);
	        this.searchStudentNameById = this.searchStudentNameById.bind(this);
	        this.getClassById = this.getClassById.bind(this);
            this.onClassChange = this.onClassChange.bind(this);
            this.onInputChange = this.onInputChange.bind(this);
            this.handleDialogDataChange = this.handleDialogDataChange.bind(this);
            this.handlePost = this.handlePost.bind(this);
            this.handleEdit = this.handleEdit.bind(this);
            this.handleRemove = this.handleRemove.bind(this);

            this.handleRowClick = this.handleRowClick.bind(this);
            this.handleFilteredRowClick = this.handleFilteredRowClick.bind(this);
            this.focusSearchInput = this.focusSearchInput.bind(this);
            this.blurSearchInput = this.blurSearchInput.bind(this);
            this.onSearchEngineChange = this.onSearchEngineChange.bind(this);

        }
	    render() {
	        let presentState = ['dialogOpen', 'deleteDialogOpen', 'dialogEditMode', 'clicked', 'currObj', 'newOne', 'editlec', 'remove_active', 'filteredClick', 'searchStart', 'searchOpen', 'searchText', 'searchResult'];
	        let presentProps = [];
	        let customProps = {
	        	classData: this.state.classData,
	        	lectureData: this.props.lectureData,
	        };
	        let presentFunctions = {
	        	openDialog: this.openDialog, 
	        	closeDialog: this.closeDialog,
	        	toggleDeleteDialog: this.toggleDeleteDialog,
	        	openEditMode: this.openEditMode, 
	        	closeEditMode: this.closeEditMode,
	        	searchClassNameById: this.searchClassNameById,
	        	searchStudentNameById: this.searchStudentNameById,
	        	onClassChange: this.onClassChange,
	        	onInputChange: this.onInputChange,
	        	handleDialogDataChange: this.handleDialogDataChange,
	        	handlePost: this.handlePost,
	        	handleEdit: this.handleEdit,
	        	handleRowClick: this.handleRowClick,
	        	handleRemove: this.handleRemove,
	        	focusSearchInput: this.focusSearchInput,
	        	blurSearchInput: this.blurSearchInput,
	        	onSearchEngineChange: this.onSearchEngineChange,
	        	handleFilteredRowClick: this.handleFilteredRowClick,
	        }

	        return (
	            <Present  
		            props={{...(_.pick(this.props, presentProps)), ...customProps}}
		            state={_.pick(this.state, presentState)}
		            functions={presentFunctions}
		        />
	        )
	    }
	    componentDidMount(){
	    	this.filterAutocompleteData();
	    }
	    openDialog(newOne, editMode, index, event){
	    	console.log(newOne, editMode, index)
	    	this.toggleDialog(true);
	    	this.setNew(newOne);
	    	console.log(editMode);
	    	if(editMode){
	    		this.setNew(newOne);
	    		this.openEditMode();
	    	}
	    	else{
	    		let obj = this.props.lectureData[index];
		    	obj.className = this.searchClassNameById(obj.class);
	    		this.setState({currObj: obj, editlec: index});
	    		this.closeEditMode();
	    	}
	    }
	    closeDialog(){
	    	this.setState({currObj:{ _id: '',name: '',link: '', className: '', class: '',accomplishments: []}, editlec: -1, clicked: [], remove_active: false})
	    	this.toggleDialog(false);
	    }
	    toggleDeleteDialog(open){
	    	this.setState({deleteDialogOpen: open});
	    }
	    toggleDialog(openState){
	    	this.setState({dialogOpen: openState});
	    }
	    openEditMode(){
	    	console.log(this.state.currObj)
	    	this.toggleEditMode(true);
	    }
	    closeEditMode(){
	    	this.toggleEditMode(false);
	    }
	    toggleEditMode(editState){
	    	this.setState({dialogEditMode: editState})
	    }
	    setNew(newOne){
	    	console.log('setNew: ', newOne)
	    	this.setState({newOne: newOne});
	    }
	    filterAutocompleteData(){
	    	let acData = [...this.props.classData].map(obj => {return {text: obj.name, value: obj._id}; });
	    	console.log(acData)
	    	this.setState({classData: acData});
	    }
	    searchClassNameById(id){
	        let classData = this.state.classData;
	        for(let i = 0; i < classData.length; i++){
	            if(classData[i].value == id)
	                return classData[i].text;
	        }
	    }
	    searchStudentNameById(id){
	    	let studentsData = this.props.studentsData;
	    	for(let i = 0; i < studentsData.length; i++){
	    		if(studentsData[i]._id == id)
	    			return studentsData[i].name;
	    	}
	    }
	    getClassById(id){
	        let classData = this.props.classData;
	        for(let i = 0; i < classData.length; i++){
	            if(classData[i]._id == id){
	                return classData[i];
	            }
	        }
	    }
	    onClassChange(chosenRequest, index){
	    	let nextState = {
	    		currObj: this.state.currObj
	    	};
	    	let cls = this.getClassById(chosenRequest.value);
	    	if(cls == undefined || cls == ''){
	    		throwError(false, '', {code: 400}, '수업을 선택해주세요');
	    		return '';
	    	}
	    	for(let i = 0; i < cls.students.length; i++){
	    		nextState.currObj.accomplishments.push({_id: cls.students[i], accomplishments: 0, startTime: '', endTime: ''});
	    	}
	    	nextState.currObj.class = chosenRequest.value;
	    	this.setState(nextState);
	    }
	    onInputChange(searchText){
	    	let nextState = {
	    		currObj: this.state.currObj
	    	};
	    	console.log(searchText)
	    	nextState.currObj.className = searchText;
	    	this.setState(nextState)
	    }

	    handleDialogDataChange(e){
	        let nextState = {
	            currObj: this.state.currObj
	        };
	        // let value = e.target.value;
	        if(e.target.name == 'link')
	        	e.target.value = e.target.value.replace('watch?v=', 'embed/');
	        nextState.currObj[e.target.name] = e.target.value;
	        this.setState(nextState);
	    }

	    handlePost(contents){
	    	return this.props.lecturePostRequest(contents).then(() =>{
	    		if(this.props.lecturePostStatus.status === 'SUCCESS'){
                    Materialize.toast('강의가 생성 되었습니다!', 2000);
	    			this.closeEditMode();
	    		}
	    		else{
	    			console.log(this.props.lecturePostStatus)
                    return throwError(false, '강의', this.props.lecturePostStatus.error, '');
	    		}	    		
	    	});
	    }
	    handleEdit(index, contents){
	    	return this.props.lectureEditRequest(index, contents).then(()=>{
	    		if(this.props.lectureEditStatus.status === 'SUCCESS'){
                    Materialize.toast('강의가 수정 되었습니다!', 2000);
	    			this.closeEditMode();
	    		}
	    		else{
                    return throwError(false, '강의', this.props.lectureEditStatus.error, '');
	    		}	    		
	    	})
	    }
	    handleRemove(id, index){
	    	return this.props.lectureRemoveRequest(id, index).then(()=>{
	    		if(this.props.lectureRemoveStatus.status === 'SUCCESS'){
                    Materialize.toast('강의가 삭제 되었습니다!', 2000);
	    		}
	    		else{
                    return throwError(false, '강의', this.props.lectureRemoveStatus.error, '');
	    		}
	    	})
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
	        let clicked = [...this.state.clicked];
	        let origIndex = this.state.searchResult[index].index;


	        if(push){
	            clicked.push(origIndex);
	        }
	        else{
	            origIndex = clicked.indexOf(origIndex);
	            clicked.splice(origIndex, 1);
	        }
	        // console.log(clicked, filteredClick)
	        this.setState({clicked: clicked, filteredClick: filteredClick, remove_active: (filteredClick == 0 || clicked == 0)? false : true})
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
	        this.props.lectureData.map((lec, i) =>{
	            let push=false;
	            let obj = lec;
	            obj.index = i;

	            if(obj.name.includes(value)) push = true;
	            if(this.searchClassNameById(obj.class).includes(value)) push = true;
	            if(push) data.push(obj);

	        })
	        if(value == ''){
	            this.setState({searchOpen: true, searchStart: false, searchResult: [], filteredClick: [], searchText: ''});
	        }
	        else{
	            if(this.state.clicked != []){
	                for(let i = 0; i < this.state.clicked.length; i++){
	                    let filteredIndex = data.indexOf(this.props.lectureData[this.state.clicked[i]]);
	                    if(filteredIndex != -1){
	                        filteredClick.push(filteredIndex);
	                    }
	                }
	            }
	            this.setState({searchOpen: true, searchStart: true, searchResult: data, filteredClick: filteredClick, searchText: value});
	        }
	    }
	}
	Container.propTypes = {
	    lectureData: React.PropTypes.array,
	}
	Container.defaultProps = {
	    lectureData: [],
	}
	return connect(mapStateToProps, mapDispatchToProps)(Container);
	// return Container;
}
const mapDispatchToProps = (dispatch) => {
    return {
        lecturePostRequest: (contents) => {
            return dispatch(lecturePostRequest(contents));
        },
        lectureEditRequest: (index, contents) => {
            return dispatch(lectureEditRequest(index, contents));
        },
        lectureRemoveRequest: (id, index) => {
            return dispatch(lectureRemoveRequest(id, index));
        },
    }
}

const mapStateToProps = (state) => {
    return {
    	lecturePostStatus: state.lecture.post,
    	lectureEditStatus: state.lecture.edit,
    	lectureRemoveStatus: state.lecture.remove,

		lectureData: state.lecture.board.data,
        studentsData: state.studentinfo.getStudents.data,
        classData: state.makeclass.board.data,

    }
}
export default container;