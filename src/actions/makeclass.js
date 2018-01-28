import {
    CLASS_BOARD,
    CLASS_BOARD_SUCCESS,
    CLASS_BOARD_FAILURE,
    CLASS_POST,
    CLASS_POST_SUCCESS,
    CLASS_POST_FAILURE,
    CLASS_EDIT,
    CLASS_EDIT_SUCCESS,
    CLASS_EDIT_FAILURE,
    CLASS_REMOVE,
    CLASS_REMOVE_SUCCESS,
    CLASS_REMOVE_FAILURE
} from './ActionTypes';

import axios from 'axios';


/* Class Board */
export function classBoardRequest(isInitial, listType, id, username) {
    return (dispatch) => {
        dispatch(classBoard());

        let url = '/api/class';

        return axios.get(url)
        .then((response) => {
            dispatch(classBoardSuccess(response.data, isInitial, listType));
        }).catch((error) => {
            dispatch(classBoardFailure());
        });
    };
}

export function classBoard() {
    return {
        type: CLASS_BOARD
    };
}

export function classBoardSuccess(data, isInitial, listType) {
    return {
        type: CLASS_BOARD_SUCCESS,
        data,
        isInitial,
        listType
    };
}

export function classBoardFailure() {
    return {
        type: CLASS_BOARD_FAILURE
    };
}

/*Class Post*/
export function classPostRequest(contents) {
    return (dispatch) => {
        dispatch(classPost());
        console.log(contents)
        return axios.post('/api/class', { contents })
        .then((response) => {
            console.log(response.data.data)
            dispatch(classPostSuccess(response.data.data));
        }).catch((error) => {
            dispatch(classPostFailure(error.response.data));
        });
    };
}

export function classPost() {
    return {
        type: CLASS_POST
    };
}

export function classPostSuccess(data) {
    return {
        type: CLASS_POST_SUCCESS,
        data
    };
}

export function classPostFailure(error) {
    return {
        type: CLASS_POST_FAILURE,
        error
    };
}

/* Class Edit */
export function classEditRequest(id, index, contents) {
    return (dispatch) => {
        dispatch(classEdit());

        return axios.put('/api/class/' + id, { contents })
        .then((response) => {
            dispatch(classEditSuccess(index, response.data.cls));
        }).catch((error) => {
            dispatch(classEditFailure(error.response.data));
        });
    };
}

export function classEdit() {
    return {
        type: CLASS_EDIT
    };
}

export function classEditSuccess(index, data) {
    return {
        type: CLASS_EDIT_SUCCESS,
        index,
        data
    };
}

export function classEditFailure(error) {
    return {
        type: CLASS_EDIT_FAILURE,
        error
    };
}

/* CLASS REMOVE */
export function classRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(classRemove());
        return axios.delete('/api/class/' + id)
        .then((response) => {
            dispatch(classRemoveSuccess(index));
        }).catch((error) => {
            dispatch(classRemoveFailure());
        });
    };
}

export function classRemove() {
    return {
        type: CLASS_REMOVE
    };
}

export function classRemoveSuccess(index) {
    return {
        type: CLASS_REMOVE_SUCCESS,
        index
    };
}

export function classRemoveFailure(error) {
    return {
        type: CLASS_REMOVE_FAILURE,
        error
    };
}
