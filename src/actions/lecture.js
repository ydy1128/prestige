import {
    LECTURE_POST,
    LECTURE_POST_SUCCESS,
    LECTURE_POST_FAILURE,
    LECTURE_BOARD,
    LECTURE_BOARD_SUCCESS,
    LECTURE_BOARD_FAILURE,
    LECTURE_EDIT,
    LECTURE_EDIT_SUCCESS,
    LECTURE_EDIT_FAILURE,
    LECTURE_REMOVE,
    LECTURE_REMOVE_SUCCESS,
    LECTURE_REMOVE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

/*Lecture Post*/
export function lecturePostRequest(contents) {
    return (dispatch) => {
        dispatch(lecturePost());
        console.log(contents)
        return axios.post('/api/lecture', { contents })
        .then((response) => {
            console.log(response.data.lecture)
            dispatch(lecturePostSuccess(response.data.lecture));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);
            dispatch(lecturePostFailure(error.response.data.code));
        });
    };
}

export function lecturePost() {
    return {
        type: LECTURE_POST
    };
}

export function lecturePostSuccess(data) {
    return {
        type: LECTURE_POST_SUCCESS,
        data
    };
}

export function lecturePostFailure(error) {
    return {
        type: LECTURE_POST_FAILURE,
        error
    };
}

/* Lecture Board */
export function lectureBoardRequest() {
    return (dispatch) => {
        dispatch(lectureBoard());

        let url = '/api/lecture';

        return axios.get(url)
        .then((response) => {
            dispatch(lectureBoardSuccess(response.data.lectures));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);
            dispatch(lectureBoardFailure());
        });
    };
}

export function lectureBoard() {
    return {
        type: LECTURE_BOARD
    };
}

export function lectureBoardSuccess(data) {
    return {
        type: LECTURE_BOARD_SUCCESS,
        data
    };
}

export function lectureBoardFailure() {
    return {
        type: LECTURE_BOARD_FAILURE
    };
}

/* LECTURE EDIT */
export function lectureEditRequest(index, contents) {
    return (dispatch) => {
        dispatch(lectureEdit());

        return axios.put('/api/lecture/' + contents._id, { contents })
        .then((response) => {
            dispatch(lectureEditSuccess(index, response.data.lecture));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);

            dispatch(lectureEditFailure(error.response.data.code));
        });
    };
}

export function lectureEdit() {
    return {
        type: LECTURE_EDIT
    };
}

export function lectureEditSuccess(index, lecture) {
    return {
        type: LECTURE_EDIT_SUCCESS,
        index,
        lecture
    };
}

export function lectureEditFailure(error) {
    return {
        type: LECTURE_EDIT_FAILURE,
        error
    };
}

/* LECTURE REMOVE */
export function lectureRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(lectureRemove());
        return axios.delete('/api/lecture/' + id)
        .then((response) => {
            dispatch(lectureRemoveSuccess(index));
        }).catch((error) => {
            dispatch(lectureRemoveFailure());
        });
    };
}

export function lectureRemove() {
    return {
        type: LECTURE_REMOVE
    };
}

export function lectureRemoveSuccess(index) {
    return {
        type: LECTURE_REMOVE_SUCCESS,
        index
    };
}

export function lectureRemoveFailure(error) {
    return {
        type: LECTURE_REMOVE_FAILURE,
        error
    };
}
