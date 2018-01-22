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
import Toast from 'react-native-simple-toast';
import YouTube from 'react-native-youtube';

class Lecture extends Component<{}> {
    constructor(props) {
        super(props);

    }
    getVideoId(link){
        let id = link.split('/');
        id = id[id.length - 1];
        return id;
    }
    render(){
        const lecture = this.props.data;
        Toast.show(''+lecture.name);
    	return(
    		<View>
    			<Text style={{alignSelf: 'center', fontSize: 22, fontWeight: 'bold', margin: 10}}>{lecture.name}</Text>
                <YouTube style={{alignSelf: 'center', height: 200, width: 350}} 
                    apiKey="AIzaSyApkQQpOcjzlxtH3uK7sZilS8RUemt-IJY" videoId={this.getVideoId(lecture.link)} play={true} fullscreen={false} loop={false} />
    		</View>
    	)
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.lecture.pass.data,
    };
};


export default connect(mapStateToProps, null)(Lecture);