import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';

class LectureDialog extends React.Component{
	render(){
        const actions = [
            <FlatButton
                label="취소"
                primary={true}
                onClick={this.props.handleClose}
            />,
            <FlatButton
                label={this.props.editMode? '저장' : '수정'}
                primary={true}
                onClick={this.props.editMode? this.props.closeEditMode : this.props.openEditMode}
            />,
        ];
        const editDiv = (
            <div>
                <TextField 
                    floatingLabelText="링크" fullWidth={true} 
                    name="link"
                    // onChange={this.props.handleChange} 
                    floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                    underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                />
                <AutoComplete
                    floatingLabelText={'수업'}
                    filter={AutoComplete.noFilter}
                    fullWidth={true}
                    dataSource={this.props.classData}
                    onNewRequest={this.props.onClassChange}
                    floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                    underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                /><br />
            </div>
        );
        // iframe 사라질때 inspector 뜨는 문제
        const videoDiv = (
                <div className="row">
                    <div className="col m7">
                        <iframe style={{minWidth: '400px', minHeight: '250px'}} src='https://www.youtube.com/embed/rRzxEiBLQCA' 
                        target="_top" frameBorder="0" allowFullScreen></iframe>
                    </div>
                    <div className="col m5" style={{textAlign: 'center'}}>
                        <h5 style={{fontWeight: '600'}}>학습률</h5>
                        <CircularProgress
                            mode="determinate"
                            value={80}
                            size={130}
                            thickness={15}
                        />
                        <h3 style={{color: '#00bcd4', fontWeight: '600'}}>80%</h3>
                    </div>
                </div>
        );

		return (
            <Dialog
                title={'강의제목'}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={this.props.editMode? false : true}>
                {this.props.editMode? editDiv : videoDiv}
            </Dialog>
		)
	}
}
let styles = {
	inputLine: {
		borderBottom: "1px solid #bdbdbd"
	},
	inputLineFocus:{
		borderBottom: "2px solid #00bcd4"
	},
	inputLabel: {
		color: "#bdbdbd",
		fontSize: "18px",
		fontWeight: "600"
	},
	inputLabelFocus: {
		color: "#00bcd4",
		fontSize: "18px",
		fontWeight: "600"
	},
}

export default LectureDialog;