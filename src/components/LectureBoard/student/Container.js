import React from "react";
import { connect } from 'react-redux';

import throwError from 'components/commons/throwError';

var container = (Present) =>{
	class Container extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                classData: [],
                dialogOpen: false,
            };
            this.filterAutocompleteData = this.filterAutocompleteData.bind(this);
	        this.searchClassNameById = this.searchClassNameById.bind(this);

	        this.openDialog = this.openDialog.bind(this);
	        this.closeDialog = this.closeDialog.bind(this);

        }
        render(){
	        let presentState = ['dialogOpen'];
	        let presentProps = [];
	        let customProps = {
	        	classData: this.state.classData,
	        	lectureData: this.props.lectureData,
	        };
	        let presentFunctions = {
	        	searchClassNameById: this.searchClassNameById,
	        	openDialog: this.openDialog,
	        	closeDialog: this.closeDialog,
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

	    openDialog(){
	    	this.setState({dialogOpen: true});
	    }
	    closeDialog(){
	    	this.setState({dialogOpen: false});
	    }
    }
    return Container;
}
export default container;