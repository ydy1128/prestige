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

class NotiCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
    	return(
    		<div style={{display: 'inline-block', width: '50%'}}>
    			NotiCard
    		</div>
    	)
    }
}

export default NotiCard;