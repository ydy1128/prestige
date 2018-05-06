import React from "react";
import { connect } from 'react-redux';
import { lectureEditRequest } from 'actions/lecture';
import throwError from 'components/commons/throwError';
import { getLoginData } from 'components/commons/SessionData';

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
                searchOpen: false,
                searchStart: false,
				searchText: '',
				searchResult: [],
            };
            this.filterAutocompleteData = this.filterAutocompleteData.bind(this);
	        this.searchClassNameById = this.searchClassNameById.bind(this);

	        this.openDialog = this.openDialog.bind(this);
	        this.closeDialog = this.closeDialog.bind(this);
	        this.onAccChange = this.onAccChange.bind(this);
	        this.handleEdit = this.handleEdit.bind(this);
            this.focusSearchInput = this.focusSearchInput.bind(this);
            this.blurSearchInput = this.blurSearchInput.bind(this);
            this.onSearchEngineChange = this.onSearchEngineChange.bind(this);
        }
        render(){
	        let presentState = ['dialogOpen', 'currObj', 'searchStart', 'searchOpen', 'searchText', 'searchResult'];
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
	        	handleRemove: this.handleRemove,
	        	focusSearchInput: this.focusSearchInput,
	        	blurSearchInput: this.blurSearchInput,
	        	onSearchEngineChange: this.onSearchEngineChange,
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

	    openDialog(rowNumber){
	    	let nextState = {
	    		currObj: this.props.lectureData[rowNumber],
	    		dialogOpen: true,
	    	}
	    	let acc = nextState.currObj.accomplishments;
	    	for(let i = 0; i < acc.length; i++){
	    		if(getLoginData().id == acc[i]._id){
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
	    	console.log(time)
	    	for(let i = 0; i < acc.length; i++){
	    		console.log(id, acc[i]._id)
	    		if(id == acc[i]._id){
	    			acc[i].accomplishments = time;
	    			let date = new Date();
	    			acc[i].endTime = date;
	    		}
	    	}
	    	console.log(nextState.currObj.accomplishments, acc)
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
	    focusSearchInput(){
	        this.setState({searchOpen: true});
	    }
	    blurSearchInput(){
	    	this.setState({searchOpen: false})
	        if(this.state.searchText == '')
	            this.setState({searchStart: false, searchText: ''});
	    }
	    onSearchEngineChange(event, value){
	        let data = [];
	        this.props.lectureData.map((lec, i) =>{
	            let push=false;
	            let obj = lec;
	            obj.index = i;

	            if(obj.name.includes(value)) push = true;
	            if(this.searchClassNameById(obj.class).includes(value)) push = true;
	            if(push) data.push(obj);

	        })
	        if(value == ''){
	            this.setState({searchOpen: true, searchStart: false, searchResult: [], searchText: ''});
	        }
	        else{
	            this.setState({searchOpen: true, searchStart: true, searchResult: data, searchText: value});
	        }
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