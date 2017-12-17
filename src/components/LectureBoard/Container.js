import React from "react";
import { connect } from 'react-redux';

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
                	date: ''
                }
            };

            this.toggleDialog = this.toggleDialog.bind(this);
            this.openDialog = this.openDialog.bind(this);
            this.closeDialog = this.closeDialog.bind(this);
            this.toggleEditMode = this.toggleEditMode.bind(this);
            this.openEditMode = this.openEditMode.bind(this);
            this.closeEditMode = this.closeEditMode.bind(this);

            this.onClassChange = this.onClassChange.bind(this);
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
	    	this.setState({
	    		currObj:{
	            	_id: this.state.currObj._id,
	            	name: this.state.currObj.name,
	            	link: this.state.currObj.link,
	            	class: chosenRequest.text,
	            	accomplishments: this.state.currObj.accomplishments,
	            	date: this.state.currObj.date
	            }
	    	});
	    }
	}
	Container.propTypes = {
	    lectureData: React.PropTypes.array,
	}
	Container.defaultProps = {
	    lectureData: [],
	}
	// return connect(mapStateToProps, mapDispatchToProps)(Container);
	return Container;
}

export default container;