import React from 'react';
import { connect } from 'react-redux';

import { classEditPrep } from 'actions/makeclass';

class ClassObj extends React.Component{
	constructor(props){
		super(props);

		this.handleClassData = this.handleClassData.bind(this);
		this.handleStudentData = this.handleStudentData.bind(this);
	}
	handleClassData(){
		const { data } = this.props;
		this.props.classEditPrep(data.name, data.days, data.startTime, data.endTime, this.props.index, data._id, true);
	}
	handleStudentData(){
		const { data } = this.props;
		this.props.classEditPrep(data.name, data.days, data.startTime, data.endTime, this.props.index, data._id, false);		
	}
	render(){
		const { data } = this.props;
		return(
	        <div className="Class-card col m4">
	            <div className="card blue-grey darken-1">
	                <div className="card-content">
	                    <span className="card-title">{ data.name }</span>
	                    <p>{data.days}</p>
	                    <p>{data.startTime} ~ {data.endTime}</p>
	                </div>
	                <div className="card-action white">
	                    <a className="modal-trigger" href="#classInfoModal" onClick={this.handleStudentData}>학생관리</a>
	                    <a className="modal-trigger" href="#classInfoModal" onClick={this.handleClassData}>수업관리</a>
	                </div>
	            </div>
	        </div>
		)
	}
}

ClassObj.propTypes = {
    data: React.PropTypes.object,
};

ClassObj.defaultProps = {
    data: {
        _id: 'id1234567890',
        name: '003A',
        teacher: 't',
        students: [],
        startTime: '00:00 am',
        endTime: '00:00 pm',
        days: '월수금',
        
    },
    index: -1
}

const mapDispatchToProps = (dispatch) => {
    return {
        classEditPrep: (classname, classday, starttime, endtime, index, _id, flag) => {
            return dispatch(classEditPrep(classname, classday, starttime, endtime, index, _id, flag));
        }
    };
};



export default connect(undefined, mapDispatchToProps)(ClassObj);