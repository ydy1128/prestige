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
import { List, ListItem, Checkbox } from 'react-native-elements';

import { lectureBoardRequest } from '../../actions/lecture';

class LectureList extends Component<{}> {
    constructor(props) {
        super(props);
    }

    render(){
    	const listBody = () =>{
    		Toast.show(''+this.props.lectureData.length);
    		return(
			    this.props.lectureData.map((lecture, i) => (
					<ListItem key={i} title={
						<CheckBox
							title={lecture.name}
							onPress={() => {}}
							checked={false}
						/>
					} />
				))
    		)
    	}
    	return(
    		<View>
    			<List>
    				{listBody()}
    			</List>
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LectureList);