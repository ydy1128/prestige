import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { ClassObj } from 'components';

class ClassBoard extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4 className="">수업관리</h4></div>
                <div className="icons col m8">
                    <FontAwesome className="remove-button right inactive" name="trash-o" />
                    <a className="modal-trigger" href="#classInfoModal">
                        <FontAwesome className="plus-button right" name="plus" />
                    </a>
                </div>
            </div>
        )
        const mapToComponents = data => {
            return data.map((cls, i) => {
                return (<ClassObj data={cls} key={cls._id} index={i} />);
            });
        };
		return(
            <div className="Boards">
                { boardHeader }
                <hr className="col m12"/>
	            <div className="Board-contents row">
	            	{mapToComponents(this.props.data)}
	            </div>
            </div>
		)
	}
}

ClassBoard.propTypes = {
    data: React.PropTypes.array,
    currentUser: React.PropTypes.string
};

ClassBoard.defaultProps = {
    data: [],
    currentUser: ''
};


export default ClassBoard;