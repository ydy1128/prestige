import React from "react";
import FontAwesome from 'react-fontawesome';

import DatePicker from 'material-ui/DatePicker';
import CircularProgress from 'material-ui/CircularProgress';

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
    constructor(props){
        super(props);
    }
	render(){
        const tableHeader = (
            <TableRow>
                <TableHeaderColumn style={styles.tableButtonCol}></TableHeaderColumn>
                <TableHeaderColumn>제목</TableHeaderColumn>
                <TableHeaderColumn>수업</TableHeaderColumn>
                <TableHeaderColumn>학습률</TableHeaderColumn>
                <TableHeaderColumn>날짜</TableHeaderColumn>
            </TableRow>
        )
        const tableBody = data => {
            return data.map((lecture, i) => {
                let acc = 0;
                lecture.accomplishments.map((a, i) =>{
                    acc += a.accomplishments;
                })
                acc /= lecture.accomplishments.length;
                acc = acc.toFixed(2);
                return(
                    <TableRow selected={this.props.searchOpen ? this.props.filteredClick.includes(i) : this.props.clicked.includes(i)} key={lecture._id}>
                        <TableRowColumn style={styles.tableButtonCol}><FontAwesome onClick={this.props.handleDialogOpen.bind(undefined, false, false, i)} className={'edit-button'} name="pencil" /></TableRowColumn>
                        <TableRowColumn>{lecture.name}</TableRowColumn>
                        <TableRowColumn>{this.props.searchClassNameById(lecture.class)}</TableRowColumn>
                        <TableRowColumn><CircularProgress style={styles.progress} mode="determinate" value={parseFloat(acc)} size={20} thickness={4} />{acc + '%'}</TableRowColumn>
                        <TableRowColumn><DatePicker id={'tp'+lecture._id} value={new Date(lecture.date)} textFieldStyle={styles.datePickerStyle} disabled={true} /></TableRowColumn>
                    </TableRow>
                );
            });
        };

		return (
            <Table  style={styles.table} 
                    onCellClick={this.props.searchOpen ? this.props.handleFilteredRowClick : this.props.handleRowClick} 
                    fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                    { tableHeader }
                </TableHeader>
                <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                   { tableBody(this.props.searchOpen ? (this.props.searchText == '' ? this.props.lectureData : this.props.filteredData) : this.props.lectureData) }
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
let styles = {
    tableButtonCol: {
        width: '65px',
        fontSize: "18px", 
        cursor: "pointer"
    },
    table: {
        border: '1px solid #d3d3d3'
    },
    datePickerStyle: {
        cursor: 'default', 
        width: '120px', 
        height: '20px', 
        fontSize: '13px'
    },
    progress: {
        verticalAlign: 'middle', 
        marginRight: '10px'
    }
};
export default LectureTable;