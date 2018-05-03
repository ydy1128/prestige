import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableHighlight,
    AsyncStorage
} from 'react-native';
import Icon from '../../node_modules/react-native-vector-icons/dist/FontAwesome';
import { connect } from 'react-redux';
import { lectureEditRequest } from '../../actions/lecture';

import Toast from 'react-native-simple-toast';
import YouTube from 'react-native-youtube';

import navOptions from './navigator';

class Lecture extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            videoPlayer: null,
            playerHeight: 300,
            currObj: {
                _id: '',
                name: '',
                link: '',
                class: '',
                accomplishments: [],
            },
            interval: -1,
            fulltime: 0,
            currenttime: 0,
        }
        this.updateVideo = this.updateVideo.bind(this);
        this.getLoginData = this.getLoginData.bind(this);
        this.timeChange = this.timeChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    static navigationOptions  = ({ navigation }) => {
        return options = {
            headerTitle: navigation.state.params.title,
            headerStyle: {
                backgroundColor: '#86272d',

            },
            headerTextStyle:{
                textAlign: 'center',
            },
            headerTitleStyle: {
                color: 'white',
                flex: 1,
                textAlign: 'center'
            },
            headerRight: (<View></View>)
        };
    }
    componentDidMount(){
        let lecture = Object.assign({},this.props.data);

        this.setState({currObj: lecture});
    }
    componentWillUnmount(){
        clearInterval(this.state.interval);
        let time = this.state.currenttime / this.state.fulltime * 100;
        time = time.toFixed(2);
        AsyncStorage.getItem('loginData').then((token) =>{
            let loginData = JSON.parse(token);
            this.onAccChange(loginData.user._id, this.state.currenttime);
            let index = -1;
            this.props.lectureData.map((lec, i) =>{
                if(lec._id == this.state.currObj._id)
                    index = i;
            })
            this.handleEdit(true, index, this.state.currObj);
        });

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
    saveTime(obj){
        obj.refs.youtubePlayer.currentTime().then((time) => {
            obj.setState({currenttime: time});
        })
    }
    updateVideo(){
        this.refs.youtubePlayer.duration().then((dur)=>{
            let time = 0;
            let acc = this.state.currObj.accomplishments;
            AsyncStorage.getItem('loginData').then((token) =>{
                let loginData = JSON.parse(token);
                let id = loginData.user._id;
                for(let i = 0; i < acc.length; i++){
                    if(id == acc[i]._id){
                        time = dur * (acc[i].accomplishments / 100);
                        this.setState({currenttime: acc[i].accomplishments})
                    }
                }
                this.refs.youtubePlayer.seekTo(time);
                let obj = this;
                this.setState({interval: setInterval(() => {obj.saveTime(obj)}, 10000), fulltime: dur});
            })
             
            
        }).done();
        
    }
    onAccChange(id, time){
        let nextState = {
            currObj: this.state.currObj
        }
        let acc = nextState.currObj.accomplishments;
        for(let i = 0; i < acc.length; i++){
            if(id == acc[i]._id){
                acc[i].accomplishments = time;
                let date = new Date();
                acc[i].endTime = date;
                // Toast.show(''+time);
            }
        }
        this.setState(nextState);
    }
    handleEdit(silent, index, contents){
        this.props.lectureEditRequest(index, contents).then(()=>{
            console.log(index);
            if(this.props.lectureEditStatus.status === 'SUCCESS'){
                if(!silent) { !Toast.show('강의가 수정 되었습니다!'); }
            }
            else{
                return throwError(silent, '강의', this.props.lectureEditStatus.error, '');
            }               
        }).done();
    }
    timeChange(e){ // do this evert N seconds
        if(e.state == 'paused' || e.state == 'seeking'){
            this.refs.youtubePlayer.currentTime().then((time)=>{
                this.refs.youtubePlayer.duration().then((fulltime) => {
                    time = time / fulltime * 100;
                    time = time.toFixed(2);
                    AsyncStorage.getItem('loginData').then((token) =>{
                        let loginData = JSON.parse(token);
                        this.onAccChange(loginData.user._id, time);
                        let index = -1;
                        this.props.lectureData.map((lec, i) =>{
                            if(lec._id == this.state.currObj._id)
                                index = i;
                        })
                        this.handleEdit(true, index, this.state.currObj);
                    });
                });

            });
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        const lecture = this.props.data;
    	return(
    		<View onLayout={(e)=>{
                    let {width} = e.nativeEvent.layout;
                    // Toast.show(''+width);
                    let height = width / (1.7);
                    this.setState({playerHeight: height})}}>
                <YouTube 
                    ref="youtubePlayer"
                    style={{alignSelf: 'center', height: this.state.playerHeight, width: '100%'}} 
                    apiKey="AIzaSyApkQQpOcjzlxtH3uK7sZilS8RUemt-IJY" videoId={this.getVideoId(lecture.link)} play={true} fullscreen={false} loop={false} 
                    onReady={e => this.updateVideo()}
                    onChangeState={e => this.timeChange(e)}
                    />

    		</View>
    	)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        lectureEditRequest: (index, contents) => {
            return dispatch(lectureEditRequest(index, contents));
        },
    }
}
const mapStateToProps = (state) => {
    return {
        data: state.lecture.pass.data,
        lectureEditStatus: state.lecture.edit,
        lectureData: state.lecture.board.data,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lecture);