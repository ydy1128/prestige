import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

// SUBCOMPONENTS
import HomeworkTable from './HomeworkTable';
import HomeworkBoard from './HomeworkBoard';
import DeleteDialog from './DeleteDialog';
import BoardHeader from 'components/commons/BoardHeader';

import Comments from '../Comments';
import { log } from "util";

let homeworkBoard = null;

var Present = ({ props, state, style, functions }) => {
    let { hwData } = props;
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
    
    const tableButtons = [
        <a onClick={toggleDeleteDialog(true)} style={{float: 'right'}}>
            <FontAwesome className={'right ' +( filteredClick.length ? '' : 'inactive')} name="trash-o" />
        </a>,
        <a onClick={onClickCreateHomework} style={{float: 'right'}}>
            <FontAwesome className={'right '} name="plus" />
        </a>
    ];

    const boardButtons = [
        <a onClick={closeBoard} style={{float: 'right'}}>
            <FontAwesome className={'right '} name="arrow-left" />
        </a>,
        <a onClick={(e) => {homeworkBoard.updateHomework(selectedHwIndex); closeBoard();}} style={{float: 'right'}}>
            <FontAwesome className={'right '} name="upload" />
        </a>    
    ];
    let selectedHw = hwData[selectedHwIndex] ? hwData[selectedHwIndex] : null ;

    if(selectedHw) console.log(selectedHw , selectedHw.comments)

    console.log(filteredClick);
    
    return (
        <div className="Boards" id='homework-section'>
            <BoardHeader title='숙제관리' 
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
                    <div className="col m12">
                        <HomeworkBoard key={Math.random()*1000000}
                            onRef={(ref) => {homeworkBoard = ref}}
                            hw={selectedHw}
                            selectedHwIndex={selectedHwIndex}
                            homeworkEditRequest={homeworkEditRequest}
                            isNewHomework= {isNewHomework}
                        />
                        <Comments key={selectedHw._id} hwId={selectedHw._id} comments={selectedHw ? selectedHw.comments : null}/>
                    </div>
                    :
                    <div className="col m12">
                        <HomeworkTable 
                        hwData={searchResult.length || searchText? searchResult : hwData}
                            clickedRowIndexes={filteredClick}
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
