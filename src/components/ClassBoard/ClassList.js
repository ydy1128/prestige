import React from 'react';
import { connect } from 'react-redux';

import {GridList, GridTile} from 'material-ui/GridList';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

class ClassList extends React.Component{
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
	handleData(index, event){
		this.props.processData(index, event);
	}

	render(){

        const gridListBody = data => {
            return data.map((cls, i) => {
                return (
                    <GridTile
                        key={cls._id}
                        titlePosition="bottom"
                        titleBackground='rgba(0,0,0,0)'
                        style={styles.grid}
                    >
                        <div style={{padding: '20px', paddingTop: '15px', borderTop: '10px solid ' + color_stock[i % color_stock.length]}}>
                            <div>
                                <h5 style={styles.infoDiv}>
                                    <Checkbox 
                                    	name={cls._id + '-' + i}
                                        label={<h5 style={{margin: '0'}}>{cls.name}</h5>} 
                                        checked={this.props.searchStart ? this.props.filteredClick.includes(i) : this.props.clicked.includes(i)} 
                                        onCheck={this.props.searchStart ? this.props.handleFilteredClick : this.props.handleClick}
                                        style={{verticalAlignment:'middle'}}/>
                                    
                                </h5>
                                <p style={{margin: '5px'}}>{cls.days}</p>
                                <p style={{margin: '5px'}}>{cls.startTime} ~ {cls.endTime}</p>
                            </div>
                            <div style={styles.gridButtonsDiv} className="row" >
                                <div className="col s6" style={{padding: '0'}} onClick={this.handleData.bind(this, i)}>
                                    <FlatButton label='학생관리' fullWidth={true} onClick={this.props.openStudentMode} labelStyle={{fontSize: '15px', fontFamily: 'HYSUPM'}} style={{height: '54px'}}/>
                                </div>
                                <div className="col s6" style={{padding: '0'}} onClick={this.handleData.bind(this, i)}>
                                    <FlatButton label='수업관리' fullWidth={true} onClick={this.props.openClassMode} labelStyle={{fontSize: '15px', fontFamily: 'HYSUPM'}} style={{height: '54px'}}/>
                                </div>                                    
                            </div>
                        </div>
                    </GridTile>
                );
            });
        };
		return(
            <GridList
                cols={this.state.colNum}
                cellHeight={200}
                padding={15}
            >
                { gridListBody( this.props.searchStart ? (this.props.searchText == '' ? this.props.classData : this.props.filteredData) : this.props.classData) }
            </GridList>
		)
	}
}

ClassList.propTypes = {
    data: React.PropTypes.array,
};

ClassList.defaultProps = {
    data: []
}
const color_stock = ['#e57373', '#7986cb', '#26a69a', '#ffee58', '#8d6e63', '#f48fb1', '#64b5f6', '#66bb6a', '#ffd54f', '#bdbdbd', '#ce93d8', '#81d4fa', '#aed581', '#ffb74d', '#90a4ae']

let styles = {
    grid: {
        backgroundColor: 'white',
        border: '1px solid #d3d3d3',
    },
    infoDiv: {
        overflowX: 'hidden', 
        overflowY: 'hidden', 
        whiteSpace: 'nowrap'
    },
    gridButtonsDiv: {
        margin: '25px -20px 0 -20px', 
        borderTop: '1px solid #d3d3d3'
    }
}

export default ClassList;