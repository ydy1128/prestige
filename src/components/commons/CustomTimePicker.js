import React, { PropTypes } from 'react';
import TimePicker from 'material-ui/TimePicker';
import Checkbox from 'material-ui/Checkbox';

class CustomTimePicker extends React.Component {
	constructor() {
		super();
		this.state = {
			checkboxChecked: false,
		};

		this.onChange = this.onChange.bind(this);
		this.changeCheckBox = this.changeCheckBox.bind(this);
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
	changeCheckBox(){
		this.setState({checkboxChecked: !this.state.checkboxChecked});
	}
	render(){
		const {
			name,
			label,
			value,
			labelStyle,
			fullWidth,
			style,
			textFieldStyle,
			disabled,
			checkBox
	    } = this.props;

	    const timevalue = value == '' ? new Date() : this.convertToTimeObj(value);
	    return(
	    	<div>
	    		{checkBox ? 
		    	(<Checkbox
		    		style={{display: 'inline-block', width: '30px', verticalAlign: 'bottom'}}
		    		onClick={this.changeCheckBox}
					checked={this.state.checkboxChecked}
					/>)
		    	: null}
		    	<label style={labelStyle}>{label}</label>

		        <TimePicker 
		        	name={name} 
		        	okLabel={'확인'} 
		        	cancelLabel={'취소'} 
		        	onChange={this.onChange} 
		        	value={timevalue}
		        	fullWidth={fullWidth}
		        	style={style}
			        textFieldStyle={textFieldStyle}
			        disabled={checkBox ? this.state.checkboxChecked ? false : true : disabled} />
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
  value: '12:00 PM',
  onDataChange: () => {},
  fullWidth: true,
  style: {},
  labelStyle: {},
  textFieldStyle: {},
  disabled: false,
  checkBox: false,
};


export default CustomTimePicker;