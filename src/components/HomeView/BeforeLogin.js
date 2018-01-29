import React from 'react';

class BeforeLogin extends React.Component {
    constructor(props){
        super(props);
        this.state={
        }

    }

    render(){

        return(
            <div style={{position: 'relative', height: '100%', width: '100%', textAlign: 'center'}}>
                <div style={{position: 'absolute', height: '35%', width: '100%', backgroundColor: '#86272d'}}></div>
                <div style={{position: 'relative', display: 'flex', flexDirection: 'column', height: 'calc(100% - 100px)', width: '90%', margin: 'auto ', paddingTop: 100}}>
                    <div id="rotateDiv" style={{position: 'absolute', width: '100%', height: 'calc(100% - 100px)', zIndex: 0, overflow: 'hidden', whiteSpace: 'nowrap'}}>
                        <img style={{display: 'inline-block', width: '100%', height: '100%'}} src="img/1.jpg" />
                        <img style={{display: 'inline-block', width: '100%', height: '100%'}} src="img/2.jpg" />
                    </div>
                    <div style={{position: 'absolute', width: '100%', height: 'calc(100% - 100px)', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}></div>
                    <div style={{flex: 8, background: 'none', zIndex: 2, color: 'white'}}>
                        <div>
                            <h1 style={{fontSize: 65, marginTop: '15%'}}>P R E S T I G E</h1>
                            <h5>프레스티지 수시영어전문학원</h5>
                        </div>
                    </div>
                    <div style={{display: 'flex', flex: 3, flexDirection: 'row', zIndex: 2, backgroundColor: '#86272d77', color: '#d3d3d3'}}>
                        <div class="hoverDiv" style={{flex: 5, borderRight: '1px solid #00000077', borderTop: '1px solid #00000077', paddingTop: '20px'}}>
                            <h4>Teachers</h4>
                            <h6>회원가입 | 로그인</h6>
                        </div>
                        <div class="hoverDiv" style={{flex: 5, borderLeft: '1px solid #00000077', borderTop: '1px solid #00000077', paddingTop: '20px'}}>
                            <h4>Students</h4>
                            <h6>회원가입 | 로그인</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BeforeLogin;