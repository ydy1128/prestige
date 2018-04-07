import React from 'react';
import { connect } from 'react-redux';

import {GridList, GridTile} from 'material-ui/GridList';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import FontAwesome from 'react-fontawesome';

import ColorStock from 'components/commons/ColorStock';

class MemoList extends React.Component{
    constructor(props){
        super(props);
		this.state = {
			colNum: 3
		}
		this.getColNum = this.getColNum.bind(this);
    }
	getColNum(){
		if(window.innerWidth < 630){
			this.setState({colNum: 1});
		}
		else if(window.innerWidth > 630 && window.innerWidth < 915){
			this.setState({colNum: 2});
		}
		else if(window.innerWidth > 915 && window.innerWidth < 1300){
			this.setState({colNum: 3});
		}
		else{
			this.setState({colNum: 4});
		}
	}
	componentDidMount(){
		this.getColNum();
		window.addEventListener("resize", this.getColNum);
	}
	clickEvent(event){
		event.stopPropagation();
		console.log('click event')
	}
	render(){
        const gridListBody = data => {
            return data.map((memo, i) => {
                return (
                    <GridTile
                        key={memo._id}
                        titlePosition="bottom"
                        titleBackground='rgba(0,0,0,0)'
                        style={{ backgroundColor: ColorStock[i % ColorStock.length], borderRadius: 3, cursor: 'pointer'}}
                        onClick={(event)=>{ this.props.toggleMode(1, i); }}
                    >
                        <div style={styles.infoDiv}>
                        	<h5 style={styles.infoH5}>
                                <Checkbox 
                                	name={memo._id + '-' + i}
                                    label={ <h5 style={{margin: '0', color: 'white'}}>{memo.name}</h5>} 
                                    checked={this.props.clicked.includes(i)} 
                                    onClick={this.props.handleClick.bind(undefined, this.props.clicked.includes(i))}
                                    style={{verticalAlignment:'middle'}}
                                    iconStyle={{fill: 'white'}}
                                    />
                        	</h5>
                			<IconMenu className="right" style={styles.menuButton} onClick={this.clickEvent}
								iconButtonElement={
									<div style={styles.menuButtonDiv}>
										<FontAwesome name="ellipsis-v" class="right" style={styles.infoMenu} />
									</div>}
								anchorOrigin={{horizontal: 'left', vertical: 'top'}}
								targetOrigin={{horizontal: 'left', vertical: 'top'}}
								>
								<MenuItem primaryText="수정" onClick={this.props.openDialog.bind(undefined, 0, i, true)} />
								<MenuItem primaryText="삭제" onClick={this.props.handleRemove.bind(undefined, memo._id, i)} />
						    </IconMenu>
                        </div>
                    </GridTile>
                );
            });
        };
		return(
            <GridList
                cols={this.state.colNum}
                cellHeight={130}
                padding={15}
            >
                { gridListBody( this.props.memoListData) }
            </GridList>
		)
	}
}
let styles = {
	infoDiv: {
		padding: '20px', 
		paddingTop: '15px'
	},
    infoH5: {
        overflowX: 'hidden', 
        overflowY: 'hidden', 
        whiteSpace: 'nowrap',
        display: 'inline-block',
        width: 'calc(100% - 30px)'
    },
    infoMenu: {
		width: 30, 
		height: 26,
		fontSize: 22, 
		textAlign: 'center', 
		display: 'inline-block',
		width: 30,
		color: 'white',
	},
	menuButton: {
		cursor: 'pointer',
	},
	menuButtonDiv: {
		margin: '10px 0',
	},
}
export default MemoList;