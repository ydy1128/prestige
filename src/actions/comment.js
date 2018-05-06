import axios from 'axios';

import {
    GET_COMMENTS,
    APPEND_COMMENT,
    UPDATE_COMMENT,
    DELETE_COMMENT
} from './ActionTypes';

let baseUrl = '/api/comment';

export function getCommentsByHomeworkId(homeworkId) {
    return (dispatch) => {
        return axios.get(baseUrl + '/homework/' + homeworkId)
        .then((response) => {
            dispatch(getComments(response.data.comments));
            return { success: true };
        }).catch((error) => {
            dispatch(getComments());
            return { success: false, error };
        });
    };
}

export function getComments(comments) {
    return {
        type: GET_COMMENTS,
        data: comments,
    };
}

export function appendCommentByHomeworkId(homeworkId, comment) {
    return (dispatch) => {
        return axios.post(baseUrl + '/homework/' + homeworkId, { comment })
        .then((response) => {
            dispatch(appendComment(response.data.comment));
            return { success: true };
        }).catch((error) => {
            return { success: false, error };
        });
    };
}

export function appendComment(comment) {
    return {
        type: APPEND_COMMENT,
        comment,
    };
}

export function updateCommentByComment(comment) {
    return (dispatch) => {
        return axios.put(baseUrl, { comment })
        .then((response) => {
            dispatch(updateComment(comment));
            return { success: true };
        }).catch((error) => {
            return { success: false, error };
        });
    };
}

export function updateComment(comment) {
    return {
        type: UPDATE_COMMENT,
        comment,
    };
}

export function deleteCommentById(commentId) {
    return (dispatch) => {
        return axios.delete(baseUrl + '/' + commentId )
        .then((response) => {
            dispatch(deleteComment(commentId));
            return { success: true };
        }).catch((error) => {
            return { success: false, error };
        });
    };
}

export function deleteComment(commentId) {
    return {
        type: DELETE_COMMENT,
        commentId,
    };
}
