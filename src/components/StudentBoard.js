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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { StudentObj } from 'components';

class StudentBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            open: false,
            editidx: -1,
            editstd: {
                _id: '',
                username: '',
                name: '',
                school: '',
                level: ''
            },
            clicked: [],
            remove_active: false
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleRemove = this.handleRemove.bind(this);

        this.onRowClick = this.onRowClick.bind(this);
        this.getRemoveActive = this.getRemoveActive.bind(this);
	}
    handleOpen(e){
        e.stopPropagation();
        let target_id = e.currentTarget.parentNode.parentNode.childNodes[2].innerHTML;
        let target_idx = this.props.studentsData.findIndex(x => { return x.username == target_id; });
        let target_obj = this.props.studentsData[target_idx];
        this.setState({open: true, editidx: target_idx, editstd: target_obj})
    }
    handleChange(e) {
        let nextState = {
            editstd: this.state.editstd
        };
        nextState.editstd[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    handleEdit(){
        this.props.onStudentEdit(this.state.editstd, this.state.editidx, false);
        this.handleClose();
    }
    handleClose(){
        this.setState({open: false, editidx: -1, editstd: {_id: '',username: '',name: '',school: '',level: ''}, clicked: [] })
    }
    handleRemove(){
        if(this.state.remove_active){
            let clicked = [...this.state.clicked];
            let deleting_stds = [];
            let editting_classes = {};
            for (let i = 0; i < clicked.length; i++){
                let stdidx = clicked[i];
                let std_id = this.props.studentsData[stdidx]._id;
                let std_class = this.props.studentsData[stdidx].class;
                if(std_class != ''){
                    if(editting_classes[std_class] == undefined){
                        editting_classes[std_class] = [];
                    }
                    editting_classes[std_class].push(std_id);
                }
                deleting_stds.push({index: stdidx, id: std_id});
            }
            for(let i = 0; i < deleting_stds.length; i++){
                this.props.onStudentRemove(deleting_stds[i].index, deleting_stds[i].id).then(()=>{ console.log(this.props.studentsData)});
                for(let j = 0; j < deleting_stds.length; j++){
                    deleting_stds[j].index -= 1;
                }
            }
            for (let key in editting_classes) {
                let classidx = this.props.classData.findIndex(x => { return x.name == key; });
                let class_obj = this.props.classData[classidx];
                for(let i = 0; i < editting_classes[key].length; i++){
                    let std_list_in_class = class_obj.students;
                    let std_class_idx = std_list_in_class.indexOf(editting_classes[key][i]);
                    std_list_in_class.splice(std_class_idx, 1);
                }
                this.props.onClassEdit(class_obj._id, classidx, class_obj).then(()=>{ console.log(this.props.classData)});
            }
        }
    }
    onRowClick(rowNumber, columnId){
        let clicked = [...this.state.clicked];
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        console.log(clicked)
        this.state.clicked = clicked;
        this.state.remove_active = clicked.length == 0 ? false : true;
        this.getRemoveActive();
    }
    getRemoveActive(){
        if(this.state.remove_active)
            $('#stdBoardRemove').removeClass('inactive');
        else
            $('#stdBoardRemove').addClass('inactive');
    }
    render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4>학생관리</h4></div>
                <div className="icons col m8">
                    <a onClick={this.handleRemove}>
                        <FontAwesome id="stdBoardRemove" className={'remove-button right inactive'} name="trash-o" />
                    </a>
                </div>
            </div>
        )
        const mapToComponents = data => {
            return data.map((stdobj, i) => {
                return(
                    <TableRow key={stdobj._id}>
                        <TableRowColumn><FontAwesome onClick={this.handleOpen} className={'edit-button'} name="pencil" style={{fontSize: "18px", cursor: "pointer"}}/></TableRowColumn>
                        <TableRowColumn>{stdobj.username}</TableRowColumn>
                        <TableRowColumn>{stdobj.name}</TableRowColumn>
                        <TableRowColumn>{stdobj.class == '' ? '-' : stdobj.class}</TableRowColumn>
                        <TableRowColumn>{stdobj.school}</TableRowColumn>
                        <TableRowColumn>{stdobj.level}학년</TableRowColumn>
                    </TableRow>
                );
            });
        };
        const actions = [
            <FlatButton
                label="취소"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="저장"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleEdit}
            />,
        ];
        return(
            <div className="Boards">
                { boardHeader }
                <div className="Board-contents row">
                    <div className="col m12">
                        <Table style={{border: '1px solid #d3d3d3'}} onCellClick={this.onRowClick} fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                            <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                                <TableRow>
                                    <TableHeaderColumn></TableHeaderColumn>
                                    <TableHeaderColumn>아이디</TableHeaderColumn>
                                    <TableHeaderColumn>이름</TableHeaderColumn>
                                    <TableHeaderColumn>수업</TableHeaderColumn>
                                    <TableHeaderColumn>학교</TableHeaderColumn>
                                    <TableHeaderColumn>학년</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={true} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                               {mapToComponents(this.props.studentsData)}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <Dialog
                    title="학생관리"
                    modal={false}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={false}>
                    <TextField floatingLabelText="아이디" name="username" onChange={this.handleChange} value={this.state.editstd.username} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                    <TextField floatingLabelText="이름" name="name" onChange={this.handleChange} value={this.state.editstd.name} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                    <TextField floatingLabelText="학교" name="school" onChange={this.handleChange} value={this.state.editstd.school} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                    <TextField floatingLabelText="학년" name="level" onChange={this.handleChange} value={this.state.editstd.level} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                </Dialog>
            </div>
        )
    }
}

let style = {
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
  inputLabelFocus: {
    color: "#00bcd4",
    fontSize: "18px",
    fontWeight: "600"
  }
};


StudentBoard.propTypes = {
    studentsData: React.PropTypes.array,
}
StudentBoard.defaultProps = {
    studentsData: [],
}
export default StudentBoard;
