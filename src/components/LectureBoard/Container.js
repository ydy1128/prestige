import React from "react";
import { connect } from 'react-redux';
import { lecturePostRequest, lectureEditRequest, lectureRemoveRequest } from 'actions/lecture';

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
                	accomplishments: [],
                },
                remove_active: false,
            };

            this.toggleDialog = this.toggleDialog.bind(this);
            this.openDialog = this.openDialog.bind(this);
            this.closeDialog = this.closeDialog.bind(this);
            this.toggleEditMode = this.toggleEditMode.bind(this);
            this.openEditMode = this.openEditMode.bind(this);
            this.closeEditMode = this.closeEditMode.bind(this);
            this.setNew = this.setNew.bind(this);

	        this.searchClassNameById = this.searchClassNameById.bind(this);
            this.onClassChange = this.onClassChange.bind(this);
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
	        	onClassChange: this.onClassChange,
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
	    		this.setState({currObj: this.props.lectureData[index], editlec: index});
	    		this.closeEditMode();
	    	}
	    }
	    closeDialog(){
	    	this.setState({currObj:{ _id: '',name: '',link: '',class: '',accomplishments: []}, editlec: -1, clicked: [], remove_active: false})
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
	    	this.setState({classData: acData});
	    }
	    searchClassNameById(id){
	        let classData = this.state.classData;
	        for(let i = 0; i < classData.length; i++){
	            if(classData[i].value == id){
	                return classData[i].text;
	            }
	        }
	    }
	    onClassChange(chosenRequest, index){
	    	console.log(chosenRequest)
	    	let nextState = {
	    		currObj: this.state.currObj
	    	};
	    	nextState.currObj.class = chosenRequest.value;
	    	this.setState(nextState);
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
	    		console.log('lecture status: ' + this.props.lecturePostStatus.status);
	    		this.closeEditMode();
	    	});
	    }
	    handleEdit(index, contents){
	    	return this.props.lectureEditRequest(index, contents).then(()=>{
	    		console.log('lecture edit status: ' + this.props.lectureEditStatus.status);
	    		this.closeEditMode();
	    	})
	    }
	    handleRemove(id, index){
	    	return this.props.lectureRemoveRequest(id, index).then(()=>{
	    		console.log('lecture remove status: ' + this.props.lectureRemoveStatus.status);
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