import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import TextField from 'material-ui/TextField';

class BoardHeader extends React.Component{
	constructor(props){
		super(props);
        this.focusSearchInput = this.focusSearchInput.bind(this);
    }
    focusSearchInput(){
        this.refs.searchEngine.focus();
    }
	render(){
		const remove_button = (
            <a onClick={this.props.remove_active? this.props.handleRemove : null}>
                <FontAwesome id="stdBoardRemove" className={'remove-button right ' + this.props.handleActive(false)} name="trash-o" />
            </a>
		)
		const plus_button = (
            <a onClick={this.props.remove_active ? null : this.props.openDialog}>
                <FontAwesome className={'plus-button right '+ this.props.handleActive(true)} name="plus" />
            </a>
		)
		const search_button = (
            <a onClick={this.focusSearchInput}>
                <FontAwesome  className={'search-button left '} name="search" />
            </a>
		)
		const search_engine = (
            <TextField name="searchEngine" ref="searchEngine"
            		onChange={this.props.onSearchEngineChange} onFocus={this.focusSearchInput} onBlur={this.props.blurSearchInput} 
            		style={styles.searchEngine}/>
		) 
		return(
	        <div className="Board-header col m12">
	            <div style={styles.boardTitle} className="col m4"><h4>{this.props.title}</h4></div>
	            <div style={styles.boardIcons}className="icons col m8">
	            	{this.props.remove_button ? remove_button : null}
	            	{this.props.plus_button ? plus_button : null}
	            	{this.props.search_engine ? search_button : null}
	            	{this.props.search_engine ? search_engine : null}
	            </div>
	        </div>
        )
	}
}

let styles = {
	boardTitle: {
		width: '180px'
	},
	boardIcons: {
		width: 'calc(100% - 180px)'
	},
	searchEngine: {
		height: '55px',
		margin: '10px 10px -20px -20px',
		padding: '0 10px'
	}
}

export default BoardHeader;