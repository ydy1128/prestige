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
        this.state = {
            loadIndex: 0,
            loadedArray: [],
        }
    }
    componentDidMount(){
        let loadedArray = this.props.lectureData.slice(0, 20);
        console.log(loadedArray)
        this.setState({loadedArray: loadedArray, loadIndex: 20});

        let tble = $('.boardTable div:nth-child(1) div:nth-child(2) table');
        let win = $('.boardTable div:nth-child(1)')
        let containerBottom = win.offset().top + win.height();
        $('.boardTable div:nth-child(1) div:nth-child(2)').scroll(() => {
            let tableBottom = tble.offset().top + tble.height();
            if(containerBottom > tableBottom && this.state.loadedArray.length > 19){
                this.loadData();
            }
        });
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.lectureData != undefined && this.state.loadedArray != undefined)
            this.setState({loadIndex: 20, loadedArray: this.props.lectureData.slice(0, 20)})
    }
    loadData(){
        let loadIndex = this.state.loadIndex;
        let lastIndex = (loadIndex+10) > this.props.lectureData.length ? this.props.lectureData.length : loadIndex+10;
        console.log(loadIndex)
        let loadedArray = [...this.state.loadedArray, ...this.props.lectureData.slice(loadIndex, lastIndex)];
        loadIndex = (loadIndex+10) > this.props.lectureData.length ? this.props.lectureData.length : loadIndex += 10;
        if(loadIndex - 1 < this.props.lectureData.length)
            this.setState({loadIndex: loadIndex, loadedArray: loadedArray});
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
                if(lecture.accomplishments != undefined && lecture.accomplishments.length > 0){
                    lecture.accomplishments.map((a, i) =>{
                        acc += a.accomplishments;
                    })
                    acc /= lecture.accomplishments.length;
                    acc = acc.toFixed(2);
                }
                return(
                    <TableRow selected={this.props.searchStart ? this.props.filteredClick.includes(i) : this.props.clicked.includes(i)} key={lecture._id}>
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
                    onCellClick={this.props.searchStart ? this.props.handleFilteredRowClick : this.props.handleRowClick} 
                    fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={false}>
                    { tableHeader }
                </TableHeader>
                <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                   { tableBody(this.props.searchStart ? (this.props.searchText == '' ? this.state.loadedArray : this.props.filteredData) : this.state.loadedArray) }
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