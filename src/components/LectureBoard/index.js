import React from "react";
import container from './Container';

import FontAwesome from 'react-fontawesome';

import LectureTable from './LectureTable';
import LectureDialog from './LectureDialog';


let Present = ({ props, state, style, functions }) => {
	let { classData } = props;
	let { dialogOpen, dialogEditMode, clicked } = state;
	let {openDialog,
		 closeDialog,
		 openEditMode,
		 closeEditMode,
		 onClassChange,

	} = functions;
    const boardHeader = (
        <div className="Board-header col m12">
            <div className="col m4"><h4>강의관리</h4></div>
            <div className="icons col m8">
                <a>
                    <FontAwesome className={'remove-button right '} name="trash-o" />
                </a>
                <a onClick={openDialog}>
                    <FontAwesome className={'plus-button right '} name="plus" />
                </a>
            </div>
        </div>
    )
    return (
        <div className="Boards">
            { boardHeader }
            <div className="Board-contents row">
                <div className="col m12">
                	<LectureTable />
                </div>
            </div>
            <LectureDialog open={dialogOpen} editMode={dialogEditMode} classData={classData}
            			   handleOpen={openDialog} handleClose={closeDialog} 
            			   openEditMode={openEditMode} closeEditMode={closeEditMode}
            			   onClassChange={onClassChange}/>
        </div>
    )
	
}

export default container(Present)