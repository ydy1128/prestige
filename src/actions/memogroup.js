import{
    MEMO_GROUP_POST,
    MEMO_GROUP_POST_SUCCESS,
    MEMO_GROUP_POST_FAILURE,
    MEMO_GROUP_GET,
    MEMO_GROUP_GET_SUCCESS,
    MEMO_GROUP_GET_FAILURE,
    MEMO_GROUP_EDIT,
    MEMO_GROUP_EDIT_SUCCESS,
    MEMO_GROUP_EDIT_FAILURE,
    MEMO_GROUP_REMOVE,
    MEMO_GROUP_REMOVE_SUCCESS,
    MEMO_GROUP_REMOVE_FAILURE,
    MEMO_GROUP_REMOVE_BY_LIST,
    MEMO_GROUP_REMOVE_SUCCESS_BY_LIST,
    MEMO_GROUP_REMOVE_FAILURE_BY_LIST,
} from './ActionTypes';

import axios from 'axios';

/*MemoGroup Post*/
export function postMemoGroupRequest(contents) {
    return (dispatch) => {
        dispatch(postMemoGroup());
        return axios.post('/api/memo/group', { contents })
        .then((response) => {
            dispatch(postMemoGroupSuccess(response.data.memogroup));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);
            dispatch(postMemoGroupFailure(error.response.data.code));
        });
    };
}

export function postMemoGroup() {
    return {
        type: MEMO_GROUP_POST
    };
}

export function postMemoGroupSuccess(data) {
    return {
        type: MEMO_GROUP_POST_SUCCESS,
        data
    };
}

export function postMemoGroupFailure(error) {
    return {
        type: MEMO_GROUP_POST_FAILURE,
        error
    };
}

/* MEMO GROUP GET */
export function getMemoGroupRequest(_id) {
    return (dispatch) => {
        dispatch(getMemoGroup());

        let url = '/api/memo/group/' + _id;

        return axios.get(url)
        .then((response) => {
            dispatch(getMemoGroupSuccess(response.data.memogroups));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);
            dispatch(getMemoGroupFailure());
        });
    };
}

export function getMemoGroup() {
    return {
        type: MEMO_GROUP_GET
    };
}

export function getMemoGroupSuccess(data) {
    console.log(data)
    return {
        type: MEMO_GROUP_GET_SUCCESS,
        data
    };
}

export function getMemoGroupFailure() {
    return {
        type: MEMO_GROUP_GET_FAILURE
    };
}

/* MEMO GROUP EDIT */
export function editMemoGroupRequest(index, contents) {
    return (dispatch) => {
        dispatch(editMemoGroup());
        console.log(contents)
        return axios.put('/api/memo/group/' + contents._id, { contents })
        .then((response) => {
            dispatch(editMemoGroupSuccess(index, response.data.memogroup));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);

            dispatch(editMemoGroupFailure(error.response.data.code));
        });
    };
}

export function editMemoGroup() {
    return {
        type: MEMO_GROUP_EDIT
    };
}

export function editMemoGroupSuccess(index, memogroup) {
    return {
        type: MEMO_GROUP_EDIT_SUCCESS,
        index,
        memogroup
    };
}

export function editMemoGroupFailure(error) {
    return {
        type: MEMO_GROUP_EDIT_FAILURE,
        error
    };
}

/* MEMOGROUP REMOVE */
export function removeMemoGroupRequest(id, index) {
    return (dispatch) => {
        dispatch(removeMemoGroup());
        return axios.delete('/api/memo/group/' + id)
        .then((response) => {
            dispatch(removeMemoGroupSuccess(index));
        }).catch((error) => {
            dispatch(removeMemoGroupFailure());
        });
    };
}

export function removeMemoGroup() {
    return {
        type: MEMO_GROUP_REMOVE
    };
}

export function removeMemoGroupSuccess(index) {
    return {
        type: MEMO_GROUP_REMOVE_SUCCESS,
        index
    };
}

export function removeMemoGroupFailure(error) {
    return {
        type: MEMO_GROUP_REMOVE_FAILURE,
        error
    };
}

/* MEMOGROUP REMOVE */
export function removeMemoGroupsByListRequest(id, index) {
    return (dispatch) => {
        dispatch(removeMemoGroupsByList());
        return axios.delete('/api/memo/groups-by-list-id/' + id)
        .then((response) => {
            dispatch(removeMemoGroupsByListSuccess(index));
        }).catch((error) => {
            dispatch(removeMemoGroupsByListFailure());
        });
    };
}

export function removeMemoGroupsByList() {
    return {
        type: MEMO_GROUP_REMOVE_BY_LIST
    };
}

export function removeMemoGroupsByListSuccess(index) {
    return {
        type: MEMO_GROUP_REMOVE_SUCCESS_BY_LIST,
        index
    };
}

export function removeMemoGroupsByListFailure(error) {
    return {
        type: MEMO_GROUP_REMOVE_FAILURE_BY_LIST,
        error
    };
}
