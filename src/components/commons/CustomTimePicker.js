import React, { PropTypes } from 'react';
import TimePicker from 'material-ui/TimePicker';

class CustomTimePicker extends React.Component {
	constructor() {
		super();
		this.state = {};

		this.onChange = this.onChange.bind(this);
		// this.convertToMillis = this.convertToMillis.bind(this);
		// this.convertToDateString = this.convertToDateString.bind(this);

	}
	onChange(event, date){
		console.log(date.toLocaleTimeString());
		const { onTimeChange, name } = this.props;

		this.props.onTimeChange(name, date);
	}
	convertToTimeObj(dateString){
		let date = new Date();
		let dateArray = dateString.split(' ')[0].split(':');
		date.setHours(dateArray[0]);
		date.setMinutes(dateArray[1]);
		return date;
	}

	render(){
		const {
			name,
			label,
			value,
			labelStyle,
			fullWidth,
			style,
			textFieldStyle
	    } = this.props;

	    const timevalue = value == '' ? new Date() : this.convertToTimeObj(value);
	    return(
	    	<div>
		    	<label style={labelStyle}>{label}</label>
		        <TimePicker 
		        	name={name} 
		        	okLabel={'확인'} 
		        	cancelLabel={'취소'} 
		        	onChange={this.onChange} 
		        	value={timevalue}
		        	fullWidth={fullWidth}
		        	style={style}
			        textFieldStyle={textFieldStyle}/>
	        </div>
		)

	}
}

CustomTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  onDataChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  style: PropTypes.object,
  textFieldStyle: PropTypes.object
};

CustomTimePicker.defaultProps = {
  name: '',
  onDataChange: () => {},
  fullWidth: true,
  style: {},
  labelStyle: {},
  textFieldStyle: {}
};


export default CustomTimePicker;