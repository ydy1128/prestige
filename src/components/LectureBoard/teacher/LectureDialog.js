import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import {List, ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import YouTube from 'react-youtube';

class LectureDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoPlayer: null,
        }
        this.updateVideo = this.updateVideo.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    updateVideo(event){
        let time = -1;
        this.setState({videoPlayer: event.target, zindex: 1500});
    }
    getVideoId(link){
        let id = link.split('/');
        id = id[id.length - 1];
        return id;
    }
    handlePost(){
        console.log(this.props.newOne)
        console.log('post')
        this.props.handlePost(this.props.currObj);
    }
    handleEdit(){
        console.log('edit')
        this.props.handleEdit(this.props.editlec, this.props.currObj);
    }
	render(){
        const actions = [
            <FlatButton
                label={this.props.editMode? '취소' : '닫기'}
                primary={true}
                onClick={this.props.editMode? (this.props.newOne? this.props.handleClose: this.props.closeEditMode) : this.props.handleClose}
            />,
            <FlatButton
                label={this.props.editMode? '저장' : '수정'}
                primary={true}
                onClick={this.props.editMode? (this.props.newOne? this.handlePost: this.handleEdit) : this.props.openEditMode}
            />,
        ];
        const editDiv = (
            <div>
                <TextField 
                    floatingLabelText="제목" fullWidth={true} 
                    name="name" value={this.props.currObj.name}
                    onChange={this.props.handleChange} 
                    floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                    underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                />
                <TextField 
                    floatingLabelText="링크" fullWidth={true} 
                    name="link" value={this.props.currObj.link}
                    onChange={this.props.handleChange} 
                    floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                    underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                />
                <AutoComplete
                    floatingLabelText={'수업'}
                    fullWidth={true}
                    dataSource={this.props.classData}
                    searchText={this.props.currObj.className}
                    onUpdateInput={this.props.onInputChange}
                    onNewRequest={this.props.onClassChange} openOnFocus={true}
                    floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                    underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                /><br />
            </div>
        );
        const generate = data =>{
            if(this.state.videoPlayer != null){
                return data.map((acc, i) => {
                    return(
                        <div key={'lec-'+acc._id} className="row" style={styles.accList.container}>
                            <div>
                                <div className="col m3">{this.props.searchStudentNameById(acc._id)}</div>
                                <div className="col m6">
                                    {acc.startTime == '' ?
                                     '-' :
                                     (<div className="studyTime" style={styles.accList.studyTime}>
                                        <DatePicker id={'dp'+acc._id} value={new Date(acc.startTime)} style={styles.accList.datePicker} textFieldStyle={styles.accList.dateInput} disabled={true} />
                                     <TimePicker id={'tp1'+acc._id} value={new Date(acc.startTime)} style={styles.accList.timePicker1} textFieldStyle={styles.accList.timeInput} disabled={true} />
                                     ~
                                     <TimePicker id={'tp2'+acc._id} value={new Date(acc.endTime)} style={styles.accList.timePicker2} textFieldStyle={styles.accList.timeInput} disabled={true} /> </div>)
                                    }
                                </div>
                                <div className="col m3">{acc.accomplishments + '%'}</div>
                            </div>
                            <div><LinearProgress mode="determinate" value={acc.accomplishments} /></div>
                        </div>
                    );
                });
            }

        }
        const videoDiv = (
                <div className="row">
                    <div className="col m12">
                        <YouTube videoId={this.getVideoId(this.props.currObj.link)} 
                                onReady={this.updateVideo}
                            />
                            <div className="row">
                                <h5 className="col m3">이름</h5>
                                <h5 className="col m6">학습시간</h5>
                                <h5 className="col m3">학습률</h5>
                            </div>
                        {generate(this.props.currObj.accomplishments)}

                    </div>

                </div>
        );

		return (
            <Dialog
                title={this.props.editMode? '강의생성' : '강의수정('+this.props.searchClassNameById(this.props.currObj.class)+') '+this.props.currObj.name}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                style={{textAlign: 'center'}}
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
    accList: {
        container: {padding: '18px'},
        studyTime: {color: 'rgba(0,0,0,0.3)'},
        timePicker1: {
            display: 'inline-block', 
            marginRight: '5px'
        },
        timePicker2: {
            display: 'inline-block', 
            marginLeft: '5px'
        },
        dateInput: {
            cursor: 'default', 
            width: '80px', 
            height: '20px', 
            fontSize: '14px'
        },
        datePicker: {
            display: 'inline-block'
        },
        timeInput: {
            cursor: 'default', 
            width: '50px', 
            height: '20px', 
            fontSize: '14px'
        }
    }

}

export default LectureDialog;