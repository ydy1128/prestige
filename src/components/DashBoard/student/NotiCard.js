import React from "react";
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
import {
	Card, 
	CardHeader,
	CardTitle,
	CardText
} from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';

import { getLoginData } from 'components/commons/SessionData';
import { lectureBoardRequest } from 'actions/lecture';
import { homeworkBoardRequest } from 'actions/homework';

class NotiCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadIndex: 0,
            fullArray: [],
            loadedArray: [],
        }
    }
    componentDidMount(){
		this.props.lectureBoardRequest().then(() =>{
            this.props.homeworkBoardRequest().then(() =>{
                let fullArray = [...this.props.lectureData, ...this.props.homeworkData]
                console.log(this.props.lectureData, this.props.homeworkData)
                let loadedArray = fullArray.slice(0, 20);

                if(loadedArray != undefined && loadedArray.length > 0)
                    this.setState({fullArray: fullArray, loadedArray: loadedArray, loadIndex: 20});

                let tble = $('#cardText > div');
                let win = $('#cardText');
                let containerBottom = win.offset().top + win.height() + 1;
                $('#cardText').scroll(() => {
                    let tableBottom = tble.offset().top + tble.height();
                    if(containerBottom > tableBottom && this.state.loadedArray.length > 19){
                        console.log('hit')
                        this.loadData();
                    }
                });
            })

		})

    }
    componentWillReceiveProps(nextProps){
    	console.log(nextProps.lectureData, nextProps.homeworkData)
        if(nextProps.lectureData != undefined && nextProps.homeworkData != undefined && 
            nextProps.lectureData.length > 0 && nextProps.homeworkData.length > 0){
        	let fullArray = [...nextProps.lectureData, ...nextProps.homeworkData];
            fullArray.sort((a, b) =>{
                let date = new Date();

                let aNum = a.dueDate == undefined ? a.date : a.dueDate;
                let aDate = a.dueDate == undefined ? new Date(aNum) : new Date(parseInt(aNum));
                if (a.dueDate == undefined) aDate = new Date(aDate.getDate() + 7);
                let bNum = b.dueDate == undefined ? b.date : b.dueDate;
                let bDate = b.dueDate == undefined ? new Date(bNum) : new Date(parseInt(bNum));
                if (b.dueDate == undefined) bDate = new Date(bDate.getDate() + 7);
                return aDate - bDate;
            })
            this.setState({loadIndex: 20, loadedArray: fullArray.slice(0, 20), fullArray: fullArray})
        }
    }
    loadData(){
        let loadIndex = this.state.loadIndex;
        let lastIndex = (loadIndex+10) > this.state.fullArray.length ? this.state.fullArray.length : loadIndex+10;
        let loadedArray = [...this.state.loadedArray, ...this.state.fullArray.slice(loadIndex, lastIndex)];
        loadIndex = (loadIndex+10) > this.state.fullArray.length ? this.state.fullArray.length : loadIndex += 10;
        if(loadIndex - 1 < this.state.fullArray.length)
            this.setState({loadIndex: loadIndex, loadedArray: loadedArray});
    }
    render(){
    	const tableBody = (data) =>{
    		return data.map((obj, i) =>{
                let isLecture = obj.dueDate == undefined;
                let date = isLecture ? new Date(obj.date) : new Date(parseInt(obj.dueDate));
                let expiryDate = new Date();
                let checkDate = isLecture ? new Date(obj.date) : new Date(parseInt(obj.dueDate));
                if(isLecture)
                    checkDate.setDate(date.getDate() + 7);
         
                    
                if(checkDate >= expiryDate){
            		return(
    		            <TableRow key={obj._id}>
    		                <TableRowColumn>{isLecture ? '강의' : '숙제'}</TableRowColumn>
    		                <TableRowColumn>{isLecture ? obj.name : obj.title}</TableRowColumn>
    		                <TableRowColumn>{date.toLocaleDateString()}</TableRowColumn>
    		            </TableRow>
    	            );
                }
        	})
    	}
    	return(
    		<div style={{display: 'inline-block', width: 'calc(50% - 10px)', marginRight: 10}}>
    			<style>{"\
    				.cardui>div{\
    					height: 100%;\
    				}\
    			"}
    				
    			</style>
				<Card className="cardui" style={{height: '100%'}}>
				    <CardTitle title="알림" titleColor="white" style={{backgroundColor: '#86272d'}}/>
				    <CardText id="cardText" style={{padding: 0, overflow: 'auto', height: 'calc(100% - 68px)'}}>
			            <Table  
			                    fixedHeader={true} fixedFooter={true} selectable={false} multiSelectable={false}>
			                <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
					            <TableRow>
					                <TableHeaderColumn>종류</TableHeaderColumn>
					                <TableHeaderColumn>학습률</TableHeaderColumn>
					                <TableHeaderColumn>등록/제출 날짜</TableHeaderColumn>
					            </TableRow>
			                </TableHeader>
			                <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
			                {
			                	tableBody(this.state.loadedArray)
			                }
			                </TableBody>
			            </Table>
				    </CardText>
				</Card>
    		</div>
    	)
    }
}

let styles = {
    datePickerStyle: {
        cursor: 'default', 
        width: '120px', 
        height: '20px', 
        fontSize: '13px'
    },
}

const mapDispatchToProps = (dispatch) => {
    return {
		lectureBoardRequest: () => {
            return dispatch(lectureBoardRequest());
        },
        homeworkBoardRequest: (id) => {
            return dispatch(homeworkBoardRequest(id));
        },
    }
}

const mapStateToProps = (state) => {
    return {
        lectureData: state.lecture.board.data,
        homeworkData: state.homework.board.data,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiCard);