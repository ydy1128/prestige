import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import TextField from 'material-ui/TextField';
import { classBoardRequest } from 'actions/makeclass';
import { getStudentsInfoRequest } from 'actions/studentinfo';
import { lectureBoardRequest } from 'actions/lecture';
import { getMemoListRequest } from 'actions/memolist';
import { homeworkBoardRequest } from 'actions/homework';

class BoardHeader extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			buttonCount: 0,
		}
        this.getButtonCount = this.getButtonCount.bind(this);
        this.focusSearchInput = this.focusSearchInput.bind(this);
        this.reloadAction = this.reloadAction.bind(this);
    }
    componentWillMount(){
    	this.getButtonCount()
    }
    focusSearchInput(){
        this.refs.searchEngine.focus();
        this.props.focusSearchInput();
    }
    getButtonCount(){
		let buttonCount = 0;
		if(this.props.homeworkButtons) buttonCount += 2;
    	if(this.props.remove_button) buttonCount++;
    	if(this.props.plus_button) buttonCount++;
    	if(this.props.search_engine) buttonCount++;
    	if(this.props.reload_button) buttonCount++;
    	console.log(buttonCount);
    	this.setState({buttonCount: buttonCount});
    }
    reloadAction(){
    	switch(this.props.screenType){
    		case 'DASHBOARD':
				this.props.getMemoListRequest().then(()=>{});
				break;
	    	case 'STUDENTBOARD':
	    		this.props.getStudentsInfoRequest().then(()=>{});
	    		break;
	    	case 'CLASSBOARD':
	    		this.props.classBoardRequest().then(()=>{});
	    		break;
	    	case 'LECTUREBOARD':
	        	this.props.lectureBoardRequest().then(()=>{});
	        	break;
	        case 'HWBOARD':
	        	this.props.homeworkBoardRequest().then(()=>{});
	        	break;
    	}
    }
	render(){
		const remove_button = this.props.remove_button ? (
            <a onClick={this.props.remove_active? this.props.handleRemove : null} style={{float: 'right'}}>
                <FontAwesome id="stdBoardRemove" className={'remove-button ' + this.props.handleActive(false)} name="trash-o" />
            </a>
		) : null;
		const plus_button = this.props.plus_button ? (
            <a onClick={this.props.remove_active ? null : this.props.openDialog} style={{float: 'right'}}>
                <FontAwesome className={'plus-button '+ this.props.handleActive(true)} name="plus" />
            </a>
		) : null;
		const search_button = (
            <a onClick={this.focusSearchInput} 
            	style={{float: 'right', marginRight: this.props.searchOpen? '270px': 0}} >
                <FontAwesome  className={'search-button'} name="search" />
            </a>
		)
		const back_button = (
	        <a onClick={this.props.backAction}>
	            <FontAwesome id="stdBoardRemove" className={'remove-button right '} name="arrow-left" />
	        </a>
		)
		const reloadButton = (
			<a onClick={this.reloadAction} className={'right'}>
				<FontAwesome className={'search-button'} name="undo" style={{transform: " scaleX(-1)"}} />
			</a>
		)
		const search_engine = (
            <TextField name="searchEngine" ref="searchEngine"
            		onChange={this.props.onSearchEngineChange} onFocus={this.focusSearchInput} onBlur={this.props.blurSearchInput} 
            		style={{
						position: 'absolute',
						right: this.state.buttonCount * 50,
						height: '55px',
						width: this.props.searchOpen ? '250px' : 0,
						zIndex: this.props.searchOpen ? 0 : -10,
						margin: '10px 10px -20px -20px',
						padding: '0 10px'
					}}/>
		) 

		return(
	        <div className="Board-header col m12" style={styles.boardHeader}>
	            <div style={styles.boardTitle} className="col m4">
	            	<h4 style={styles.boardTitleText}>{this.props.title}</h4>
	            </div>
	            <div style={styles.boardIcons}className="icons col m8">
	            	{this.props.reload_button ? reloadButton : null}
	            	{this.props.remove_button ? remove_button : null}
	            	{this.props.back_button ? back_button: null}
	            	{this.props.plus_button ? plus_button : null}
					{this.props.homeworkButtons}
	            	{this.props.search_engine ? search_button : null}
	            	{this.props.search_engine ? search_engine : null}

	            </div>
	        </div>
        )
	}
}
BoardHeader.defaultProps = {
    reload_button: false,
    remove_button: false,
    plus_button: false,
    search_engine: false,
    back_button: false,
    searchOpen: false,
	remove_active: false,
	handleRemove: false,
	homeworkButtons: null,
	openDialog: null,
    buttonCount: 0,

    openDialog: () => {console.log('openDialog action not defined.')},
    handleRemove: () => {console.log('remove action not defined.')},
    backAction: () => {console.log('back action not defined.')},
    onSearchEngineChange: () => {console.log('searchEngine change not defiend.')},
    focusSearchInput: () => {console.log('searchInput functions not defined.')},
	blurSearchInput: () => {console.log('searchInput functions not defined.')},
}
let styles = {
	boardHeader: {
		backgroundColor: 'white',
		borderBottom: '2px solid #d3d3d3',
		color: '#939393'
	},
	boardTitle: {
		width: '200px',
		textAlign: 'center'
	},
	boardTitleText: {
		margin: '20px 0'
	},
	boardIcons: {
		width: 'calc(100% - 200px)'
	},
	searchEngine: {
		position: 'absolute',
		right: 0,
		height: '55px',
		margin: '10px 10px -20px -20px',
		padding: '0 10px'
	}
}


const mapStateToProps = (state) => {
    return {
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        getMemoListRequest: () => {
            return dispatch(getMemoListRequest());
        },
        getStudentsInfoRequest: (classname) => {
            return dispatch(getStudentsInfoRequest(classname));
        },
        classBoardRequest: (isInitial, listType, id, username) => {
            return dispatch(classBoardRequest(isInitial, listType, id, username));
        },
        lectureBoardRequest: () => {
            return dispatch(lectureBoardRequest());
        },
        homeworkBoardRequest: (id) => {
            return dispatch(homeworkBoardRequest(id));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(BoardHeader);