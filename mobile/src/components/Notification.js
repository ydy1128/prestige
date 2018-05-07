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

class Notification extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    static navigationOptions  = ({ navigation }) => {
        let params = navigation.state.params;
        if(params.title != undefined) navOptions.headerTitle = params.title;
        if(params.right != undefined) navOptions.headerRight = params.right;
        if(params.left != undefined) navOptions.headerLeft = params.left;
        return navOptions;
    }
    componentDidMount(){
        // if(this.props.lectureData.length == 0){
            this.props.lectureBoardRequest().then(() => {

            })
        // }
        // this.props.lectureData.map()
    }
    render(){
        const { navigate } = this.props.navigation;
    	const listBody = () =>{
    		return(
			    this.props.lectureData.map((lecture, i) => {
                    let expiryDate = new Date();
                    let lectureDate = new Date(lecture.date);
                    expiryDate.setDate(expiryDate.getDate() - 10);
                    console.log(expiryDate, lectureDate)
                    if(lecture != undefined && lectureDate >= expiryDate){
    					return (<ListItem key={i} title={
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="tv" size={30} color="black" style={{padding: 10}} />
                                <View style={{flexDirection: 'column', marginLeft: 10}}>
                                    <Text style={{fontSize: 20}}>{lecture.name}</Text>
                                    <Text style={{fontSize: 15}}>{'등록일: ' + lectureDate.getFullYear() + '-' + lectureDate.getMonth() + '-' + lectureDate.getDate()}</Text>
                                </View>
                            </View>
                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Notification);