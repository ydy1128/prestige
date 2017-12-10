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
    return (
        <div id='homework-section'  style={styles.main}>
            <div id='homework-header' style={styles.header}>
                <div id='homework-title' style={styles.title}><h4>숙제관리</h4></div>
                <div id='homework-buttons' style={styles.buttons}>
                <div onClick={onClickCreateHomework}>
                    <FontAwesome
                        style={styles.button} name="plus" />
                </div>
                <div onClick={(e)=>{ deleteHomeworks()}}>
                    <FontAwesome
                        style={styles.button} name="trash-o" />
                </div>
                </div>
            </div>
            <div id='homework-header' style={styles.body}>
                <HomeworkTable hwData={hwData}
                    clickedRowIndexes={clickedRowIndexes}
                    handleRowSelection={handleRowSelection}
                    onClickEditHomework={onClickEditHomework}
                />
            </div>
            <HomeworkDialog key={Math.random()*1000000}
                hw={selectedHw} dialogOn={dialogOn} closeDialog={closeDialog} homeworkPostRequest={homeworkPostRequest}/>
        </div>
    )
}

export default contain(Present)
