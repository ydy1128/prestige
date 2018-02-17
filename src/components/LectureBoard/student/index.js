import React from "react";
import container from './Container';

import FontAwesome from 'react-fontawesome';

import LectureTable from './LectureTable';
import LectureDialog from './LectureDialog';

let Present = ({ props, state, style, functions }) => {
	let { classData, lectureData } = props;
	let { dialogOpen, currObj } = state;
	let {
		searchClassNameById,
		openDialog,
		closeDialog,
        handleEdit,
        onAccChange,
	} = functions;


    const boardHeader = (
        <div className="Board-header col m12">
            <div className="col m4"><h4>강의게시판</h4></div>
            <div className="icons col m8">
            </div>
        </div>
    )
	return(
        <div className="Boards">
            { boardHeader }
            <div className="Board-contents row">
                <div className="col m12 boardTable">
                	<LectureTable lectureData={lectureData} 
                                  handleDialogOpen={openDialog} searchClassNameById={searchClassNameById}
                                  handleRowClick={null}
                                  />
                </div>
            </div>
            <LectureDialog handleOpen={openDialog} handleClose={closeDialog} onAccChange={onAccChange} handleEdit={handleEdit}
			            open={dialogOpen} currObj={currObj} lectureData={lectureData} />
        </div>
    	)
}

export default container(Present)