import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import TextField from 'material-ui/TextField';

class BoardHeader extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			buttonCount: 0,
		}
        this.getButtonCount = this.getButtonCount.bind(this);
        this.focusSearchInput = this.focusSearchInput.bind(this);
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
    	if(this.props.remove_button) buttonCount++;
    	if(this.props.plus_button) buttonCount++;
    	if(this.props.search_engine) buttonCount++;
    	console.log(buttonCount);
    	this.setState({buttonCount: buttonCount});
    }
	render(){
		const remove_button = (
            <a onClick={this.props.remove_active? this.props.handleRemove : null} style={{float: 'right'}}>
                <FontAwesome id="stdBoardRemove" className={'remove-button ' + this.props.handleActive(false)} name="trash-o" />
            </a>
		)
		const plus_button = (
            <a onClick={this.props.remove_active ? null : this.props.openDialog} style={{float: 'right'}}>
                <FontAwesome className={'plus-button '+ this.props.handleActive(true)} name="plus" />
            </a>
		)
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
	            	{this.props.remove_button ? remove_button : null}
	            	{this.props.back_button ? back_button: null}
	            	{this.props.plus_button ? plus_button : null}
	            	{this.props.search_engine ? search_button : null}
	            	{this.props.search_engine ? search_engine : null}

	            </div>
	        </div>
        )
	}
}
BoardHeader.defaultProps = {
    remove_button: false,
    plus_button: false,
    search_engine: false,
    back_button: false,
    
    searchOpen: false,

    buttonCount: 0,

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

export default BoardHeader;