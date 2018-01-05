import React from "react";
import container from './Container';

import FontAwesome from 'react-fontawesome';

import LectureTable from './LectureTable';
import LectureDialog from './LectureDialog';


let Present = ({ props, state, style, functions }) => {
	let { classData, lectureData } = props;
	let { dialogOpen, dialogEditMode, clicked, currObj, newOne, editlec, remove_active } = state;
	let {openDialog,
		 closeDialog,
		 openEditMode,
		 closeEditMode,
         searchClassNameById,
		 onClassChange,
         handleDialogDataChange,
         handlePost,
         handleEdit,
         handleRemove,
         handleRowClick,
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
    const boardHeader = (
        <div className="Board-header col m12">
            <div className="col m4"><h4>강의관리</h4></div>
            <div className="icons col m8">
                <a onClick={remove_active ? removeLectures : null}>
                    <FontAwesome className={'remove-button right '+ getRemoveActive(false)} name="trash-o" />
                </a>
                <a onClick={remove_active ? null : openDialog.bind(undefined, true, true)}>
                    <FontAwesome className={'plus-button right '+ getRemoveActive(true)} name="plus" />
                </a>

            </div>
        </div>
    )
    return (
        <div className="Boards">
            { boardHeader }
            <div className="Board-contents row">
                <div className="col m12">
                	<LectureTable lectureData={lectureData} clicked={clicked}
                                  handleDialogOpen={openDialog} searchClassNameById={searchClassNameById}
                                  handleRowClick={handleRowClick}
                                  />
                </div>
            </div>
            <LectureDialog open={dialogOpen} editMode={dialogEditMode} newOne={newOne} 
                           currObj={currObj} classData={classData} editlec={editlec}
            			   handleOpen={openDialog} handleClose={closeDialog} 
            			   openEditMode={openEditMode} closeEditMode={closeEditMode} 
                           searchClassNameById={searchClassNameById}
            			   onClassChange={onClassChange} handleChange={handleDialogDataChange}
                           handlePost={handlePost} handleEdit={handleEdit}/>
        </div>
    )
	
}

export default container(Present)