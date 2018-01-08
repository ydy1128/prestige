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
                dialogEditMode: true,
                newOne: true,
                clicked: [],
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
            };
            this.filterAutocompleteData = this.filterAutocompleteData.bind(this);

            this.toggleDialog = this.toggleDialog.bind(this);
            this.openDialog = this.openDialog.bind(this);
            this.closeDialog = this.closeDialog.bind(this);
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

        }
	    render() {
	        let presentState = ['dialogOpen', 'dialogEditMode', 'clicked', 'currObj', 'newOne', 'editlec', 'remove_active'];
	        let presentProps = [];
	        let customProps = {
	        	classData: this.state.classData,
	        	lectureData: this.props.lectureData,
	        };
	        let presentFunctions = {
	        	openDialog: this.openDialog, 
	        	closeDialog: this.closeDialog,
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

	    	for(let i = 0; i < cls.students.length; i++){
	    		nextState.currObj.accomplishments.push({_id: cls.students[i], accomplishments: 0});
	    	}
	    	console.log(nextState.currObj.accomplishments)
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
    }
}
export default container;