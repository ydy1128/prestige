import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import YouTube from 'react-youtube';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { getLoginData } from 'components/commons/SessionData';

class LectureDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoPlayer: null,
            zindex: -999,
        }
        this.updateVideo = this.updateVideo.bind(this);
        this.playVideo = this.playVideo.bind(this);
        this.onPause = this.onPause.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }
    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    getLoginData(){
        let loginData = this.getCookie('key');
        if(loginData == undefined)
            loginData = {};
        else
            loginData = JSON.parse(atob(loginData));
        return loginData;
    }
    closeModal(){
        this.timeChange();
        this.props.handleClose();
        this.setState({videoPlayer: null, zindex: -999});
    }
    updateVideo(event){
        let time = -1;
        console.log('update video called')
        this.props.currObj.accomplishments.map((acc, i) =>{
            if(acc._id == this.getLoginData().id)
                time = acc.accomplishments;
        })
        event.target.playVideo();
        console.log(time)
        if(time > 0){
            let fulltime = event.target.getDuration();
            event.target.seekTo((time / 100) * fulltime, true);
        }
        this.setState({videoPlayer: event.target, zindex: 1500});
    }
    getVideoId(link){
        let id = link.split('/');
        id = id[id.length - 1];
        return id;
    }
    playVideo(){
        this.state.videoPlayer.playVideo();
    }
    onPause(){
        this.timeChange();
    }
    timeChange(){
        let time = this.state.videoPlayer.getCurrentTime();
        let fulltime = this.state.videoPlayer.getDuration();
        time = time / fulltime * 100;
        time = time.toFixed(2);
        console.log(time)
        let index = -1;
        console.log(getLoginData())
        this.props.onAccChange(this.getLoginData().id, time);

        this.props.lectureData.map((lec, i) =>{
            if(lec._id == this.props.currObj._id)
                index = i;
        })
        console.log(index, this.props.currObj)
        this.props.handleEdit(true, index, this.props.currObj);
    }
    youTubeError(){
        console.err('youtube loading error');
    }
	render(){
        const actions = [
            <FlatButton
                label='닫기'
                primary={true}
                onClick={this.closeModal}
            />
        ];
        console.log(this.getVideoId(this.props.currObj.link))
		return (
            <Dialog
                title={this.props.currObj.name}
                modal={false}
                actions={actions}
                open={this.props.open}
                repositionOnUpdate={true}
                style={{zIndex: this.state.zindex, textAlign: 'center'}}
                >
                <YouTube videoId={this.getVideoId(this.props.currObj.link)} 
                        onReady={this.updateVideo}
                        onPause={this.onPause}
                        onError={this.youTubeError}
                        />
            </Dialog>
		)
	}
}

export default LectureDialog;