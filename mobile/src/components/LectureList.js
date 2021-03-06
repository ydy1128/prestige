import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableHighlight,
    ScrollView
} from 'react-native';
import Icon from '../../node_modules/react-native-vector-icons/dist/FontAwesome';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { List, ListItem, CheckBox } from 'react-native-elements';
import Thumbnail from 'react-native-thumbnail-video';
import { lectureBoardRequest, passLecture } from '../../actions/lecture';
import navOptions from './navigator';

class LectureList extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.displayLecture = this.displayLecture.bind(this);

    }
    static navigationOptions  = ({ navigation }) => {
        let params = navigation.state.params;
        if(params.title != undefined) navOptions.headerTitle = params.title;
        if(params.right != undefined) navOptions.headerRight = params.right;
        if(params.left != undefined) navOptions.headerLeft = params.left;
        return navOptions;
    }
    componentDidMount(){
        this.props.lectureBoardRequest().then(() => {
        })  
    }
    displayLecture(i){
        let lecture = Object.assign({}, this.props.lectureData[i]);
        lecture.index = i;
        this.props.passLecture(lecture);
        this.props.navigation.navigate('Lecture', {title: lecture.name, right: (<View></View>)});
    }
    render(){
        const { navigate } = this.props.navigation;
    	const listBody = () =>{
    		return(
			    this.props.lectureData.map((lecture, i) => {
                    if(lecture != undefined){
                        let date = new Date(lecture.date);
    					return (<ListItem key={i} title={
                            <View style={{flexDirection: 'row'}}>
                                <Thumbnail url={'https://www.youtube.com/watch?v=' + lecture.link.replace('https://www.youtube.com/embed/', '')}
                                    style={{width: 70, height: 50}}/>
                                <View style={{flexDirection: 'column', marginLeft: 10}}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{lecture.name}</Text>
                                    <Text style={{fontSize: 15}}>{date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()}</Text>
                                </View>
                            </View>
                        } onPress={() => this.displayLecture(i)} 
                        containerStyle={{padding: 0, height: 70}} />);
                    }
				})
    		)
    	}
    	return(
    		<View style={{flex: 1}}>
                <ScrollView>
        			<List containerStyle={{marginTop: 0}}>
        				{listBody()}
        			</List>
                </ScrollView>
    		</View>
    	)
    }
}

const mapStateToProps = (state) => {
    return {
        lectureData: state.lecture.board.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        lectureBoardRequest: () => { 
            return dispatch(lectureBoardRequest()); 
        },
        passLecture: (lecture) => { 
            return dispatch(passLecture(lecture)); 
        }
    };
};

const styles = {
    boardTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#c1c1c1', 
        borderBottomWidth: 3

    },
    boardTitleText: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
        margin: 10, 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LectureList);