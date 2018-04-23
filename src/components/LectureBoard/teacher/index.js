import React from "react";
import container from './Container';

import FontAwesome from 'react-fontawesome';

import LectureTable from './LectureTable';
import LectureDialog from './LectureDialog';
import BoardHeader from 'components/commons/BoardHeader';
import DeleteDialog from './DeleteDialog';


let Present = ({ props, state, style, functions }) => {
	let { classData, lectureData } = props;
	let { dialogOpen, deleteDialogOpen, dialogEditMode, clicked, currObj, newOne, editlec, remove_active, filteredClick, searchOpen, searchText, searchResult } = state;
	let {openDialog,
         closeDialog,
         toggleDeleteDialog,
		 openEditMode,
		 closeEditMode,
         searchClassNameById,
         searchStudentNameById,
         onClassChange,
         onInputChange,
         handleDialogDataChange,
         handlePost,
         handleEdit,
         handleRemove,
         handleRowClick,
         focusSearchInput,
         blurSearchInput,
         onSearchEngineChange,
         handleFilteredRowClick
	} = functions;
    let getRemoveActive = (plus)=>{
        if(plus)
            return remove_active? 'inactive' : '';
        else
            return remove_active ? '' : 'inactive';
    }
    let removeLectures = ()=>{
        for(let i = 0; i < clicked.length; i++){
            console.log(i, ' : ', lectureData[clicked[i]].name, clicked[i])
            handleRemove(lectureData[clicked[i]]._id, clicked[i]);
            lectureData.splice(clicked[i], 1);
            for(let j = i; j < clicked.length; j++){
                if(clicked[j] > clicked[i])
                    clicked[j]--;
            }
        }
        closeDialog();
    }
    return (
        <div className="Boards">
            <BoardHeader title='강의관리' remove_active={remove_active} handleRemove={toggleDeleteDialog.bind(undefined, true)}
                            plus_button={true} remove_button={true} search_engine={true} searchOpen={searchOpen}
                            openDialog={openDialog.bind(undefined, true, true)} handleActive={getRemoveActive}
                            onSearchEngineChange={onSearchEngineChange} 
                            focusSearchInput={focusSearchInput} blurSearchInput={blurSearchInput} />
            <div className="Board-contents row">
                <div className="col m12 boardTable">
                	<LectureTable lectureData={lectureData} filteredData={searchResult} 
                              searchOpen={searchOpen} searchText={searchText} 
                              clicked={clicked} filteredClick={filteredClick}
                              handleDialogOpen={openDialog} searchClassNameById={searchClassNameById}
                              handleRowClick={handleRowClick} handleFilteredRowClick={handleFilteredRowClick}
                              />
                </div>
            </div>
            <LectureDialog open={dialogOpen} editMode={dialogEditMode} newOne={newOne} 
                           currObj={currObj} classData={classData} editlec={editlec}
            			   handleOpen={openDialog} handleClose={closeDialog} 
            			   openEditMode={openEditMode} closeEditMode={closeEditMode} 
                           searchClassNameById={searchClassNameById} searchStudentNameById={searchStudentNameById}
            			   onClassChange={onClassChange} onInputChange={onInputChange} handleChange={handleDialogDataChange}
                           handlePost={handlePost} handleEdit={handleEdit}/>

            <DeleteDialog dialogOn={deleteDialogOpen} objNum={clicked.length} closeDialog={toggleDeleteDialog.bind(undefined, false)}
                          deleteFunction={removeLectures}  />
        </div>
    )
	
}

export default container(Present)