import {
    LECTURE_POST,
    LECTURE_POST_SUCCESS,
    LECTURE_POST_FAILURE,
    LECTURE_BOARD,
    LECTURE_BOARD_SUCCESS,
    LECTURE_BOARD_FAILURE,
} from './ActionTypes';

import axios from 'axios';

/*Lecture Post*/
export function lecturePostRequest(contents) {
    return (dispatch) => {
        dispatch(lecturePost());
        console.log(contents)
        return axios.post('/api/lecture', { contents })
        .then((response) => {
            console.log(response.data.data)
            dispatch(lecturePostSuccess(response.data.data));
        }).catch((error) => {
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

/* Class Board */
export function lectureBoardRequest() {
    return (dispatch) => {
        dispatch(lectureBoard());

        let url = '/api/lecture';

        return axios.get(url)
        .then((response) => {
            dispatch(lectureBoardSuccess(response.data.info));
        }).catch((error) => {
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