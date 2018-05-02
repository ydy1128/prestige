import React from 'react';
import { connect } from 'react-redux';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import FontAwesome from 'react-fontawesome';

import ColorStock from 'components/commons/ColorStock';


class MemoGroups extends React.Component{
    constructor(props){
        super(props);
		this.state = {
			clickedMemos: [],

		}
		this.onMemoClick = this.onMemoClick.bind(this);
		this.handlePost = this.handlePost.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
    }
    componentDidMount(){
    	this.props.getMemoGroup(this.props.currList._id)
    }
    onMemoClick(groupIndex, memoIndex, event){
    	event.stopPropagation();
		let clickedMemos = [...this.state.clickedMemos];
		let index = clickedMemos.findIndex((e) => { return e == memoIndex });
		if(index == -1)
			clickedMemos.push(memoIndex);
		else
			clickedMemos.splice(index, 1);
		this.setState({clickedMemos: clickedMemos});
    }
    handleRemove(groupIndex){
    	console.log(groupIndex)
    	let clickedMemos = this.state.clickedMemos;
    	console.log(clickedMemos)
    	for(var i = 0; i < clickedMemos.length; i++){
    		let memoIndex = clickedMemos[i];
    		let memo = this.props.memoGroupData[groupIndex].memos[memoIndex];
    		this.props.toggleMode(2, memoIndex);
    		// setTimeout(() => {
    			this.props.handleRemove(memo._id, memoIndex);
    		// }, 100);
    	}
    	this.setState({clickedMemos: []})
    }
    handlePost(index){
    	this.props.toggleMode(1, index); 
    	setTimeout(()=>{
    		this.props.openDialog(2, undefined, false, undefined)
    	}, 100)
    }
    render(){
    	const listBody = data => {
    		console.log("in memoGroup: ", data)
            return data.map((memogroup, i) => {
                return (
                	<div key={"memogroup" + i} style={styles.memogroup}>
                		<div style={styles.memogroupTitle}>
                			{memogroup.name}
                			<IconMenu className="right" style={styles.menuButton}
								iconButtonElement={<div style={styles.menuButtonDiv}><FontAwesome name="ellipsis-v" /></div>}
								anchorOrigin={{horizontal: 'left', vertical: 'top'}}
								targetOrigin={{horizontal: 'left', vertical: 'top'}}
								>
								<MenuItem primaryText="수정" onClick={this.props.openDialog.bind(undefined, 1, i, true)}/>
								<MenuItem primaryText="메모추가"  onClick={this.handlePost.bind(undefined, i)}/>
								<MenuItem primaryText="메모삭제" onClick={() => {this.props.toggleMode(1, i); setTimeout(()=>{console.log('timeout'); this.handleRemove(i)}, 100)}} />
								<MenuItem primaryText="그룹삭제" onClick={this.props.handleRemove.bind(undefined, memogroup._id, i)}/>
						    </IconMenu>
                			
                		</div>
                		<div style={styles.memos}>{
                			memogroup.memos.map((memo, j) =>{
                				let dontDispTop = memo.dueDate == '' && memo.label == '-1';
                				return(
                					<div key={'memo-' + i + '-' + j} style={styles.memo} onClick={() => {this.props.toggleMode(1, i); setTimeout(()=>{this.props.openDialog(2, j, true, undefined)}, 100)}}>
                						<div style={styles.memoTop}>
                							<div style={styles.memoTopquarter}>
                								<Checkbox 
				                                	name={memo._id + i +'-' + j}
				                                	checked={this.state.clickedMemos.includes(j)}
				                                	onClick={this.onMemoClick.bind(undefined, i, j)}
				                                    style={{marginTop: -5}}
				                                    iconStyle={{width: 20, height: 20}}
				                                    />
                							</div>
                							{dontDispTop ? null : 
	                							<div style={styles.memoTopquarter}>
	                								<div style={{width: '100%', height: '100%', borderRadius: 5, backgroundColor: memo.label == '-1' ? 'none' : ColorStock[parseInt(memo.label)]}}></div>
	                							</div>
	                						}
	                						{dontDispTop ? null : 
	                							<div style={styles.memoTophalf}>{
	                								memo.dueDate == '' ?'' : 
	                								<div> 
	                									<FontAwesome name="clock-o" style={{width: 15, height: 15, fontSize: 15}} />
	                									{' ' + memo.dueDate}
	            									</div>}
	                							</div>
	                						}
                						</div>
                						<div style={{wordWrap: 'break-word',marginTop: dontDispTop ? 0 : 10}}>{memo.text}</div>
                					</div>
                				)
                			})
                		}</div>
                		<div style={styles.addDiv} onClick={this.handlePost.bind(undefined, i)}>
                			+ 메모 추가
                		</div>
                	</div>
                );
            });            	
    	}

    	return(

    		<div style={styles.memogroups} >
    			<h5 style={styles.memoListName}>
    				{this.props.currList.name}
    			</h5>
    			<div style={{height: 'calc(100% - 36px)', overflowX: 'auto',}}>
    				{listBody(this.props.memoGroupData == undefined ? [] : this.props.memoGroupData)}
				</div>
    		</div>
    	)
    }
}


let styles = {
	memoListName: {
		marginTop: 0,
		paddingLeft: 15,
	},
	memogroups: {
		whiteSpace: 'nowrap',	
		padding: '10px 0',
		overflow: 'hidden',
	},
	memogroup: {
		display: 'inline-block',
		width: '30%',
		height: 'calc(100% - 10px)',
		backgroundColor: '#FFFFFF',
		borderRadius: 3,
		marginRight: 20,
		verticalAligh: 'top'
	},
	memogroupTitle: {
		paddingLeft: 15,
		paddingTop: 10,
		height: 40,
		fontSize: 18,
		color: '#939393',
	},
	menuButton: {
		cursor: 'pointer',
	},
	menuButtonDiv: {
		padding: '0 15px',

	},
	memos: {
		height: 'calc(100% - 70px)',
	},
	memo: {
		margin: "5px 15px",
		padding: "5px 10px",
		backgroundColor: "#F4EBEC",
		borderRadius: 3,
		cursor: 'pointer',

	},
	memoTop: {
		height: 10,
		margin: "0 0 2.5px 0",
	},
	memoTophalf: {
		display: 'inline-block',
		width: '50%',
		height: '100%',
		fontSize: 12,
		color: '#939393'
	},
	memoTopquarter: {
		display: 'inline-block',
		width: '20%',
		height: '100%',
		marginRight: '5%'
	},
	addDiv: {
		color: '#939393',
		paddingLeft: 15,
		cursor: 'pointer',

	}
}

export default MemoGroups;