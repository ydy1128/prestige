import React from "react";
import container from './Container';

import FontAwesome from 'react-fontawesome';

import LectureTable from './LectureTable';
import LectureDialog from './LectureDialog';
import BoardHeader from 'components/commons/BoardHeader';


let Present = ({ props, state, style, functions }) => {
	let { classData, lectureData } = props;
	let { dialogOpen, dialogEditMode, clicked, currObj, newOne, editlec, remove_active, filteredClick, searchOpen, searchText, searchResult } = state;
	let {openDialog,
		 closeDialog,
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
    // const boardHeader = (
    //     <div className="Board-header col m12">
    //         <div className="col m4"><h4>강의관리</h4></div>
    //         <div className="icons col m8">
    //             <a onClick={remove_active ? removeLectures : null}>
    //                 <FontAwesome className={'remove-button right '+ getRemoveActive(false)} name="trash-o" />
    //             </a>
    //             <a onClick={remove_active ? null : openDialog.bind(undefined, true, true)}>
    //                 <FontAwesome className={'plus-button right '+ getRemoveActive(true)} name="plus" />
    //             </a>

    //         </div>
    //     </div>
    // )
    return (
        <div className="Boards">
            <BoardHeader title='강의관리' remove_active={remove_active} handleRemove={handleRemove}
                            plus_button={true} remove_button={true} search_engine={true}
                            openDialog={openDialog.bind(undefined, true, true)} handleActive={getRemoveActive}
                            onSearchEngineChange={onSearchEngineChange} blurSearchInput={blurSearchInput} />
            <div className="Board-contents row">
                <div className="col m12">
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
        </div>
    )
	
}

export default container(Present)