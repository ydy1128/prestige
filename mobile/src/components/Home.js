import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableHighlight,
  TouchableOpacity,
  Linking,
  AsyncStorage
} from 'react-native';
import Icon from '../../node_modules/react-native-vector-icons/dist/FontAwesome';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast';

import { loginRequest, getStatusRequest, extendSession, logoutRequest } from '../../actions/authentication';
import navOptions from './navigator';
class Home extends Component<{}> {
    constructor(props) {
      super(props);
  		this.state = {
  			loggedIn: false,
        facebookurl: 'https://www.facebook.com/prestige.english',
        cafeurl: 'http://cafe.naver.com/prestigeenglish',
  			username: 'test1',
  			password: 'test1',
        loginData: {
          id: '',
          username: '',
          role: '',
        },
  		}
    this.onLogin = this.onLogin.bind(this);
    this.onOpenUrl = this.onOpenUrl.bind(this);
	}
  static navigationOptions  = ({ navigation }) => {
    let params = navigation.state.params;
    navOptions.headerTitle = 'Prestige';
    // if(!params.right == undefined) navOptions.headerRight = params.right;
    // if(!params.left == undefined) navOptions.headerLeft = params.left;
    return navOptions;
  }
  componentWillMount(){
    //add loading screen
    AsyncStorage.getItem('loginData').then((token) =>{
      // Toast.show(token);
      let loginData = JSON.parse(token);
      if(loginData != null){
        this.props.getStatusRequest().then(() =>{
          //success fail
          if(this.props.sessionStatus.valid){
            this.props.extendSession(loginData.user);
            this.setState({loggedIn: true, loginData: loginData.user});
          }

        })
        .done();
      }
      else{
        Toast.show('login data does not exists');
      }
    }).catch((error) =>{
      Toast.show(''+error);
    })
    .done();
  }
	onLogin(){
		this.props.loginRequest(this.state.username, this.state.password).then(()=>{
			if(this.props.status === "SUCCESS"){
				this.setState({loggedIn: true});
				// create session data
				let loginData = {
            user: this.props.user.user,
            role: 'student'
        };
        let storageData = JSON.stringify(loginData);
        this.setState({loginData: loginData.user})
        this.addLoginData(storageData);
			}
			else {

          return false;
      }
		})
    .done();
	}
  async addLoginData(storageData){
    try {
      await AsyncStorage.setItem('loginData', storageData);
    } catch (error) {
      Toast.show('Login Error. AsyncStorage.');
    }
  }
  async getLoginData(){
    return AsyncStorage.getItem('loginData');
  }
  onOpenUrl(url_type){
    let url = this.state[url_type+'url'];
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }
  onOpenTel(){
    
    Linking.canOpenURL('tel:0629558505').then(supported => {
      if (supported) {
        Linking.openURL('tel:0629558505');
      } else {
        console.log("Don't know how to open URI: " + 'tel:0629558505');
      }
    });
  }
	render(){
		const { navigate } = this.props.navigation;
		const beforeLoginView = (
		    <View style={styles.main}>
					<Text style={styles.mainTitle}>프레스티지 수시영어 전문학원</Text>
					<TextInput
						style={styles.textBox}
						placeholder="아이디"
						value={this.state.username}
						onChangeText={(text) => this.setState({username:text})}
						underlineColorAndroid='white'
						/>
					<TextInput
						style={styles.textBox}
            secureTextEntry={true}
						placeholder="패스워드"
						value={this.state.password}
						onChangeText={(text) => this.setState({password:text})}
						underlineColorAndroid='white'
						/>
					<TouchableHighlight onPress={() => this.onLogin()} style={styles.buttonLogin} underlayColor='#6b2027'>
						<Text style={styles.buttonText}>로그인</Text>
					</TouchableHighlight>
					<Image
						style={styles.divider}
						source={require('../../img/divider.png')}
						/>
					<TouchableHighlight onPress={()=>navigate('Register', {right: (<View></View>)})} style={styles.buttonRegister} underlayColor='#d6a50b'>
						<Text style={styles.buttonText}>회원가입</Text>
					</TouchableHighlight>
		    </View>
		)
		const afterLoginView = (
			<View style={styles.main}>
        <View style={styles.introSection}>
          <View style={styles.introTextDiv}>
            <Text style={{color: '#f8c709', fontSize: 20}}>안녕하세요,</Text>
            <Text style={{color: '#f8c709', fontSize: 30}}>{this.state.loginData.name} 학생</Text>
          </View>
          <TouchableOpacity style={styles.introAlertDiv} onPress={()=>navigate('Notification', {title: '알림', right: (<View></View>)})} >
            <Icon name="envelope" size={65} color="#f8c709" />
            <Icon name="circle" size={38} color="#dd0000" style={{position: 'absolute', right: 35, top: 20}} />
            <Text style={{position: 'absolute', color: 'white', fontSize: 19, fontWeight: 'bold', right: 46, top: 25}}>5</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainButtonsDiv}>
          <View style={styles.mainButtonsCol}>
            <TouchableHighlight style={{flex: 1, backgroundColor: '#03a9f4'}} onPress={()=>navigate('LectureList', {title: '강의게시판', right: (<View></View>)})} underlayColor="#0288d1">
              <View style={styles.mainButtons}>
                <Icon name="tv" size={45} color="#FFFFFF" />
                <Text style={styles.mainButtonText}>강의게시판</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{flex: 1, backgroundColor: '#ef5350'}} onPress={()=>navigate('Account', {title: 'Prestige', right: (<View></View>)})} underlayColor="#d32f2f">
              <View style={styles.mainButtons}>
                <Icon name="user-circle-o" size={45} color="#FFFFFF" />
                <Text style={styles.mainButtonText}>계정관리</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.mainButtonsCol}>
            <TouchableHighlight style={{flex: 1, backgroundColor: '#00e676'}} onPress={()=>{}} underlayColor="#00c853">
              <View style={styles.mainButtons}>
                <Icon name="file-o" size={45} color="#FFFFFF" />
                <Text style={styles.mainButtonText}>숙제게시판</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{flex: 1, backgroundColor: '#ab47bc'}} onPress={()=>{
                AsyncStorage.removeItem('loginData').then(() =>{
                  this.props.logoutRequest().then(() => {
                    this.setState({loggedIn: false, loginData: {id: '',username: '',role: ''}})
                  })
                })
              }} underlayColor="#8e24aa">
              <View style={styles.mainButtons}>
                <Icon name="sign-out" size={45} color="#FFFFFF" />
                <Text style={styles.mainButtonText}>로그아웃</Text>
              </View>

            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <View style={styles.footerButtons}>
              <Icon name="facebook-square" size={45} color="#FFFFFF" 
                onPress={() => this.onOpenUrl('facebook')}/>
            </View>
            <View style={styles.footerButtons}>
              <Icon name="coffee" size={45} color="#FFFFFF" 
                onPress={() => this.onOpenUrl('cafe')}/>
            </View>
            <View style={styles.footerButtons}>
              <Icon name="phone" size={45} color="#FFFFFF" 
                onPress={() => this.onOpenTel()}/>
            </View>
          </View>
        </View>
      </View>
		)
		return(
			<View style={styles.container}>
				{this.state.loggedIn ? afterLoginView : beforeLoginView}
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
  textBox: {
    width: 270,
    height: 50,
    backgroundColor: 'white',
    marginTop: 5,
    padding: 10,
  },
  buttonLogin: {
    width: 270,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#86272d',
    marginTop: 15,
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
  divider: {
    marginTop: 20,
    width: 270,
    height: 50,
  },

  introSection: {
    flex: 5,
    flexDirection: 'row',
    alignContent: 'flex-start', 
  },
  introTextDiv: {
    flex: 1,
    justifyContent: 'center', 
    marginLeft: 30
  },
  introAlertDiv: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  mainButtonsDiv: {
    flex: 13, flexDirection: 'row',
    borderWidth: 4, 
    borderColor: '#141908'
  },
  mainButtonsCol: {
    flex: 1, 
    flexDirection: 'column'
  },
  mainButtons: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 4, 
    borderColor: '#141908'
  },
  mainButtonText: {
    color: 'white', 
    marginTop: 10, 
    fontSize: 18, 
    fontWeight: 'bold'
  },

  footer: {
    flex: 3, 
    alignContent: 'flex-start', 
    backgroundColor: '#86272d', 
    flexDirection: 'row'
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});


const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status,
        sessionStatus: state.authentication.status,
        user: state.authentication.status.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => { 
            return dispatch(loginRequest(id,pw)); 
        },
        getStatusRequest: () =>{
          return dispatch(getStatusRequest());
        },
        extendSession: (sessionData) => { 
            return dispatch(extendSession(sessionData)); 
        },
        logoutRequest: () => { 
            return dispatch(logoutRequest('student')); 
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);