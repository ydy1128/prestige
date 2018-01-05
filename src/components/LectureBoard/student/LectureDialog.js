import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class LectureDialog extends React.Component{
    constructor(props){
        super(props);

    }
	render(){
        const actions = [
            <FlatButton
                label='닫기'
                primary={true}
                onClick={this.props.handleClose}
            />
        ];

		return (
            <Dialog
                title={this.props.currObj.name}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                // autoScrollBodyContent={this.props.editMode? false : true}>
                >
                <iframe style={{minWidth: '400px', minHeight: '250px'}} src={this.props.currObj.link}
	                target="_top" frameBorder="0" allowFullScreen></iframe>
            </Dialog>
		)
	}
}

export default LectureDialog;