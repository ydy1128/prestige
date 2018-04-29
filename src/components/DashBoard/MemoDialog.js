import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import TimePicker from 'material-ui/TimePicker';
import CustomDatePicker from 'components/commons/CustomDatePicker'

import ColorStock from 'components/commons/ColorStock';

class MemoDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            initialState: {},
            currentMode: -1,
        }

        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.getView = this.getView.bind(this);
        this.getTitle = this.getTitle.bind(this);
    }
    componentWillReceiveProps(nextProps){
        let dataName = '';
        let pass = false;
        switch(this.props.mode){
            case 0:
                dataName = 'currList';
                pass = nextProps[dataName]._id == undefined ? true : false;
                break;
            case 1:
                dataName = 'currGroup';
                pass = nextProps[dataName]._id == undefined ? true : false;
                break;
            case 2:
                dataName = 'currMemo';
                pass = nextProps[dataName]._id == undefined ? true : false;
                break;
        }
        if(!pass){
            if(!this.state.initialState.hasOwnProperty('_id') || this.props.mode != this.state.currentMode ){
                let obj = Object.assign({}, nextProps[dataName]);
                this.setState({initialState: obj, currentMode: this.props.mode});
            }
            else{
                console.log(this.state.initialState)
                for(let key in nextProps[dataName]){
                    if(nextProps[dataName][key] != this.state.initialState[key]){
                        console.log('key', key, 'diff: ', nextProps[dataName][key], this.state.initialState[key])
                    }
                }
            }
            console.log(nextProps[dataName])
        }
    }
    handleDataChange(event, newValue){
        let dataName = '';
        switch(this.props.mode){
            case 0:
                dataName = 'currList';
                break;
            case 1:
                dataName = 'currGroup';
                break;
            case 2:
                dataName = 'currMemo';
                break;
        }
    	this.props.handleDialogDataChange(event, newValue, dataName);
    }
    handleTimeChange(name, date){
        let event = {
            target: {
                name: name
            }
        }
        date = this.checkPastDueDate(date);

        date = this.convertToDateString(date);
        this.props.handleDialogDataChange(event, date, 'currMemo');
    }
    checkPastDueDate(date){
        if(date != '' && date.getDate() < (new Date()).getDate()){
            Materialize.toast('제출일이 현재 날짜보다 이르기 때문에,<br/>오늘로 자동 변경됩니다.', 2000);
            return new Date();
        }
        return date;
    }
    handlePost(){
        let dataName = '';
        let contents = {};
        switch(this.props.mode){
            case 0:
                dataName = 'currList';
                break;
            case 1:
                dataName = 'currGroup';
                break;
            case 2:
                dataName = 'currMemo';
                break;
        }
        contents = this.props[dataName];
        this.props.handlePost(contents);
    }
    handleEdit(){
        let dataName = '';
        let contents = {};
        switch(this.props.mode){
            case 0:
                dataName = 'currList';
                break;
            case 1:
                dataName = 'currGroup';
                break;
            case 2:
                dataName = 'currMemo';
                break;
        }
        contents = this.props[dataName];
        this.props.handleEdit(contents);
    }
    getTitle(){
        switch (this.props.mode){
            case 0:
                return '보드생성';
            case 1:
                return '그룹생성';
            case 2:
                return '카드생성';
        }
    }
    convertToDateString(date){
        if(date == ''){
            return '';
        }
        else{
            let year = date.getFullYear().toString();
            let month = (date.getMonth() + 1).toString();
            month = month.length == 1 ? '0' + month : month;
            let datenum = date.getDate().toString();
            datenum = datenum.length == 1 ? '0' + datenum : datenum;
            console.log(year, '-', month, '-', datenum);
            return year + '-' + month + '-' + datenum;
        }
        
    }
    getView(){
        switch (this.props.mode){
            case 0:
                return(
                    <TextField floatingLabelText="이름" fullWidth={true} 
                                name="name" value={this.props.currList.name} 
                                onChange={this.handleDataChange}
                                floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                                underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                                />
                )
            case 1:
                return(
                    <TextField floatingLabelText="이름" fullWidth={true} 
                                name="name" value={this.props.currGroup.name} 
                                onChange={this.handleDataChange}
                                floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                                underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                                />
                )
            case 2:
                return(
                    <div>
                        <TextField floatingLabelText="내용" fullWidth={true} 
                                    name="text" value={this.props.currMemo.text} 
                                    onChange={this.handleDataChange}
                                    floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                                    underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                                    />
                        <label style={styles.inputLabelFocusSmall}>라벨</label>
                        <RadioButtonGroup name="label" defaultSelected="-1" valueSelected={this.props.currMemo.label} onChange={this.handleDataChange} style={styles.rbGroup}>
                            <RadioButton value="-1" style={styles.rbStyle} iconStyle={styles.rbIcon}
                                        checkedIcon={<FontAwesome name="times" style={{color: '#939393', backgroundColor: '#d3d3d3', margin: 5, padding: '5px 10px'}} /> }
                                        uncheckedIcon={<FontAwesome name="times" style={{color: '#939393', margin: 5, padding: '5px 10px'}} />}
                                        />
                            <RadioButton value="0" style={styles.rbStyle} iconStyle={styles.rbIcon}
                                        checkedIcon={<FontAwesome name="stop" style={{color: ColorStock[0], backgroundColor: '#d3d3d3', margin: 5, padding: '5px 10px'}} /> }
                                        uncheckedIcon={<FontAwesome name="stop" style={{color: ColorStock[0], margin: 5, padding: '5px 10px'}} />}
                                        />
                            <RadioButton value="1" style={styles.rbStyle} iconStyle={styles.rbIcon}
                                        checkedIcon={<FontAwesome name="stop" style={{color: ColorStock[1], backgroundColor: '#d3d3d3', margin: 5, padding: '5px 10px'}} /> }
                                        uncheckedIcon={<FontAwesome name="stop" style={{color: ColorStock[1], margin: 5, padding: '5px 10px'}} />}
                                        />
                            <RadioButton value="2" style={styles.rbStyle} iconStyle={styles.rbIcon}
                                        checkedIcon={<FontAwesome name="stop" style={{color: ColorStock[2], backgroundColor: '#d3d3d3', margin: 5, padding: '5px 10px'}} /> }
                                        uncheckedIcon={<FontAwesome name="stop" style={{color: ColorStock[2], margin: 5, padding: '5px 10px'}} />}
                                        />
                            <RadioButton value="3" style={styles.rbStyle} iconStyle={styles.rbIcon}
                                        checkedIcon={<FontAwesome name="stop" style={{color: ColorStock[3], backgroundColor: '#d3d3d3', margin: 5, padding: '5px 10px'}} /> }
                                        uncheckedIcon={<FontAwesome name="stop" style={{color: ColorStock[3], margin: 5, padding: '5px 10px'}} />}
                                        />
                            <RadioButton value="4" style={styles.rbStyle} iconStyle={styles.rbIcon}
                                        checkedIcon={<FontAwesome name="stop" style={{color: ColorStock[4], backgroundColor: '#d3d3d3', margin: 5, padding: '5px 10px'}} /> }
                                        uncheckedIcon={<FontAwesome name="stop" style={{color: ColorStock[4], margin: 5, padding: '5px 10px'}} />}
                                        />
                        </RadioButtonGroup>
                        <CustomDatePicker name="dueDate" label={"제출일"} labelStyle={styles.inputLabelFocusSmall} checkBox={true} onDataChange={this.handleTimeChange} value={this.props.currMemo.dueDate}/>

                    </div>
                )
        }
    }
    render(){
        const actions = [
            <FlatButton
                label="취소"
                primary={true}
                onClick={this.props.handleClose}
            />,
            <FlatButton
                label="저장"
                primary={true}
                onClick={this.props.editMode ? this.handleEdit : this.handlePost}
            />,
        ];
		return(
            <Dialog
                title={this.getTitle()}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={false}
            >
                { this.getView() }
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
	inputLabelSmall: {
		color: "#bdbdbd",
		fontWeight: "600"
	},
	inputLabelFocus: {
		color: "#00bcd4",
		fontSize: "18px",
		fontWeight: "600"
	},
    inputLabelFocusSmall: {
        color: "#00bcd4",
        fontSize: "14px",
        fontWeight: "600",
    },
    rbGroup: {
        marginBottom: 15,
    },
    rbStyle: {
        display: 'inline-block', 
        width: 55, 
        height: 55
    },
    rbIcon: {
        width: 50, 
        height: 45, 
        fontSize: 35, 
    },
    rbFA: {

    }
}

export default MemoDialog;