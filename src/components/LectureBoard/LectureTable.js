import React from "react";

import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

class LectureTable extends React.Component{
	render(){
        const tableHeader = (
            <TableRow>
                <TableHeaderColumn>제목</TableHeaderColumn>
                <TableHeaderColumn>수업</TableHeaderColumn>
                <TableHeaderColumn>학습률</TableHeaderColumn>
                <TableHeaderColumn>날짜</TableHeaderColumn>
            </TableRow>
        )
        const tableBody = data => {
            return data.map((stdobj, i) => {
                return(
                    <TableRow selected={this.props.clicked.includes(i)} key={stdobj._id}>
                        <TableRowColumn>제목</TableRowColumn>
                        <TableRowColumn>수업</TableRowColumn>
                        <TableRowColumn>학습률</TableRowColumn>
                        <TableRowColumn>날짜</TableRowColumn>
                    </TableRow>
                );
            });
        };

		return (
            <Table  
                    onRowSelection={null} onCellClick={null} 
                    fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                    { tableHeader }
                </TableHeader>
                <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                   { tableBody(this.props.lectureData) }
                </TableBody>
            </Table>
		)
	}


}
LectureTable.propTypes = {
    lectureData: React.PropTypes.array,
}

LectureTable.defaultProps = {
    lectureData: [],
}

export default LectureTable;