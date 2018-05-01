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
    constructor(props){
        super(props);
        this.state = {
            loadIndex: 0,
            loadedArray: [],
        }
        this.loadData = this.loadData.bind(this);
    }
    componentDidMount(){
        let loadedArray = this.props.studentsData.slice(0, 20);
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
        if(nextProps.studentsData != undefined && this.state.loadedArray != undefined)
            this.setState({loadedIndex: 20, loadedArray: this.props.studentsData.slice(0, 20)})
    }
    loadData(){
        let loadIndex = this.state.loadIndex;
        let lastIndex = (loadIndex+10) > this.props.studentsData.length ? this.props.studentsData.length : loadIndex+10;
        let loadedArray = [...this.state.loadedArray, ...this.props.studentsData.slice(loadIndex, lastIndex)];
        loadIndex = (loadIndex+10) > this.props.studentsData.length ? this.props.studentsData.length : loadIndex += 10;
        if(loadIndex - 1 < this.props.studentsData.length)
        this.setState({loadIndex: loadIndex, loadedArray: loadedArray});
    }
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
                    <TableRow selected={this.props.searchStart ? this.props.filteredClick.includes(i) : this.props.clicked.includes(i)} key={stdobj._id}>
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
            <Table style={styles.table} id="highest"
                    onCellClick={this.props.searchStart ? this.props.handleFilteredRowClick : this.props.handleRowClick} 
                    fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                    { tableHeader }
                </TableHeader>
                    <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                       { tableBody(this.props.searchStart ? (this.props.searchText == '' ? this.state.loadedArray : this.props.filteredData) : this.state.loadedArray) }
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