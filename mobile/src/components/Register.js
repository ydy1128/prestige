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


class Register extends Component<{}> {
    static navigationOptions  = ({ navigation }) => {
      let params = navigation.state.params;
      if(params.title != undefined) navOptions.headerTitle = params.title;
      if(params.right != undefined) navOptions.headerRight = params.right;
      if(params.left != undefined) navOptions.headerLeft = params.left;
      return navOptions;
    }

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          name: '',
          school: '',
          level: '',
        }
        this.handleTextChange = this.handleTextChange.bind(this);
    }
  handleTextChange(text, target){
    let nextState = {}
    nextState[target] = text;
    this.setState(nextState)
  }
	render(){
		const { navigate } = this.props.navigation;
    let {username, password, name, school, level} = this.state;
		return(
			<View style={styles.container}>
        <View style={styles.main}>
					<Text style={styles.mainTitle}>프레스티지 수시영어 전문학원</Text>
					<Text style={styles.mainSubtitle}>학생 회원가입</Text>
					<TextInput
						style={styles.textBox}
						placeholder="아이디"
						underlineColorAndroid='white'
            onChangeText={(text) => {this.handleTextChange(text, 'username')}}
            value={username}
						/>
					<TextInput
						style={styles.textBox}
						placeholder="패스워드"
            secureTextEntry={true}
						underlineColorAndroid='white'
            onChangeText={(text) => {this.handleTextChange(text, 'password')}}
            value={password}
						/>
          <TextInput
            style={styles.textBox}
            placeholder="이름"
            underlineColorAndroid='white'
            onChangeText={(text) => {this.handleTextChange(text, 'name')}}
            value={name}
            />
					<TextInput
						style={styles.textBox}
						placeholder="학교"
						underlineColorAndroid='white'
            onChangeText={(text) => {this.handleTextChange(text, 'school')}}
            value={school}
						/>
					<TextInput
						style={styles.textBox}
						placeholder="학년"
						underlineColorAndroid='white'
            onChangeText={(text) => {this.handleTextChange(text, 'level')}}
            value={level}
						/>

					<TouchableHighlight onPress={()=>{ 
              this.props.registerRequest(username, password, name, school, level).then(() =>{
                if(this.props.status == 'SUCCESS'){
                  Toast.show('계정 생성 완료! 로그인하세요');
                  navigate('Home');
                }
                else{
                  // error handling
                }
              }).done();
              
            }} style={styles.buttonRegister} underlayColor='#d6a50b'>
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

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (username, password, name, school, level) => { 
            return dispatch(registerRequest(username, password, name, school, level, 'student')); 
        },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);