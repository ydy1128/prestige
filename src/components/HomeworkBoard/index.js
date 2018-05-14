import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

// SUBCOMPONENTS
import HomeworkTable from './HomeworkTable';
import EditHomeworkBoard from './EditHomeworkBoard';
import CreateHomeworkBoard from './CreateHomeworkBoard';
import DeleteDialog from './DeleteDialog';
import BoardHeader from 'components/commons/BoardHeader';

import { log } from "util";

let homeworkBoard = null;

var Present = ({ props, state, style, functions }) => {
    let { hwData, userInfo } = props;
    let { 
        createBoardOn,
        editBoardOn,
        deleteDialogOn, 
        selectedHwIndex,            
        searchOpen,
        searchText,
        searchResult,
        filteredClick,
    } = state;

    let {
        onClickCreateHomework,
        onClickEditHomework,
        homeworkEditRequest,
        homeworkPostRequest,
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
        <a onClick={(e)=>{closeBoard();}} style={{float: 'right'}}>
            <FontAwesome className={'right'} name={createBoardOn ? "close" : "arrow-left"} />
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
        if (createBoardOn) {
            boardButtons.push(
                <a onClick={(e) => { homeworkBoard.postHomework(); }} style={{float: 'right'}}>
                    <FontAwesome className={'right'} name="upload" />
                </a>
            );
        }

        if (editBoardOn) {
            boardButtons.push(
                <a onClick={(e) => { homeworkBoard.updateHomeworkByIndex(selectedHwIndex); }} style={{float: 'right'}}>
                    <FontAwesome className={'right'} name="upload" />
                </a>
            );
        }
    }
    let boardContent = null;

    let selectedHw = hwData[selectedHwIndex] ? hwData[selectedHwIndex] : null ;
    return (
        <div className="Boards" id='homework-section'>
            <BoardHeader title={isTeacher ? '숙제관리' : '숙제게시판'} screenType={'HWBOARD'} reload_button={true}
                homeworkButtons={createBoardOn || editBoardOn ? boardButtons : tableButtons}
                search_engine={createBoardOn || editBoardOn ? false : true}
                searchOpen={searchOpen}
                onSearchEngineChange={onSearchEngineChange}
                focusSearchInput={focusSearchInput} 
                blurSearchInput={blurSearchInput} 
            />
            <div className="Board-contents row">
                    {   
                        createBoardOn ?
                        <CreateHomeworkBoard key={Math.random()*1000000}
                            onRef={(ref) => {homeworkBoard = ref}}
                            hw={selectedHw}
                            selectedHwIndex={selectedHwIndex}
                            homeworkPostRequest={homeworkPostRequest}
                            closeBoard={closeBoard}
                            userInfo={userInfo}/>
                        : ( editBoardOn ? 
                        <EditHomeworkBoard key={Math.random()*1000000}
                            onRef={(ref) => {homeworkBoard = ref}}
                            hw={selectedHw}
                            selectedHwIndex={selectedHwIndex}
                            homeworkEditRequest={homeworkEditRequest}
                            closeBoard={closeBoard}
                            userInfo={userInfo}/>
                        :
                        <HomeworkTable 
                            hwData={searchResult.length || searchText? searchResult : hwData}
                            clickedRowIndexes={filteredClick}
                            handleRowSelection={handleRowSelection}
                            onClickEditHomework={onClickEditHomework}
                            userInfo={userInfo}/>
                        )  
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
