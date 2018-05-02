import React from "react";
import FontAwesome from 'react-fontawesome';

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

class NotiCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
    	const tableBody = (data) =>{
    		return this.props.lectureData.map((obj, i) =>{
        		return(
		            <TableRow>
		                <TableHeaderColumn>강의</TableHeaderColumn>
		                <TableHeaderColumn>{obj.accomplishments.filter((acc) => {return acc._id == getLoginData().id;})[0].accomplishments + '%'}</TableHeaderColumn>
		                <TableHeaderColumn>{obj.date}</TableHeaderColumn>
		                <TableHeaderColumn>-</TableHeaderColumn>
		            </TableRow>
	            );
        	})
    	}
    	return(
    		<div style={{display: 'inline-block', width: 'calc(50% - 10px)', marginRight: 10}}>
				<Card>
				    <CardTitle title="알림" style={{paddingBottom: 0}}/>
				    <CardText style={{padding: 0}}>
			            <Table  
			                    fixedHeader={true} fixedFooter={true} selectable={false} multiSelectable={false}>
			                <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
					            <TableRow>
					                <TableHeaderColumn>종류</TableHeaderColumn>
					                <TableHeaderColumn>학습률</TableHeaderColumn>
					                <TableHeaderColumn>등록날짜</TableHeaderColumn>
					                <TableHeaderColumn>제출날짜</TableHeaderColumn>
					            </TableRow>
			                </TableHeader>
			                <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
			                {
			                	tableBody(this.props.lectureData)
			                }
			                </TableBody>
			            </Table>
				    </CardText>
				</Card>
    		</div>
    	)
    }
}

export default NotiCard;