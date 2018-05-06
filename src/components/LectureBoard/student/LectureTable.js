import React from "react";
import FontAwesome from 'react-fontawesome';

import DatePicker from 'material-ui/DatePicker';

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
            this.setState({loadedIndex: 20, loadedArray: this.props.lectureData.slice(0, 20)})
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
                <TableHeaderColumn>제목</TableHeaderColumn>
                <TableHeaderColumn>수업</TableHeaderColumn>
                <TableHeaderColumn>학습률</TableHeaderColumn>
                <TableHeaderColumn>날짜</TableHeaderColumn>
            </TableRow>
        )
        const tableBody = data => {
            return data.map((lecture, i) => {
                return(
                    <TableRow key={lecture._id + i}>
                        <TableRowColumn>{lecture.name}</TableRowColumn>
                        <TableRowColumn>{this.props.searchClassNameById(lecture.class)}</TableRowColumn>
                        <TableRowColumn>{lecture.accomplishments.reduce((acc, obj)=>{return obj.accomplishments;}, 0) + '%'}</TableRowColumn>
                        <TableRowColumn><DatePicker id={'tp'+lecture._id} value={new Date(lecture.date)} textFieldStyle={styles.datePickerStyle}  disabled={true} /></TableRowColumn>
                    </TableRow>
                );
            });
        };

        return (
            <Table  style={styles.table} 
                    onCellClick={this.props.handleDialogOpen} 
                    fixedHeader={true} fixedFooter={true} selectable={false} multiSelectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                    { tableHeader }
                </TableHeader>
                <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
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
    }
};

export default LectureTable;