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
export function homeworkBoardRequest(id) {
    return (dispatch) => {
        dispatch(homeworkBoard());
        id = id || "";
        let url = '/api/homework/' + id;

        return axios.get(url)
        .then((response) => {
            dispatch(homeworkBoardSuccess(response.data));
            return response
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

export function homeworkBoardSuccess(data) {
    return {
        type: HOMEWORK_BOARD_SUCCESS,
        data,
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
            return response
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
            return 'SUCCESS';
        }).catch((error) => {
            dispatch(homeworkEditFailure(error.response.data.code));
            return 'FAIL';
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
export function homeworkRemoveRequest(id) {
    return (dispatch) => {
        dispatch(homeworkRemove());
        return axios.delete('/api/homework/' + id)
        .then((response) => {
            dispatch(homeworkRemoveSuccess());
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

export function homeworkRemoveSuccess() {
    return {
        type: HOMEWORK_REMOVE_SUCCESS
    };
}

export function homeworkRemoveFailure(error) {
    return {
        type: HOMEWORK_REMOVE_FAILURE,
        error
    };
}
