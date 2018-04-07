import React from "react";
import container from './Container';

import FontAwesome from 'react-fontawesome';

import BoardHeader from 'components/commons/BoardHeader';

import MemoList from './MemoList';
import MemoDialog from './MemoDialog';
import MemoGroups from './MemoGroups';


let Present = ({ props, state, style, functions }) => {
	let { memoListData, memoGroupData } = props;
	let { dialogOpen, dialogMode, dialogEditMode, remove_active, clicked, currList, currGroup, currMemo } = state;
	let {
		getMemoGroup,
		openDialog,
		closeDialog,
		toggleMode,
		backAction,
		handleDialogDataChange,
		handlePost,
		handleEdit,
		handleRemove,
		handleListClick,
	} = functions;
	let getView = () => {
		switch (dialogMode){
			case 0:
				return (
                	<MemoList memoListData={memoListData} memoGroupData={memoGroupData}
		                	currList={currList} currGroup={currGroup}
                			clicked={clicked}
                			handleClick={handleListClick} 
                			openDialog={openDialog} toggleMode={toggleMode} handleRemove={handleRemove}
                	/>
				)
			case 1:
			case 2:
				return(
					<MemoGroups currList={currList} currGroup={currGroup} currMemo={currMemo}
							getMemoGroup={getMemoGroup} memoGroupData={memoGroupData}
							openDialog={openDialog} toggleMode={toggleMode} handleRemove={handleRemove}
					 />
					
					
				)
		}
	}
    let getRemoveActive = (plus)=>{
        if(plus)
            return remove_active? 'inactive' : '';
        else
            return remove_active ? '' : 'inactive';
    }
	let getData = () => {
		switch (dialogMode){
			case 0:
				return currList;
			case 1:
				return currGroup;
			case 2:
				break;
		}

	}
	let handleRemoveRequest = () => {
		switch(dialogMode){
			case 0:
			
				for(let i = 0; i < clicked.length; i++){
					let index = clicked[i];
					// console.log(clicked[i], memoListData[clicked[i]]);
					handleRemove(memoListData[index]._id, index);
					setTimeout(() => {
						for(let j = 0; j < memoGroupData.lenght; j++)
							if(memoGroupData[j].memoList == memoListData[index]._id)
								handleRemove(memoGroupData[j]._id, j);
					}, 100)

						
				}
				break;
		}
	}
	return(
		<div className="Boards">
            <BoardHeader title='대시보드' remove_active={remove_active} 
                            plus_button={true} back_button={dialogMode == 0 ? false : true} remove_button={dialogMode == 0 ? true : false}
                            openDialog={openDialog.bind(undefined, dialogMode, undefined, false)} backAction={backAction} handleActive={getRemoveActive}
                            handleRemove={handleRemoveRequest}
                            />

			<div className="Board-contents row">
                <div className="col m12 boardTable">
	                { getView() }
                </div>
            </div>
            <MemoDialog open={dialogOpen} handleClose={closeDialog} mode={dialogMode} editMode={dialogEditMode}
            			currList={currList} currGroup={currGroup} currMemo={currMemo}
            			handleDialogDataChange={handleDialogDataChange.bind('text')} 
            			handlePost={handlePost} handleEdit={handleEdit}
            			/>
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