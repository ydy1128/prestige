import React from "react";
import container from './Container';

import FontAwesome from 'react-fontawesome';

import BoardHeader from 'components/commons/BoardHeader';
import NotiCard from './NotiCard';
import ClassCard from './ClassCard';


let Present = ({ props, state, style, functions }) => {
	let { classData, lectureData, homeworkData } = props;
	let {  } = state;
	let {
	} = functions;
	return(
		<div className="Boards">
            <BoardHeader title='대시보드' />
            <div className="Board-contents row">
                <div className="col m12 boardTable">
                	<NotiCard />
                	<ClassCard />
                </div>
            </div>
		</div>
	);
}

let styles = {
	boardHeader: {
		backgroundColor: 'white',
		borderBottom: '2px solid #d3d3d3',
		color: '#939393'
	},
	boardTitle: {
		width: '200px',
		textAlign: 'center'
	},
	boardTitleText: {
		margin: '20px 0'
	},
	boardIcons: {
		width: 'calc(100% - 200px)'
	},
	searchEngine: {
		position: 'absolute',
		right: 0,
		height: '55px',
		margin: '10px 10px -20px -20px',
		padding: '0 10px'
	}
}

export default container(Present)