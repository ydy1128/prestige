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

import { lectureBoardRequest, passLecture } from '../../actions/lecture';
import navOptions from './navigator';

class LectureList extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.displayLecture = this.displayLecture.bind(this);

    }
    static navigationOptions = navOptions(undefined, (<View></View>), '강의게시판');

    componentDidMount(){
        this.props.lectureBoardRequest().then(() => {
        })  
    }
    displayLecture(i){
        let lecture = Object.assign({}, this.props.lectureData[i]);
        
        this.props.passLecture(lecture);
        this.props.navigation.navigate('Lecture', {title: lecture.name});
    }
    render(){
        const { navigate } = this.props.navigation;
    	const listBody = () =>{
    		return(
			    this.props.lectureData.map((lecture, i) => {
                    if(lecture != undefined){
    					return (<ListItem key={i} title={
                            <View>
                                <Text style={{fontSize: 20}}>{lecture.name}</Text>
                            </View>
                        } onPress={() => this.displayLecture(i)} 
                        containerStyle={{paddingTop: 18, height: 70}} />);
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