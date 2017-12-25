import React from "react";
import { connect } from 'react-redux';
import { lecturePostRequest, } from 'actions/lecture';

var container = (Present) =>{
	class Container extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                dialogOpen: false,
                dialogEditMode: true,
                clicked: [],
                classData: [],
                currObj: {
                	_id: '',
                	name: '',
                	link: '',
                	class: '',
                	accomplishments: [],
                }
            };

            this.toggleDialog = this.toggleDialog.bind(this);
            this.openDialog = this.openDialog.bind(this);
            this.closeDialog = this.closeDialog.bind(this);
            this.toggleEditMode = this.toggleEditMode.bind(this);
            this.openEditMode = this.openEditMode.bind(this);
            this.closeEditMode = this.closeEditMode.bind(this);

            this.onClassChange = this.onClassChange.bind(this);
            this.handleDialogDataChange = this.handleDialogDataChange.bind(this);
            this.handlePost = this.handlePost.bind(this);
        }
	    render() {
	        let presentState = ['dialogOpen', 'dialogEditMode', 'clicked', 'currObj'];
	        let presentProps = [];
	        let customProps = {
	        	classData: this.state.classData
	        };
	        let presentFunctions = {
	        	openDialog: this.openDialog, 
	        	closeDialog: this.closeDialog,
	        	openEditMode: this.openEditMode, 
	        	closeEditMode: this.closeEditMode,
	        	onClassChange: this.onClassChange,
	        	handleDialogDataChange: this.handleDialogDataChange,
	        	handlePost: this.handlePost,
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
	    openDialog(){
	    	this.toggleDialog(true);
	    }
	    closeDialog(){
	    	this.toggleDialog(false);
	    	console.log(this.state.currObj)
	    }
	    toggleDialog(openState){
	    	this.setState({dialogOpen: openState});
	    }
	    openEditMode(){
	    	this.toggleEditMode(true);
	    }
	    closeEditMode(){
	    	this.toggleEditMode(false);
	    }
	    toggleEditMode(editState){
	    	this.setState({dialogEditMode: editState})
	    }
	    filterAutocompleteData(){
	    	let acData = this.props.classData.map(obj => {return {text: obj.name, value: obj._id}; });
	    	this.setState({classData: acData});
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
	        console.log(nextState.currObj)
	        this.setState(nextState);
	    }

	    handlePost(contents){
	    	return this.props.lecturePostRequest(contents).then(() =>{
	    		console.log('lecture status: ' + this.props.lecturePostStatus.status);
	    		this.closeEditMode();
	    	});
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
    }
}

const mapStateToProps = (state) => {
	console.log(state);
    return {
    	lecturePostStatus: state.lecture.post,

    }
}
export default container;