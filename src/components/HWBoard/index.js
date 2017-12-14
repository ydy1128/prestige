import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

// style
import getStyleWith from './style';

// SUBCOMPONENTS
import HomeworkTable from './HomeworkTable';
import HomeworkDialog from './HomeworkDialog';

var Present = ({ props, state, style, functions }) => {
    let styles = getStyleWith(props) // Do not modify!!
    let { hwData } = props;
    let { dialogOn, clickedRowIndexes, selectedHw} = state;
    let {
        onClickCreateHomework,
        onClickEditHomework,
        homeworkPostRequest,
        deleteHomeworks,
        handleRowSelection,
        closeDialog
    } = functions;
    console.log("hwdata", hwData);
    const boardHeader = (
        <div className="Board-header col m12">
            <div className="col m4"><h4>숙제관리</h4></div>
            <div className="icons col m8">
                <a onClick={(e)=>{ deleteHomeworks()}}>
                    <FontAwesome id="stdBoardRemove" className={'remove-button right ' +( !!clickedRowIndexes.length ? '' : 'inactive')} name="trash-o" />
                </a>
                <a onClick={onClickCreateHomework} >
                    <FontAwesome id="stdBoardRemove" className={'remove-button right '} name="plus" />
                </a>
            </div>
        </div>
    )
    return (
        <div className="Boards" id='homework-section'>
            { boardHeader }
             <div className="Board-contents row">
                <div className="col m12">
                <HomeworkTable hwData={hwData}
                    clickedRowIndexes={clickedRowIndexes}
                    handleRowSelection={handleRowSelection}
                    onClickEditHomework={onClickEditHomework}
                    />
                </div>
            </div>
            <HomeworkDialog key={Math.random()*1000000}
                hw={selectedHw} dialogOn={dialogOn} closeDialog={closeDialog} homeworkPostRequest={homeworkPostRequest}/>
        </div>
    )
}

export default contain(Present)
