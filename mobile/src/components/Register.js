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
import navOptions from './navigator';


class Register extends Component<{}> {
  static navigationOptions = navOptions(undefined, (<View></View>));

	render(){
		const { navigate } = this.props.navigation;
		return(
			<View style={styles.container}>
		        <View style={styles.main}>
					<Text style={styles.mainTitle}>프레스티지 수시영어 전문학원</Text>
					<Text style={styles.mainSubtitle}>학생 회원가입</Text>
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
						placeholder="학교"
						underlineColorAndroid='white'
						/>
					<TextInput
						style={styles.textBox}
						placeholder="학년"
						underlineColorAndroid='white'
						/>

					<TouchableHighlight onPress={()=>navigate('Home')} style={styles.buttonRegister} underlayColor='#d6a50b'>
						<Text style={styles.buttonText}>회원가입</Text>
					</TouchableHighlight>
		        </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#86272d',
  },
  main: {
    flex: 9,
    backgroundColor: '#141908',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '600',
    margin: 20,
    color: "#c1c1c1"
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
  buttonRegister: {
    width: 270,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8c709',
    marginTop: 20,
  },
  buttonText:{
    color: 'white',
    fontSize: 23,
  },
});

export default Register;