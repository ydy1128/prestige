import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

// style
import getStyleWith from './style';

// SUBCOMPONENTS
import HomeworkTable from './HomeworkTable';
import HomeworkBoard from './HomeworkBoard';
import DeleteDialog from './DeleteDialog';

import Comments from '../Comments';

let homeworkBoard = null;

var Present = ({ props, state, style, functions }) => {
    let styles = getStyleWith(props) // Do not modify!!
    let { hwData } = props;
    let { boardOn, clickedRowIndexes, selectedHw, deleteDialogOn, selectedHwIndex} = state;
    let {
        onClickCreateHomework,
        onClickEditHomework,
        homeworkPostRequest,
        homeworkEditRequest,
        deleteHomeworks,
        handleRowSelection,
        closeBoard,
        toggleDeleteDialog
    } = functions;
    console.log("hwdata", hwData);
    
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
        <a onClick={(e) => {console.log(homeworkBoard); homeworkBoard.updateHomework()}}>
            <FontAwesome id="stdBoardRemove" className={'remove-button right '} name="upload" />
        </a>    
    ];
    
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
    return (
        <div className="Boards" id='homework-section'>
            { boardHeader }
            <div className="Board-contents row">
                {   
                    boardOn ?
                    <div className="col m12">
                        <HomeworkBoard key={Math.random()*1000000}
                            onRef={(ref) => {homeworkBoard = ref}}
                            hw={selectedHw}
                            selectedHwIndex={selectedHwIndex}
                            closeBoard={closeBoard}
                            homeworkPostRequest={homeworkPostRequest}
                            homeworkEditRequest={homeworkEditRequest}
                        />      
                        <Comments />
                    </div>
                    :
                    <div className="col m12">
                        <HomeworkTable hwData={hwData}
                            clickedRowIndexes={clickedRowIndexes}
                            handleRowSelection={handleRowSelection}
                            onClickEditHomework={onClickEditHomework}
                        />
                    </div>
                    
                }
            </div>
            <DeleteDialog key={Math.random()*1000000}
                dialogOn={deleteDialogOn}
                closeDialog={toggleDeleteDialog(false)}
                deleteHomeworks={deleteHomeworks}
            />
        </div>
    )
}
export default contain(Present)
