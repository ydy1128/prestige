import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class StudentDialog extends React.Component{
	render(){
        const actions = [
            <FlatButton
                label="취소"
                primary={true}
                onClick={this.props.handleClose}
            />,
            <FlatButton
                label={this.props.modal_state? '저장' : '변경'}
                primary={true}
                onClick={this.props.modal_state? this.props.handleEdit : this.props.handlePwChange}
            />,
        ];
        const infoDialog = (
            <div>
                <TextField floatingLabelText="아이디" fullWidth={true} 
                			name="username" value={this.props.editstd.username} 
                			onChange={this.props.handleChange} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
                <TextField floatingLabelText="이름" fullWidth={true} 
                			name="name" value={this.props.editstd.name} 
                			onChange={this.props.handleChange} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
                <TextField floatingLabelText="학교" fullWidth={true} 
                			name="school" value={this.props.editstd.school} 
                			onChange={this.props.handleChange} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
                <TextField floatingLabelText="학년" fullWidth={true} 
                			name="level" value={this.props.editstd.level} 
                			onChange={this.props.handleChange} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
            </div>
        )
        const passDialog = (
            <div>
                <TextField disabled
                			floatingLabelText="아이디" fullWidth={true} 
                			name="username" value={this.props.editstd.username} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
                <TextField disabled
                			floatingLabelText="이름" fullWidth={true} 
                			name="name" value={this.props.editstd.name} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
                <TextField floatingLabelText="새 패스워드" fullWidth={true} 
                			name="password" type="password" value={this.props.editstd.password} 
                			onChange={this.props.handleChange} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
                <TextField floatingLabelText="패스워드 확인" fullWidth={true} 
                			name="check_password" type="password" value={this.props.editstd.check_password} 
                			onChange={this.props.handleChange} 
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
            </div>
        )
		return (
            <Dialog
                title={this.props.modal_state? '학생 정보' : '학생 비밀번호 변경'}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={false}>
                {this.props.modal_state? infoDialog : passDialog}
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

export default StudentDialog;