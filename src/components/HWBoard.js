import React from 'react';
import { connect } from 'react-redux';
import Icon from 'components/commons/Icon';
import FontAwesome from 'react-fontawesome';

const styles = {
    iconStyles: {
        marginRight: 24,
    }
};

class HWBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
        }
	}

	render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4>수업관리ddss</h4></div>
                <div className="icons col m8">
                    <a>
                        <FontAwesome className={'remove-button right '} name="trash-o" />
                    </a>
                    <a href="#classInfoModal">
                        <FontAwesome className={'plus-button right '} name="plus" />
                    </a>
                </div>
            </div>
        )

		return(
            <div className="assignment-board Board-header">
                {boardHeader}
            </div>
		)
	}
}

HWBoard.propTypes = {
    // data: React.PropTypes.array,
};

HWBoard.defaultProps = {
    //data: [],
};


export default HWBoard;
