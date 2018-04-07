import React, { PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';

class CustomDatePicker extends React.Component {
	constructor() {
		super();
		this.state = {
			checkboxChecked: false,
		};
		this.onChange = this.onChange.bind(this);
		this.convertToDateObj = this.convertToDateObj.bind(this);
		this.changeCheckBox = this.changeCheckBox.bind(this);
	}
	componentWillMount(){
		this.setState({checkboxChecked: this.props.value == '' ? false : true});
	}
	onChange(event, date){
		console.log('onchange called')
		const { disabled, name } = this.props;
		// console.log(date, this.props.value);
		this.props.onDataChange(name, (disabled ? '' : date));
	}
	convertToDateObj(dateString){
		console.log('convert called')
		console.log(dateString)
		let date = new Date();
		let dateArray = dateString.split('-');
		console.log(dateString)
		date.setFullYear(dateArray[0]);
		date.setMonth(parseInt(dateArray[1]) - 1);
		date.setDate(dateArray[2]);
		return date;
	}
	changeCheckBox(){
		console.log('change cb called')
		this.onChange(undefined, !this.state.checkboxChecked ? new Date() : '');
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
	    const dateValue = value == '' ? new Date() : this.convertToDateObj(value);

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

		        <DatePicker 
		        	name={name} 
		        	okLabel={'확인'} 
		        	cancelLabel={'취소'} 
		        	onChange={this.onChange} 
		        	value={dateValue}
		        	fullWidth={fullWidth}
		        	style={style}
			        textFieldStyle={textFieldStyle}
			        disabled={checkBox ? this.state.checkboxChecked ? false : true : disabled} />
	        </div>
		)

	}
}

CustomDatePicker.defaultProps = {
  name: '',
  value: '',
  onDataChange: () => {},
  fullWidth: true,
  style: {},
  labelStyle: {},
  textFieldStyle: {},
  disabled: false,
  checkBox: false,
};


export default CustomDatePicker;