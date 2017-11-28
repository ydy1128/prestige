import React from 'react';
import { connect } from 'react-redux';
import Icon from 'components/commons/Icon';

const iconStyles = {
  marginRight: 24,
};


class HWBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
        }
	}
    
	render(){
		return(
            <div className="assignment-board">
                <Icon title="home" tooltip="go home" />
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
