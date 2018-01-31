import React from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import './style.scss';
import { getLoginData, saveLoginData } from 'components/commons/SessionData';

let interval;
class BeforeLogin extends React.Component {
    constructor(props){
        super(props);
        this.state={
            rotateCounter: 0,
            rotateMargin: 0,
        }
        this.rotateTimer = this.rotateTimer.bind(this);
        this.rotateOpposite = this.rotateOpposite.bind(this);
    }
    componentDidMount(){
        if(!getLoginData().isLoggedIn)
            interval = setInterval(this.rotateTimer, 4000);
    }
    componentWillUnmount(){
        clearInterval(interval);
    }
    rotateTimer(event){
        let fullCount = Object.keys(this.refs).length;
        let rotateCounter = this.state.rotateCounter;
        if(rotateCounter < fullCount-1){
            rotateCounter++;
            $('#rotateDiv').animate({marginLeft: '-=100%'})
        }
        else{
            rotateCounter = 0;
            $('#rotateDiv').animate({marginLeft: '0'})
        }
        if(event != undefined){
            clearInterval(interval);
            interval = setInterval(this.rotateTimer, 4000);
        }
        this.setState({rotateCounter: rotateCounter});
    }
    rotateOpposite(event){
        let fullCount = Object.keys(this.refs).length;
        let rotateCounter = this.state.rotateCounter;
        console.log(rotateCounter)
        console.log($('#rotateDiv').css('marginLeft'))
        if(rotateCounter == 0){
            rotateCounter = fullCount-1;
            $('#rotateDiv').animate({marginLeft: '-' + 100*(fullCount - 1) + '%'})
        }
        else{
            rotateCounter--;
            $('#rotateDiv').animate({marginLeft: 100 * rotateCounter + '%'})
        }
        clearInterval(interval);
        interval = setInterval(this.rotateTimer, 4000);
        this.setState({rotateCounter: rotateCounter});
    }
    render(){
        

        return(
            <div style={{position: 'relative', height: '100%', width: '100%', textAlign: 'center'}}>
                <div style={{position: 'absolute', height: '35%', width: '100%', backgroundColor: '#86272d', backgroundImage: 'url("img/backpattern.png")'}}>
                </div>
                <div style={{position: 'relative', display: 'flex', flexDirection: 'column', height: 'calc(100% - 100px)', width: '90%', margin: 'auto ', paddingTop: 100}}>
                    <div style={{position: 'absolute', width: '100%', height: 'calc(100% - 100px)', zIndex: 0, overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'black'}}>
                        <div id="rotateDiv" style={{width: 100 * Object.keys(this.refs).length + '%', height: '100%'}}>
                            <img ref="img1" style={{display: 'inline-block', width: 100 / Object.keys(this.refs).length + '%', height: '100%'}} src="img/1.jpg" />
                            <img ref="img2" style={{display: 'inline-block', width: 100 / Object.keys(this.refs).length + '%', height: '100%'}} src="img/2.jpg" />
                        </div>
                    </div>
                    <div style={{position: 'absolute', width: '100%', height: 'calc(100% - 100px)', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}></div>
                    <div style={{flex: 8, background: 'none', zIndex: 2, color: 'white'}}>
                        <div style={{marginTop: '10%'}}>
                            <FontAwesome name="chevron-left" className="rotateButton" onClick={this.rotateOpposite} style={{float: 'left', fontSize: 70, padding: '70px 10px 0'}}/>
                            <div style={{display: 'inline-block'}}>
                                <h1 style={{fontSize: 65}}>P R E S T I G E</h1>
                                <h5>프레스티지 수시영어전문학원</h5>
                            </div>
                            <FontAwesome name="chevron-right" className="rotateButton" onClick={this.rotateTimer} style={{float: 'right', fontSize: 70, padding: '70px 10px 0'}}/>
                        </div>
                    </div>
                    <div style={{display: 'flex', flex: 3, flexDirection: 'row', zIndex: 2, backgroundColor: '#86272d77', color: '#d3d3d3'}}>
                        <div className="hoverDiv" style={{flex: 5, borderRight: '1px solid #00000077', borderTop: '1px solid #00000077', paddingTop: '30px'}}>
                            <h4>Students</h4>
                            <h6>
                                <Link to="register" className="links" onClick={() => {saveLoginData('role', 'student')}}>회원가입</Link>
                                {' | '}
                                <Link to="login" className="links" onClick={() => {saveLoginData('role', 'student')}}>로그인</Link>
                            </h6>
                        </div>
                        <div className="hoverDiv" style={{flex: 5, borderLeft: '1px solid #00000077', borderTop: '1px solid #00000077', paddingTop: '30px'}}>
                            <h4>Teachers</h4>
                            <h6>
                                <Link to="register" className="links" onClick={() => {saveLoginData('role', 'teacher')}}>회원가입</Link>
                                {' | '}
                                <Link to="login" className="links" onClick={() => {saveLoginData('role', 'teacher')}}>로그인</Link>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BeforeLogin;