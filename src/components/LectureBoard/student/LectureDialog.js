import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class LectureDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoPlayer: null,
        }
        // this.loadVideo = this.loadVideo.bind(this);
    }
    getVideo(){
        let div = document.getElementById('player')
        return div;
    }
    playertest(){
        // let player = document.getElementById('player');
        console.log(player);
        player.playVideo();
    }
	render(){
        const actions = [
            <FlatButton
                label='재생'
                primary={true}
                onClick={this.playertest}
            />,
            <FlatButton
                label='닫기'
                primary={true}
                onClick={this.props.handleClose}
            />
        ];
        // const = (
        //         <iframe style={{minWidth: '400px', minHeight: '250px'}} src={this.props.currObj.link + '?enablejsapi=1&origin=http://localhost:2828/'}
        //             target="_top" frameBorder="0" allowFullScreen></iframe>
        // )
		return (
            <Dialog
                title={this.props.currObj.name}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                // autoScrollBodyContent={this.props.editMode? false : true}>
                >

            </Dialog>
		)
	}
}

export default LectureDialog;