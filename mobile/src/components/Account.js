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
import Toast from 'react-native-simple-toast';

import navOptions from './navigator';
import { connect } from 'react-redux';
import { updateUserRequest } from '../../actions/authentication';


class Account extends Component<{}> {
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
  static navigationOptions  = ({ navigation }) => {
    let params = navigation.state.params;
    console.log(params.title, params.left, params.right)
    if(params.title != undefined) navOptions.headerTitle = params.title;
    if(params.right != undefined) navOptions.headerRight = params.right;
    if(params.left != undefined) navOptions.headerLeft = params.left;
    return navOptions;
  }
  componentDidMount(){
    AsyncStorage.getItem('loginData').then((token) =>{
      let loginData = JSON.parse(token).user;
      console.log(loginData)
      this.setState({
        username: loginData.username,
        name: loginData.name,
        school: loginData.school,
        level: ''+loginData.level,
      });
    });

  }
  handleTextChange(text, target){
    let nextState = {}
    nextState[target] = text;
    this.setState(nextState)
  }
	render(){
		const { navigate } = this.props.navigation;
		return(
			<View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.mainSubtitle}>정보 설정</Text>
          <Text style={styles.placeHolderText}>아이디</Text>
          <Text style={styles.textBox}>{this.state.username}</Text>
          <Text style={styles.placeHolderText}>패스워드</Text>
          <TextInput
            ref='password'
            value={this.state.password}
            style={styles.textBox}
            secureTextEntry={true}
            onChangeText={(text) => {this.handleTextChange(text, 'password')}}
            underlineColorAndroid='transparent'
            />
          <Text style={styles.placeHolderText}>이름</Text>
          <TextInput
            ref='name'
            value={this.state.name}
            style={styles.textBox}
            onChangeText={(text) => {this.handleTextChange(text, 'name')}}
            underlineColorAndroid='transparent'
            />
          <Text style={styles.placeHolderText}>학교</Text>
          <TextInput
            ref='school'
            value={this.state.school}
            style={styles.textBox}
            onChangeText={(text) => {this.handleTextChange(text, 'school')}}
            underlineColorAndroid='transparent'
            />
          <Text style={styles.placeHolderText}>학년</Text>
          <TextInput
            ref='level'
            value={this.state.level}
            style={styles.textBox}
            onChangeText={(text) => {this.handleTextChange(text, 'level')}}
            underlineColorAndroid='transparent'
            />
          <TouchableHighlight onPress={()=>{ 
              console.log(this.state)
              this.props.updateUserRequest(this.state).then(() =>{
                if(this.props.status == 'SUCCESS'){
                  console.log(this.props.currentUser.user)
                  let loginData = {
                    user: this.props.currentUser.user,
                    role: 'student'
                  };
                  let storageData = JSON.stringify(loginData);
                  this.setState({
                    username: loginData.user.username,
                    name: loginData.user.name,
                    school: loginData.user.school,
                    level: ''+loginData.user.level,
                  });                  
                  AsyncStorage.setItem('loginData', storageData).then(() =>{
                    Toast.show('정보 수정 완료!');

                  }).catch(() =>{
                    Toast.show('정보 수정 실패')
                  })
                }
                else{
                  // error handling
                  Toast.show('정보 수정 실패')
                }
              }).done();
            }} style={styles.button} underlayColor='#d6a50b'>
            <Text style={styles.buttonText}>정보변경</Text>
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
  placeHolderText: {
    marginTop: 15, 
    zIndex: 2, 
    fontSize: 11, 
    color: 'white', 
    paddingLeft: 45, 
    alignSelf: 'flex-start'
  },
  textBox: {
    width: 270,
    height: 50,
    marginTop: -10,
    backgroundColor: '#141908',
    color: 'white',
    padding: 10,
    borderBottomWidth: 3,
    borderColor: 'white'
  },
  button: {
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
      status: state.authentication.update.status,
      currentUser: state.authentication.status.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserRequest: (obj) => { 
            return dispatch(updateUserRequest(obj, 'student')); 
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);