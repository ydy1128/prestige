import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

// SUBCOMPONENTS
import HomeworkTable from './HomeworkTable';
import HomeworkBoard from './HomeworkBoard';
import DeleteDialog from './DeleteDialog';
import BoardHeader from 'components/commons/BoardHeader';

import Comments from './Comments';
import { log } from "util";

let homeworkBoard = null;

var Present = ({ props, state, style, functions }) => {
    let { hwData, userInfo } = props;
    let { 
            boardOn,
            deleteDialogOn, 
            selectedHwIndex,            
            searchOpen,
            searchText,
            searchResult,
            filteredClick,
            isNewHomework
        } = state;

    let {
            onClickCreateHomework,
            onClickEditHomework,
            homeworkEditRequest,
            deleteHomeworks,
            handleRowSelection,
            closeBoard,
            toggleDeleteDialog,
            focusSearchInput,
            blurSearchInput,
            onSearchEngineChange
        } = functions;
    let isTeacher = userInfo.role == 'teacher' ? true : false; 
    let tableButtons = [];
    let boardButtons = [
        <a onClick={closeBoard} style={{float: 'right'}}>
            <FontAwesome className={'right'} name="arrow-left" />
        </a>
    ];

    if (isTeacher) {
        tableButtons = [
            <a onClick={toggleDeleteDialog(true)} style={{float: 'right'}}>
                <FontAwesome className={'right ' +( filteredClick.length ? '' : 'inactive')} name="trash-o" />
            </a>,
            <a onClick={onClickCreateHomework} style={{float: 'right'}}>
                <FontAwesome className={'right '} name="plus" />
            </a>    
        ];
        boardButtons.push(
            <a onClick={(e) => {homeworkBoard.updateHomeworkByIndex(selectedHwIndex);}} style={{float: 'right'}}>
                <FontAwesome className={'right'} name="upload" />
            </a>
        );
    }

    let selectedHw = hwData[selectedHwIndex] ? hwData[selectedHwIndex] : null ;
    return (
        <div className="Boards" id='homework-section'>
            <BoardHeader title={isTeacher ? '숙제관리' : '숙제공지'} 
                homeworkButtons={boardOn ? boardButtons : tableButtons}
                search_engine={boardOn ? false : true}
                searchOpen={searchOpen}
                onSearchEngineChange={onSearchEngineChange}
                focusSearchInput={focusSearchInput} 
                blurSearchInput={blurSearchInput} 
            />
            <div className="Board-contents row">
                {   
                    boardOn ?
                    <div className="col m12" style={{marginTop: 20}}>
                        <HomeworkBoard key={Math.random()*1000000}
                            onRef={(ref) => {homeworkBoard = ref}}
                            hw={selectedHw}
                            selectedHwIndex={selectedHwIndex}
                            homeworkEditRequest={homeworkEditRequest}
                            isNewHomework={isNewHomework}
                            closeBoard={closeBoard}
                            userRole={userInfo.role}/>
                        <Comments 
                            key={selectedHw._id} 
                            homeworkId={selectedHw._id} />
                    </div> 
                    :
                    <div className="col m12"  style={{marginTop: 20}}>
                        <HomeworkTable 
                            hwData={searchResult.length || searchText? searchResult : hwData}
                            clickedRowIndexes={filteredClick}
                            handleRowSelection={handleRowSelection}
                            onClickEditHomework={onClickEditHomework}
                            userRole={userInfo.role}/>
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
