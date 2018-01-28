import axios from 'axios';

import {
    COMMENT,
    COMMENT_SUCCESS,
    COMMENT_FAILURE,
    COMMENT_POST,
    COMMENT_POST_SUCCESS,
    COMMENT_POST_FAILURE,
    COMMENT_EDIT_PREP,
    COMMENT_EDIT,
    COMMENT_EDIT_SUCCESS,
    COMMENT_EDIT_FAILURE,
    COMMENT_REMOVE,
    COMMENT_REMOVE_SUCCESS,
    COMMENT_REMOVE_FAILURE
} from './ActionTypes';

let url = '/api/comment'

/* COMMENT */
export function commentRequest(isInitial, listType, id, username) {
    return (dispatch) => {
        dispatch(comment());
        
        return axios.get(url)
        .then((response) => {
            dispatch(commentSuccess(response.data, isInitial, listType));
        }).catch((error) => {
            dispatch(commentFailure());
        });
    };
}

export function comment() {
    return {
        type: COMMENT
    };
}

export function commentSuccess(data, isInitial, listType) {
    return {
        type: COMMENT_SUCCESS,
        data,
        isInitial,
        listType
    };
}

export function commentFailure() {
    return {
        type: COMMENT_FAILURE
    };
}

/*comment Post*/
export function commentPostRequest(contents) {
    return (dispatch) => {
        dispatch(commentPost());

        return axios.post(url, { contents })
        .then((response) => {
            console.log(response.data.comment)
            dispatch(commentPostSuccess(response.data.comment));
        }).catch((error) => {
            dispatch(commentPostFailure(error.response.data.comment));
        });
    };
}

export function commentPost() {
    return {
        type: COMMENT_POST
    };
}

export function commentPostSuccess(data) {
    return {
        type: COMMENTPOST_SUCCESS,
        data
    };
}

export function commentPostFailure(error) {
    return {
        type: COMMENT_POST_FAILURE,
        error
    };
}

export function commentEditRequest(id, index, contents) {
    return (dispatch) => {
        dispatch(commentEdit());

        return axios.put(url + id, { contents })
        .then((response) => {
            dispatch(commentEditSuccess(index, response.data.comment));
        }).catch((error) => {
            dispatch(commentEditFailure(error.response.data.code));
        });
    };
}

export function commentEdit() {
    return {
        type: COMMENT_EDIT
    };
}

export function commentEditSuccess(index, cls) {
    return {
        type: COMMENT_EDIT_SUCCESS,
        index,
        cls
    };
}

export function commentEditFailure(error) {
    return {
        type: COMMENT_EDIT_FAILURE,
        error
    };
}

/* COMMENT REMOVE */
export function commentRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(commentRemove());
        return axios.delete(url + id)
        .then((response) => {
            dispatch(commentRemoveSuccess(index));
        }).catch((error) => {
            dispatch(commentRemoveFailure());
        });
    };
}

export function commentRemove() {
    return {
        type: COMMENT_REMOVE
    };
}

export function commentRemoveSuccess(index) {
    return {
        type: COMMENT_REMOVE_SUCCESS,
        index
    };
}

export function commentRemoveFailure(error) {
    return {
        type: COMMENT_REMOVEF_FAILURE,
        error
    };
}
