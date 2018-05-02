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

class ClassCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
    	return(
    		<div style={{display: 'inline-block', width: 'calc(50% - 10px)', marginLeft: 10}}>
				<Card>
				    <CardTitle title="우리반" style={{paddingBottom: 0}}/>
				    <CardText style={{padding: 0}}>
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
			                </TableBody>
			            </Table>
				    </CardText>
				</Card>
    		</div>
    	)
    }
}

export default ClassCard;
