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
import Toast from 'react-native-simple-toast';

import navOptions from './navigator';
import { connect } from 'react-redux';
import { registerRequest } from '../../actions/authentication';


class Account extends Component<{}> {
  static navigationOptions = navOptions(undefined, (<View></View>));
    constructor(props) {
        super(props);
        this.state = {

        }

    }

	render(){
		const { navigate } = this.props.navigation;
		return(
			<View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.mainSubtitle}>정보 설정</Text>
          <TextInput
            style={styles.textBox}
            placeholder="아이디"
            underlineColorAndroid='white'
            />
          <TextInput
            style={styles.textBox}
            placeholder="패스워드"
            underlineColorAndroid='white'
            />
          <TextInput
            style={styles.textBox}
            placeholder="이름"
            underlineColorAndroid='white'
            />
          <TextInput
            style={styles.textBox}
            placeholder="학교"
            underlineColorAndroid='white'
            />
          <TextInput
            style={styles.textBox}
            placeholder="학년"
            underlineColorAndroid='white'
            />
        </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 9,
    backgroundColor: '#141908',
    alignItems: 'center',
  },
  mainSubtitle: {
    fontSize: 19,
    margin: 5,
    color: "#c1c1c1"
  },
  textBox: {
    width: 270,
    height: 50,
    backgroundColor: 'white',
    marginTop: 5,
    padding: 10,
  },
});

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);