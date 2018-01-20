import React, {Component} from 'react';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import FontAwesome from 'react-fontawesome';

const style = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
  button: {
      fontSize: '18px',
  },
  row: {
    button: {
      width: "66px",
    },
    title: {
      width: "50%",
    },
    date: {
      width: "124px",

    },
  }
};

export default class TableExampleComplex extends Component {
  constructor(props){
    super(props);
    this.state = {
      fixedHeader: false,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: true,
      enableSelectAll: false,
      deselectOnClickaway: false,
      showCheckboxes: true,
      height: 'null',
    };

    this._makeRows = this._makeRows.bind(this);

  }

  handleToggle(event, toggled) {
    this.setState({
      [event.target.name]: toggled,
    });
  };


  render() {
    return (
      <div>
        <Paper zDepth={1} rounded={false}>
          <Table
            height={this.state.height}
            fixedHeader={this.state.fixedHeader}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
            onRowSelection={this.props.handleRowSelection}
          >
            <TableHeader
              displaySelectAll={this.state.showCheckboxes}
              adjustForCheckbox={this.state.showCheckboxes}
              enableSelectAll={this.state.enableSelectAll}
            >
              <TableRow>
                <TableHeaderColumn style={style.row.button}></TableHeaderColumn>
                <TableHeaderColumn style={style.row.title}>제목</TableHeaderColumn>
                <TableHeaderColumn style={style.row.date}>제출기한</TableHeaderColumn>
                <TableHeaderColumn style={style.row.date}>작성일자</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={this.state.showCheckboxes}
              deselectOnClickaway={this.state.deselectOnClickaway}
              showRowHover={this.state.showRowHover}
              stripedRows={this.state.stripedRows}
            >
              {this._makeRows()}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  _makeRows(){
    let hwData = this.props.hwData;
    let tableRows = [];

    hwData.map((rowData, index) => {
      console.log(rowData);
      let {
        _id, title, content, dueDate, writtenDate, modifiedDate, teacherId
      } = rowData;
      let readableDate = new Date(parseInt(dueDate));
      let readableWrittenDate = new Date(parseInt(writtenDate));

      tableRows.push(
        <TableRow selected={this.props.clickedRowIndexes.includes(index)} key={index}>
          <TableRowColumn>
            <FontAwesome
              style={style.button} onClick={this.props.onClickEditHomework(index)} name="pencil" />
          </TableRowColumn>
          <TableRowColumn>{title}</TableRowColumn>
          <TableRowColumn>{readableDate.toLocaleDateString()}</TableRowColumn>
          <TableRowColumn>{readableWrittenDate.toLocaleDateString()}</TableRowColumn>
        </TableRow>
      );
    });

    return tableRows
  }
}
