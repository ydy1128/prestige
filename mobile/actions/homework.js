
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

import axios from 'axios';

import ipaddress from './ipconfig'


/* Homework Board */
export function homeworkBoardRequest(id) {
    return (dispatch) => {
        dispatch(homeworkBoard());
        id = id || "";
        let url = ipaddress + '/api/homework/' + id;

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
