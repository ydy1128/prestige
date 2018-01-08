import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import AutoComplete from 'material-ui/AutoComplete';
import {List, ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';

import YouTube from 'react-youtube';

class LectureDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoPlayer: null,
            zindex: -999,
        }
        this.updateVideo = this.updateVideo.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    updateVideo(event){
        let time = -1;
        // this.props.currObj.accomplishments.map((acc, i) =>{
        //     if(acc._id == this.getLoginData().id)
        //         time = acc.accomplishments;
        // })
        // event.target.playVideo();
        // if(time > 0)
        //     event.target.seekTo(time, true);
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
        // const div = (
        //                 <iframe style={{minWidth: '400px', minHeight: '250px'}} src={this.props.currObj.link}
        //                 target="_top" frameBorder="0" allowFullScreen></iframe>
        //             <div className="col m5" style={{textAlign: 'center'}}>
        //                 <h5 style={{fontWeight: '600'}}>학습률</h5>
        //                 <CircularProgress
        //                     mode="determinate"
        //                     value={80}
        //                     size={130}
        //                     thickness={15}
        //                 />
        //                 <h3 style={{color: '#00bcd4', fontWeight: '600'}}>80%</h3>
        //             </div>
        //     )
        // iframe 사라질때 inspector 뜨는 문제
        const generateList = data => {
            if(this.state.videoPlayer != null)
                return data.map((acc, i) => {
                    let fraction = acc.accomplishments / this.state.videoPlayer.getDuration() * 100;
                    console.log(acc.accomplishments, this.state.videoPlayer.getDuration(), fraction)
                    return(
                        <List>
                            <ListItem primaryText={acc._id} rightIcon={<LinearProgress mode="determinate" value={fraction} />} />
                        </List>
                    );
                });
        };
        const videoDiv = (
                <div className="row">
                    <div className="col m12">
                        <YouTube videoId={this.getVideoId(this.props.currObj.link)} 
                                onReady={this.updateVideo}
                            />
                        {generateList(this.props.currObj.accomplishments)}

                    </div>

                </div>
        );

		return (
            <Dialog
                title={this.props.editMode? '강의생성' : '('+this.props.searchClassNameById(this.props.currObj.class)+') '+this.props.currObj.name}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                style={{zIndex: this.state.zindex, textAlign: 'center'}}
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