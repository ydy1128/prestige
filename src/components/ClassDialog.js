import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import TimePicker from 'material-ui/TimePicker';
import CustomTimePicker from './commons/CustomTimePicker'

import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

class ClassDialog extends React.Component{
    constructor(props){
        super(props);
        // this.onCellClick = this.onCellClick.bind(this);
    }
    onCellClick(type, rowNum, colId){
    	this.props.onCellClick(type, rowNum, colId)
    }
	render(){
		const classMode = (
			<div>
                <TextField floatingLabelText="반 이름" fullWidth={true} 
                			name="name" value={this.props.data.name} 
                			onChange={this.props.handleDataChange}
                			floatingLabelStyle={styles.inputLabel} floatingLabelFocusStyle={styles.inputLabelFocus} 
                			underlineStyle={styles.inputLine} underlineFocusStyle={styles.inputLineFocus}
                			/>
                <div className="col m12" style={{paddingTop: '20px', paddingBottom: '20px'}}>
                	<Checkbox style={{display: 'inline-block', width: '12%'}} onCheck={this.props.handleDataChange}
                			  name="월" label={<h6>월</h6>} checked={this.props.data.days['월']}/>
                	<Checkbox style={{display: 'inline-block', width: '12%'}} onCheck={this.props.handleDataChange}
                			  name="화" label={<h6>화</h6>} checked={this.props.data.days['화']}/>
                	<Checkbox style={{display: 'inline-block', width: '12%'}} onCheck={this.props.handleDataChange}
                			  name="수" label={<h6>수</h6>} checked={this.props.data.days['수']}/>
                	<Checkbox style={{display: 'inline-block', width: '12%'}} onCheck={this.props.handleDataChange}
                			  name="목" label={<h6>목</h6>} checked={this.props.data.days['목']}/>
                	<Checkbox style={{display: 'inline-block', width: '12%'}} onCheck={this.props.handleDataChange}
                			  name="금" label={<h6>금</h6>} checked={this.props.data.days['금']}/>
                	<Checkbox style={{display: 'inline-block', width: '12%'}} onCheck={this.props.handleDataChange}
                			  name="토" label={<h6>토</h6>} checked={this.props.data.days['토']}/>
                	<Checkbox style={{display: 'inline-block', width: '12%'}} onCheck={this.props.handleDataChange}
                			  name="일" label={<h6>일</h6>} checked={this.props.data.days['일']}/>
                </div>
                <CustomTimePicker label="시작 시간" labelStyle={styles.inputLabelSmall} name="startTime" onTimeChange={this.props.handleDataChange} value={this.props.data.startTime}/>
                <CustomTimePicker label="마침 시간" labelStyle={styles.inputLabelSmall} name="endTime" onTimeChange={this.props.handleDataChange} value={this.props.data.endTime}/>
            </div>
		);

        const mapToComponents = (data, type) => {
            return data.map((stdobj, i) => {
                return(
                    <TableRow key={stdobj._id} selected={this.props[type].includes(i)}>
                        <TableRowColumn>{stdobj.name}</TableRowColumn>
                        <TableRowColumn>{stdobj.school}</TableRowColumn>
                        <TableRowColumn>{stdobj.level}학년</TableRowColumn>
                    </TableRow>
                )
            });
        };

		const studentMode = (
        		<div className="row Students-list">
                    <div className="col s6">
                        <Table style={{border: '1px solid #d3d3d3'}} height={'300px'} onCellClick={this.onCellClick.bind(this, 'clickedInAllStudents')} fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                            <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                                <TableRow>
                                    <TableHeaderColumn colSpan="3" style={{textAlign: 'center'}}>
                                        전체 학생
                                    </TableHeaderColumn>
                                </TableRow>
                                <TableRow>
                                    <TableHeaderColumn>이름</TableHeaderColumn>
                                    <TableHeaderColumn>학교</TableHeaderColumn>
                                    <TableHeaderColumn>학년</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                               {mapToComponents(this.props.allStudents, 'clickedInAllStudents')}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableRowColumn colSpan="3" style={{textAlign: 'right'}}>
                                        <a className="right waves-effect waves-green btn-flat" onClick={this.props.addToClass}><FontAwesome name="plus" /> 추가</a>
                                    </TableRowColumn>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    <div className="col s6">
                        <Table style={{border: '1px solid #d3d3d3'}} height={'300px'} onCellClick={this.onCellClick.bind(this, 'clickedInSelectedStudents')} fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                            <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                                <TableRow>
                                    <TableHeaderColumn colSpan="3" style={{textAlign: 'center'}}>
                                        반 학생
                                    </TableHeaderColumn>
                                </TableRow>
                                <TableRow>
                                    <TableHeaderColumn>이름</TableHeaderColumn>
                                    <TableHeaderColumn>학교</TableHeaderColumn>
                                    <TableHeaderColumn>학년</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                               {mapToComponents(this.props.selectedStudents, 'clickedInSelectedStudents')}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableRowColumn colSpan="3" style={{textAlign: 'right'}}>
                                        <a className="right waves-effect waves-green btn-flat"onClick={this.props.removeFromClass}><FontAwesome name="minus" /> 제거</a>
                                    </TableRowColumn>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
		)
        const actions = [
            <FlatButton
                label="취소"
                primary={true}
                onClick={this.props.handleClose}
            />,
            <FlatButton
                label="저장"
                primary={true}
                onClick={this.props.newClass? this.props.handlePost : null}
            />,
        ];
		return(
            <Dialog
                title={this.props.mode ? '수업관리' : '학생관리'}
                modal={false}
                actions={actions}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                autoScrollBodyContent={false}
                >

            	{this.props.mode ? classMode : studentMode}
            </Dialog>
		)
	}
}

let styles = {
	inputLine: {
		borderBottom: "1px solid #bdbdbd"
	},
	inputLineFocus:{
		borderBottom: "2px solid #00bcd4"
	},
	inputLabel: {
		color: "#bdbdbd",
		fontSize: "18px",
		fontWeight: "600"
	},
	inputLabelSmall: {
		color: "#bdbdbd",
		fontWeight: "600"
	},
	inputLabelFocus: {
		color: "#00bcd4",
		fontSize: "18px",
		fontWeight: "600"
	},
}
export default ClassDialog;