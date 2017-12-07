import React from 'react';
import {
    TableRow,
    TableRowColumn
} from 'material-ui/Table';

class StudentObj extends React.Component{
	constructor(props){
		super(props);
		this.clickHandler = this.clickHandler.bind(this);
		this.toggleSelected = this.toggleSelected.bind(this);
		this.addToClass = this.addToClass.bind(this);
		this.state = {
			selected: false
		}
	}
	getBoxId(){
		return this.props.data.username+"-box";
	}
	clickHandler(){
		let nextState = {selected: !this.state.selected};
        this.setState(nextState);
	}
	addToClass(){
		if(this.state.selected){
			return this.props.data;
		}
	}
	getObj(){
		return this.props.data;
	}
	toggleSelected(){
		if(this.state.selected)
			return "collection-item row Student-obj selected";
		else
			return "collection-item row Student-obj";
	}
	render(){
		// const d = (
		// 	<li className={this.toggleSelected()} onClick={this.clickHandler}>
		// 		<p className="col s2">
		// 			<input type="checkbox" id={this.getBoxId()} checked="checked" disabled="disabled" />
		// 			<label htmlFor={this.getBoxId()}></label>
		// 		</p>
		// 		<p className="col s3">{this.props.data.name}</p>
		// 		<p className="col s3">{this.props.data.school}</p>
		// 		<p className="col s3">{this.props.data.level}학년</p>
		// 	</li>
		// )
		return(
			<TableRow key={this.props.data._id}>
                <TableRowColumn>{this.props.data.name}</TableRowColumn>
                <TableRowColumn>{this.props.data.school}</TableRowColumn>
                <TableRowColumn>{this.props.data.level}학년</TableRowColumn>
			</TableRow>
		)
	}
}

StudentObj.propTypes = {
    data: React.PropTypes.object,
};

StudentObj.defaultProps = {
    data: {
    	_id: 'id1234567890',
    	username: 'user',
    	password: 'pswd',
    	name: '이름',
    	school: '학교',
    	level: '0',
    	class: '',
    	created: new Date()
    },
};


export default StudentObj;