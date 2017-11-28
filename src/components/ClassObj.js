import React from 'react';
import { connect } from 'react-redux';

import { classEditPrep } from 'actions/makeclass';

class ClassObj extends React.Component{
	constructor(props){
		super(props);

		this.handleClassData = this.handleClassData.bind(this);
		this.handleStudentData = this.handleStudentData.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSelected = this.handleSelected.bind(this);

		this.state = {
			selected: false
		};
	}
	handleClassData(){
		const { data } = this.props;
		this.props.classEditPrep(data.name, data.days, data.startTime, data.endTime, this.props.index, data._id, data.students, true);
	}
	handleStudentData(){
		const { data } = this.props;
		this.props.classEditPrep(data.name, data.days, data.startTime, data.endTime, this.props.index, data._id, data.students, false);		
	}
	handleClick(){
		this.props.getClick(this.props.data, this.props.index, !this.state.selected);
		this.setState({
			selected: !this.state.selected
		})
		
	}
	handleSelected(){
		if(this.state.selected){
			return 'blue-grey lighten-3';
		}
		else{
			return 'white';
		}
	}
	getObj(){
		return {data: this.props.data, selected: this.state.selected};
	}
	render(){
		const color_stock = ['red lighten-2', 'indigo lighten-2', 'teal lighten-1', 'yellow lighten-1', 'brown lighten-1', 'pink lighten-3', 'blue lighten-2', 'green lighten-1', 'amber lighten-2', 'grey lighten-1', 'purple lighten-2', 'light-blue lighten-3', 'light-green lighten-2', 'orange lighten-2', ]
		const { data } = this.props;
		return(
	        <div className="Class-card col m4">
	            <div className={'card ' + this.handleSelected()}>
	            	<div className={'color-bar ' + color_stock[this.props.index % color_stock.length]}></div>
	                <div className="card-content">
	                    <span className="card-title">
	                    	<input type="checkbox" id={'card-'+data._id} onClick={this.handleClick}/>
	                        <label htmlFor={'card-'+data._id} className="card-input"></label>
	                    	{ data.name }
	                    </span>
	                    <p>{data.days}</p>
	                    <p>{data.startTime} ~ {data.endTime}</p>
	                </div>
	                <div className={'card-action ' + this.handleSelected()}>
	                    <a className="modal-trigger blue-grey-text text-darken-3" href="#classInfoModal" onClick={this.handleStudentData}>학생관리</a>
	                    <a className="modal-trigger blue-grey-text text-darken-3" href="#classInfoModal" onClick={this.handleClassData}>수업관리</a>
	                </div>
	            </div>
	        </div>
		)
	}
}

ClassObj.propTypes = {
    data: React.PropTypes.object,
    getClick: React.PropTypes.func
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
    index: -1,
    getClick: () =>{console.log('getClick not defined')}
}

const mapDispatchToProps = (dispatch) => {
    return {
        classEditPrep: (classname, classday, starttime, endtime, index, _id, students, flag) => {
            return dispatch(classEditPrep(classname, classday, starttime, endtime, index, _id, students, flag));
        }

    };
};



export default connect(undefined, mapDispatchToProps)(ClassObj);