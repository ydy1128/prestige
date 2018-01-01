import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
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

class StudentTable extends React.Component{
	render(){
        const tableHeader = (
            <TableRow>
                <TableHeaderColumn style={styles.selectedCol}>{this.props.clicked.length+' 선택됨'} </TableHeaderColumn>
                <TableHeaderColumn>아이디</TableHeaderColumn>
                <TableHeaderColumn>이름</TableHeaderColumn>
                <TableHeaderColumn>수업</TableHeaderColumn>
                <TableHeaderColumn>학교</TableHeaderColumn>
                <TableHeaderColumn>학년</TableHeaderColumn>
            </TableRow>
        )
        const tableBody = data => {
            return data.map((stdobj, i) => {
                return(
                    <TableRow selected={this.props.clicked.includes(i)} key={stdobj._id}>
                        <TableRowColumn style={styles.tableButtonCol}><FontAwesome onClick={this.props.handleInfoOpen} className={'edit-button'} name="pencil" /></TableRowColumn>
                        <TableRowColumn style={styles.tableButtonCol}><FontAwesome onClick={this.props.handlePassOpen} className={'password-button'} name="lock" /></TableRowColumn>
                        <TableRowColumn>{stdobj.username}</TableRowColumn>
                        <TableRowColumn>{stdobj.name}</TableRowColumn>
                        <TableRowColumn>{stdobj.class == '' ? '-' : this.props.searchClassNameById(stdobj.class)}</TableRowColumn>
                        <TableRowColumn>{stdobj.school}</TableRowColumn>
                        <TableRowColumn>{stdobj.level}학년</TableRowColumn>
                    </TableRow>
                );
            });
        };

		return (
            <Table style={styles.table} 
                    onCellClick={this.props.searchOpen ? this.props.handleFilteredRowClick : this.props.handleRowClick} 
                    fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                    { tableHeader }
                </TableHeader>
                <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                   { tableBody(this.props.searchOpen ? (this.props.searchText == '' ? this.props.studentsData : this.props.filteredData) : this.props.studentsData) }
                </TableBody>
            </Table>
		)
	}
}
let styles = {
    selectedCol: {
        fontSize: '12px',
        width: '130px',
    },
    tableButtonCol: {
        width: '65px',
        fontSize: "18px", 
        cursor: "pointer"
    },
    table: {
        border: '1px solid #d3d3d3'
    }
};

export default StudentTable;