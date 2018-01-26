import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableHighlight
} from 'react-native';
import Icon from '../../node_modules/react-native-vector-icons/dist/FontAwesome';
import { connect } from 'react-redux';
import { lectureEditRequest } from '../../actions/lecture';

import Toast from 'react-native-simple-toast';
import YouTube from 'react-native-youtube';

class Lecture extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            videoPlayer: null,
            // currObj: {
            //     _id: '',
            //     name: '',
            //     link: '',
            //     class: '',
            //     accomplishments: [],
            // },
        }
        this.updateVideo = this.updateVideo.bind(this);
        this.getLoginData = this.getLoginData.bind(this);
        // this.handleEdit = this.handleEdit.bind(this);
    }
    async getLoginData(){
        AsyncStorage.getItem('loginData').then((token) =>{
            // Toast.show(token);
            let loginData = JSON.parse(token);
            return loginData;
        }).catch((error) =>{
            Toast.show(''+error);
        })
        .done();
    }
    getVideoId(link){
        let id = link.split('/');
        id = id[id.length - 1];
        return id;
    }

    updateVideo(){
        // let time = -1;
        // this.props.data.accomplishments.map((acc, i) =>{
        //     if(acc._id == this.getLoginData().id)
        //         time = acc.accomplishments;
        // })
        // if(time > 0)
        // this.youTubePlayer.seekTo(100);
        // this.setState({videoPlayer: event.target, zindex: 1500});
        this.refs.youtubePlayer.duration().then((dur)=>{
            Toast.show(""+dur);
        }).done();
        
    }
    // handleEdit(silent, index, contents){
    //     return this.props.lectureEditRequest(index, contents).then(()=>{
    //         if(this.props.lectureEditStatus.status === 'SUCCESS'){
    //             // if(!silent) { Materialize.toast('강의가 수정 되었습니다!', 2000); }
    //         }
    //         else{
    //             // return throwError(silent, '강의', this.props.lectureEditStatus.error, '');
    //         }               
    //     })
    //     .done();
    // }
    render(){
        const lecture = this.props.data;
        Toast.show(''+lecture.name);
    	return(
    		<View>
    			<Text style={{alignSelf: 'center', fontSize: 22, fontWeight: 'bold', margin: 10}}>{lecture.name}</Text>
                <YouTube 
                    ref="youtubePlayer"
                    style={{alignSelf: 'center', height: 200, width: 350}} 
                    apiKey="AIzaSyApkQQpOcjzlxtH3uK7sZilS8RUemt-IJY" videoId={this.getVideoId(lecture.link)} play={true} fullscreen={false} loop={false} 
                    onReady={e => this.updateVideo()}/>
    		</View>
    	)
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.lecture.pass.data,
        lectureEditStatus: state.lecture.edit,
    };
};

export default connect(mapStateToProps, null)(Lecture);