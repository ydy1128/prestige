import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

// SUBCOMPONENTS
// import HomeworkTable from './HomeworkTable';
// import HomeworkBoard from './HomeworkBoard';

import Comments from '../Comments';
import { log } from "util";

let homeworkBoard = null;

var Present = ({ props, state, style, functions }) => {
    let { hwData } = props;
    let { boardOn, clickedRowIndexes, deleteDialogOn, selectedHwIndex} = state;
    let {
        onClickCreateHomework,
        onClickEditHomework,
        homeworkEditRequest,
        deleteHomeworks,
        handleRowSelection,
        closeBoard,
        toggleDeleteDialog
    } = functions;
    
    const tableButtons = [
        <a onClick={toggleDeleteDialog(true)}>
            <FontAwesome id="stdBoardRemove" className={'remove-button right ' +( !!clickedRowIndexes.length ? '' : 'inactive')} name="trash-o" />
        </a>,
        <a onClick={onClickCreateHomework} >
            <FontAwesome id="stdBoardRemove" className={'remove-button right '} name="plus" />
        </a>
    ];

    const boardButtons = [
        <a onClick={closeBoard}>
            <FontAwesome id="stdBoardRemove" className={'remove-button right '} name="arrow-left" />
        </a>,
        <a onClick={(e) => {homeworkBoard.updateHomework(selectedHwIndex); closeBoard();}}>
            <FontAwesome id="stdBoardRemove" className={'remove-button right '} name="upload" />
        </a>    
    ];
    let selectedHw = hwData[selectedHwIndex] ? hwData[selectedHwIndex] : null ;

    const boardHeader = (
        <div className="Board-header col m12">
            <div className="col m4"><h4>숙제관리</h4></div>
            <div className="icons col m8">
                {
                    boardOn ? boardButtons : tableButtons 
                }
            </div>
        </div>
    )

    if(selectedHw) console.log(selectedHw , selectedHw.comments)
    return (
        <div className="Boards" id='homework-section'>
            { boardHeader }
            <div className="Board-contents row">
                {/*  
                    boardOn ?
                    <div className="col m12">
                        <HomeworkBoard key={Math.random()*1000000}
                            onRef={(ref) => {homeworkBoard = ref}}
                            hw={selectedHw}
                            selectedHwIndex={selectedHwIndex}
                            homeworkEditRequest={homeworkEditRequest}
                        />
                        <Comments key={selectedHw._id} hwId={selectedHw._id} comments={selectedHw ? selectedHw.comments : null}/>
                    </div>
                    :
                    <div className="col m12">
                        <HomeworkTable hwData={hwData}
                            clickedRowIndexes={clickedRowIndexes}
                            handleRowSelection={handleRowSelection}
                            onClickEditHomework={onClickEditHomework}
                        />
                    </div>
                */}
            </div>
        </div>
    )
}
export default contain(Present)
