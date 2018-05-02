import React from "react";
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import {
	Card, 
	CardHeader,
	CardTitle,
	CardText
} from 'material-ui/Card';

import { getLoginData } from 'components/commons/SessionData';
import { getStudentsInClassRequest } from 'actions/studentinfo';

class ClassCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
    	this.props.getStudentsInClassRequest().then(() =>{
    		console.log(this.props.classStudentsData)
    	})
    }
    render(){
    	const tableBody = (data) =>{
    		return data.map((obj, i) =>{
    			if(obj._id != getLoginData().id)
	        		return(
			            <TableRow key={obj._id}>
			                <TableRowColumn>{obj.name}</TableRowColumn>
			                <TableRowColumn>{obj.school}</TableRowColumn>
			                <TableRowColumn>{obj.level + '학년'}</TableRowColumn>
			            </TableRow>
		            );
        	})
    	}
    	return(
    		<div style={{display: 'inline-block', width: 'calc(50% - 10px)', marginLeft: 10}}>
				<Card style={{height: '100%'}}>
				    <CardTitle title="우리반" titleColor="white" style={{backgroundColor: '#86272d'}}/>
				    <CardText style={{padding: 0, overflow: 'auto', height: 'calc(100% - 68px)'}}>
			            <Table  
			                    fixedHeader={true} fixedFooter={true} selectable={false} multiSelectable={false}>
			                <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
					            <TableRow>
					                <TableHeaderColumn>이름</TableHeaderColumn>
					                <TableHeaderColumn>학교</TableHeaderColumn>
					                <TableHeaderColumn>학년</TableHeaderColumn>
					            </TableRow>
			                </TableHeader>
			                <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
			                {
			                	tableBody(this.props.classStudentsData)
			                }
			                </TableBody>
			            </Table>
				    </CardText>
				</Card>
    		</div>
    	)
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
		getStudentsInClassRequest: () => {
            return dispatch(getStudentsInClassRequest());
        },
    }
}

const mapStateToProps = (state) => {
    return {
        classStudentsData: state.studentinfo.getInClassStudents.data,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassCard);