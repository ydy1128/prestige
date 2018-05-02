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

class NotiCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadIndex: 0,
            loadedArray: [],
        }
    }
    componentDidMount(){
		this.props.lectureBoardRequest().then(() =>{
	        let loadedArray = this.props.lectureData.slice(0, 20);
	        console.log(loadedArray)
	        if(loadedArray != undefined && loadedArray.length > 0)
		        this.setState({loadedArray: loadedArray, loadIndex: 20});

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

    }
    componentWillReceiveProps(nextProps){
    	console.log(nextProps.lectureData, this.state.loadedArray)
        if(nextProps.lectureData != undefined && nextProps.lectureData.length > 0){
        	console.log('in')
        	console.log(this.state.loadIndex, this.props.lectureData.slice(0, 20))
            this.setState({loadIndex: 20, loadedArray: this.props.lectureData.slice(0, 20)})
        }
    }
    loadData(){
        let loadIndex = this.state.loadIndex;
        let lastIndex = (loadIndex+10) > this.props.lectureData.length ? this.props.lectureData.length : loadIndex+10;
        let loadedArray = [...this.state.loadedArray, ...this.props.lectureData.slice(loadIndex, lastIndex)];
        loadIndex = (loadIndex+10) > this.props.lectureData.length ? this.props.lectureData.length : loadIndex += 10;
        if(loadIndex - 1 < this.props.lectureData.length)
            this.setState({loadIndex: loadIndex, loadedArray: loadedArray});
    }
    render(){
    	const tableBody = (data) =>{
    		return data.map((obj, i) =>{
        		return(
		            <TableRow key={obj._id}>
		                <TableRowColumn>강의</TableRowColumn>
		                <TableRowColumn>{obj.name}</TableRowColumn>
		                <TableRowColumn><DatePicker id={'tp'+obj._id} value={new Date(obj.date)} textFieldStyle={styles.datePickerStyle} disabled={true} /></TableRowColumn>
		            </TableRow>
	            );
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
    }
}

const mapStateToProps = (state) => {
    return {
        lectureData: state.lecture.board.data,
        homeworkData: state.homework.board.data,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiCard);