import React from "react";
import { connect } from 'react-redux';
import { lectureEditRequest } from 'actions/lecture';
import throwError from 'components/commons/throwError';

var container = (Present) =>{
	class Container extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                classData: [],
                dialogOpen: false,
                currObj: {
                	_id: '',
                	name: '',
                	link: '',
                	class: '',
                	accomplishments: [],
                },
            };
            this.filterAutocompleteData = this.filterAutocompleteData.bind(this);
	        this.searchClassNameById = this.searchClassNameById.bind(this);

	        this.openDialog = this.openDialog.bind(this);
	        this.closeDialog = this.closeDialog.bind(this);
	        this.onAccChange = this.onAccChange.bind(this);
	        this.handleEdit = this.handleEdit.bind(this);

        }
        render(){
	        let presentState = ['dialogOpen', 'currObj'];
	        let presentProps = [];
	        let customProps = {
	        	classData: this.state.classData,
	        	lectureData: this.props.lectureData,
	        };
	        let presentFunctions = {
	        	searchClassNameById: this.searchClassNameById,
	        	openDialog: this.openDialog,
	        	closeDialog: this.closeDialog,
	        	handleEdit: this.handleEdit,
	        	onAccChange: this.onAccChange,
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
	    getCookie(name) {
	        var value = "; " + document.cookie;
	        var parts = value.split("; " + name + "=");
	        if (parts.length == 2) return parts.pop().split(";").shift();
	    }
	    getLoginData(){
	        let loginData = this.getCookie('key');
	        if(loginData == undefined)
	            loginData = {};
	        else
	            loginData = JSON.parse(atob(loginData));
	        return loginData;
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

	    openDialog(rowNumber){
	    	let nextState = {
	    		currObj: this.props.lectureData[rowNumber],
	    		dialogOpen: true,
	    	}
	    	let acc = nextState.currObj.accomplishments;
	    	for(let i = 0; i < acc.length; i++){
	    		if(this.getLoginData().id == acc[i]._id){
	    			let date = new Date();
	    			acc[i].startTime = date;
	    		}
	    	}
	    	this.setState(nextState);
	    }
	    closeDialog(){
	    	this.setState({dialogOpen: false, currObj: {_id: '',name: '',link: '',class: '',accomplishments: []}});
	    }
	    onAccChange(id, time){
	    	let nextState = {
	    		currObj: this.state.currObj
	    	}
	    	let acc = nextState.currObj.accomplishments;
	    	for(let i = 0; i < acc.length; i++){
	    		if(id == acc[i]._id){
	    			acc[i].accomplishments = time;
	    			let date = new Date();
	    			acc[i].endTime = date;
	    		}
	    	}
	    	this.setState(nextState);
	    }
	    handleEdit(silent, index, contents){
	    	return this.props.lectureEditRequest(index, contents).then(()=>{
	    		console.log(index);
	    		if(this.props.lectureEditStatus.status === 'SUCCESS'){
                    if(!silent) { Materialize.toast('강의가 수정 되었습니다!', 2000); }
	    		}
	    		else{
                    return throwError(silent, '강의', this.props.lectureEditStatus.error, '');
	    		}	    		
	    	})
	    }
    }
	return connect(mapStateToProps, mapDispatchToProps)(Container);
}

const mapDispatchToProps = (dispatch) => {
    return {
        lectureEditRequest: (index, contents) => {
            return dispatch(lectureEditRequest(index, contents));
        },
    }
}

const mapStateToProps = (state) => {
    return {
    	lectureEditStatus: state.lecture.edit,
    }
}
export default container;