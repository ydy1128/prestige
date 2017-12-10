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
                level: '',
                password: '',
                check_password: ''
            },
            clicked: [],
            remove_active: false,
            modal_state: true
        }
        // this.handleOpen = this.handleOpen.bind(this);
        this.handleInfoOpen = this.handleInfoOpen.bind(this);
        this.handlePassOpen = this.handlePassOpen.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handlePwChange = this.handlePwChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleRemove = this.handleRemove.bind(this);

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);

        this.handleActive = this.handleActive.bind(this);
	}

    handleInfoOpen(e){
        e.stopPropagation();
        let target_id = e.currentTarget.parentNode.parentNode.childNodes[3].innerHTML;
        let target_idx = this.props.studentsData.findIndex(x => { return x.username == target_id; });
        let target_obj = this.props.studentsData[target_idx];
        console.log(target_obj)
        this.setState({open: true, editidx: target_idx, editstd: target_obj, modal_state: true})
    }
    handlePassOpen(e){
        e.stopPropagation();
        let target_id = e.currentTarget.parentNode.parentNode.childNodes[3].innerHTML;
        let target_idx = this.props.studentsData.findIndex(x => { return x.username == target_id; });
        let target_obj = this.props.studentsData[target_idx];
        target_obj.password = '';
        target_obj.check_password = '';
        this.setState({open: true, editidx: target_idx, editstd: target_obj, modal_state: false})
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
    handlePwChange(){
        this.props.onStudentPwChange(this.state.editstd._id, this.state.editstd.password, this.state.editstd.check_password);
        this.handleClose();
    }
    handleClose(){
        this.setState({
            open: false, 
            editidx: -1, 
            editstd: {_id: '',username: '',name: '',school: '',level: '', password: '', check_password: ''}, 
            clicked: [] 
        })
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
    handleRowClick(rowNumber, columnId){
        let clicked = [...this.state.clicked];
        let index = clicked.indexOf(rowNumber);
        if(index == -1)
            clicked.push(rowNumber);
        else
            clicked.splice(index, 1);
        console.log(clicked)
        this.setState({clicked: clicked, remove_active: clicked.length == 0 ? false : true})
    }
    handleRowSelection(rowIds){
        this.setState({clicked: rowIds})
    }
    handleActive(){
        return this.state.remove_active ? '' : 'inactive';
    }
    render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4>학생관리</h4></div>
                <div className="icons col m8">
                    <a onClick={this.handleRemove}>
                        <FontAwesome id="stdBoardRemove" className={'remove-button right ' + this.handleActive()} name="trash-o" />
                    </a>
                </div>
            </div>
        )
        const mapToComponents = data => {
            return data.map((stdobj, i) => {
                return(
                    <TableRow selected={this.state.clicked.includes(i)} key={stdobj._id}>
                        <TableRowColumn style={style.tableButtonCol}><FontAwesome onClick={this.handleInfoOpen} className={'edit-button'} name="pencil" style={{fontSize: "18px", cursor: "pointer"}}/></TableRowColumn>
                        <TableRowColumn style={style.tableButtonCol}><FontAwesome onClick={this.handlePassOpen} className={'password-button'} name="lock" style={{fontSize: "18px", cursor: "pointer"}}/></TableRowColumn>
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
                label={this.state.modal_state? '저장' : '변경'}
                primary={true}
                onClick={this.state.modal_state? this.handleEdit : this.handlePwChange}
            />,
        ];
        const infoDialog = (
            <div>
                <TextField floatingLabelText="아이디" name="username" onChange={this.handleChange} value={this.state.editstd.username} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                <TextField floatingLabelText="이름" name="name" onChange={this.handleChange} value={this.state.editstd.name} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                <TextField floatingLabelText="학교" name="school" onChange={this.handleChange} value={this.state.editstd.school} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                <TextField floatingLabelText="학년" name="level" onChange={this.handleChange} value={this.state.editstd.level} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
            </div>
        )
        const passDialog = (
            <div>
                <TextField floatingLabelText="아이디" name="username" disabled value={this.state.editstd.username} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                <TextField floatingLabelText="이름" name="name" disabled value={this.state.editstd.name} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                <TextField floatingLabelText="새 패스워드" name="password" type="password" value={this.state.editstd.password} onChange={this.handleChange} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
                <TextField floatingLabelText="패스워드 확인" name="check_password" type="password" value={this.state.editstd.check_password} onChange={this.handleChange} fullWidth={true} floatingLabelStyle={style.inputLabel} floatingLabelFocusStyle={style.inputLabelFocus} underlineStyle={style.inputLine} underlineFocusStyle={style.inputLineFocus}/>
            </div>
        )
        return(
            <div className="Boards">
                { boardHeader }
                <div className="Board-contents row">
                    <div className="col m12">
                        <Table style={{border: '1px solid #d3d3d3'}} onRowSelection={this.handleRowSelection} onCellClick={this.handleRowClick} fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true}>
                            <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>
                                <TableRow>
                                    <TableHeaderColumn style={style.tableButtonCol}></TableHeaderColumn>
                                    <TableHeaderColumn style={style.tableButtonCol}></TableHeaderColumn>
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
                    title={this.state.modal_state? '학생 정보' : '학생 비밀번호 변경'}
                    modal={false}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={false}>
                    {this.state.modal_state? infoDialog : passDialog}
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
  },
  tableButtonCol: {
    width: '65px',
  }
};


StudentBoard.propTypes = {
    studentsData: React.PropTypes.array,
}
StudentBoard.defaultProps = {
    studentsData: [],
}
export default StudentBoard;
