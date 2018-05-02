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
    		<div style={{display: 'inline-block', width: '50%'}}>
    			ClassCard
    		</div>
    	)
    }
}

export default ClassCard;
