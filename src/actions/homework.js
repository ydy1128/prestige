import axios from 'axios';

import {
    HOMEWORK_BOARD,
    HOMEWORK_BOARD_SUCCESS,
    HOMEWORK_BOARD_FAILURE,
    HOMEWORK_POST,
    HOMEWORK_POST_SUCCESS,
    HOMEWORK_POST_FAILURE,
    HOMEWORK_EDIT_PREP,
    HOMEWORK_EDIT,
    HOMEWORK_EDIT_SUCCESS,
    HOMEWORK_EDIT_FAILURE,
    HOMEWORK_REMOVE,
    HOMEWORK_REMOVE_SUCCESS,
    HOMEWORK_REMOVE_FAILURE
} from './ActionTypes';


/* Homework Board */
export function homeworkBoardRequest(isInitial, listType, id, username) {
    return (dispatch) => {
        dispatch(homeworkBoard());

        let url = '/api/homework';

        return axios.get(url)
        .then((response) => {
            console.log("response",response);
            dispatch(homeworkBoardSuccess(response.data, isInitial, listType));
        }).catch((error) => {
            dispatch(homeworkBoardFailure());
        });
    };
}

export function homeworkBoard() {
    return {
        type: HOMEWORK_BOARD
    };
}

export function homeworkBoardSuccess(data, isInitial, listType) {
    return {
        type: HOMEWORK_BOARD_SUCCESS,
        data,
        isInitial,
        listType
    };
}

export function homeworkBoardFailure() {
    return {
        type: HOMEWORK_BOARD_FAILURE
    };
}

/*Homework Post*/
export function homeworkPostRequest(contents) {
    return (dispatch) => {
        dispatch(homeworkPost());

        return axios.post('/api/homework', { contents })
        .then((response) => {
            console.log(response.data.homework)
            dispatch(homeworkPostSuccess(response.data.homework));
        }).catch((error) => {
            dispatch(homeworkPostFailure(error.response.data.homework));
        });
    };
}

export function homeworkPost() {
    return {
        type: HOMEWORK_POST
    };
}

export function homeworkPostSuccess(data) {
    return {
        type: HOMEWORK_POST_SUCCESS,
        data
    };
}

export function homeworkPostFailure(error) {
    return {
        type: HOMEWORK_POST_FAILURE,
        error
    };
}

/* Homework Edit */
// export function homeworkEditPrep(name, days, starttime, endtime, index, _id, students, flag){
//     return {
//         type: HOMEWORK_EDIT_PREP,
//         name,
//         days,
//         starttime,
//         endtime,
//         index,
//         _id,
//         students,
//         flag
//     };
// }

export function homeworkEditRequest(id, index, contents) {
    return (dispatch) => {
        dispatch(homeworkEdit());

        return axios.put('/api/homework/' + id, { contents })
        .then((response) => {
            dispatch(homeworkEditSuccess(index, response.data.homework));
        }).catch((error) => {
            dispatch(homeworkEditFailure(error.response.data.code));
            alert(error.response.data.error);
        });
    };
}

export function homeworkEdit() {
    return {
        type: HOMEWORK_EDIT
    };
}

export function homeworkEditSuccess(index, cls) {
    return {
        type: HOMEWORK_EDIT_SUCCESS,
        index,
        cls
    };
}

export function homeworkEditFailure(error) {
    return {
        type: HOMEWORK_EDIT_FAILURE,
        error
    };
}

/* HOMEWORK REMOVE */
export function homeworkRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(homeworkRemove());
        return axios.delete('/api/homework/' + id)
        .then((response) => {
            dispatch(homeworkRemoveSuccess(index));
        }).catch((error) => {
            dispatch(homeworkRemoveFailure());
        });
    };
}

export function homeworkRemove() {
    return {
        type: HOMEWORK_REMOVE
    };
}

export function homeworkRemoveSuccess(index) {
    return {
        type: HOMEWORK_REMOVE_SUCCESS,
        index
    };
}

export function homeworkRemoveFailure(error) {
    return {
        type: HOMEWORK_REMOVE_FAILURE,
        error
    };
}
