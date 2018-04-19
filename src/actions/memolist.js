import{
	MEMO_LIST_POST,
	MEMO_LIST_POST_SUCCESS,
	MEMO_LIST_POST_FAILURE,
	MEMO_LIST_GET,
	MEMO_LIST_GET_SUCCESS,
	MEMO_LIST_GET_FAILURE,
	MEMO_LIST_EDIT,
	MEMO_LIST_EDIT_SUCCESS,
	MEMO_LIST_EDIT_FAILURE,
	MEMO_LIST_REMOVE,
	MEMO_LIST_REMOVE_SUCCESS,
	MEMO_LIST_REMOVE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

/*MemoList Post*/
export function postMemoListRequest(contents) {
    return (dispatch) => {
        dispatch(postMemoList());
        return axios.post('/api/memo/list', { contents })
        .then((response) => {
            dispatch(postMemoListSuccess(response.data.memolist));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);
            dispatch(postMemoListFailure(error.response.data));
        });
    };
}

export function postMemoList() {
    return {
        type: MEMO_LIST_POST
    };
}

export function postMemoListSuccess(data) {
    return {
        type: MEMO_LIST_POST_SUCCESS,
        data
    };
}

export function postMemoListFailure(error) {
    return {
        type: MEMO_LIST_POST_FAILURE,
        error
    };
}

/* Lecture Board */
export function getMemoListRequest() {
    return (dispatch) => {
        dispatch(getMemoList());

        let url = '/api/memo/list';

        return axios.get(url)
        .then((response) => {
            dispatch(getMemoListSuccess(response.data.memolist));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);
            dispatch(getMemoListFailure());
        });
    };
}

export function getMemoList() {
    return {
        type: MEMO_LIST_GET
    };
}

export function getMemoListSuccess(data) {
    console.log(data)
    return {
        type: MEMO_LIST_GET_SUCCESS,
        data
    };
}

export function getMemoListFailure() {
    return {
        type: MEMO_LIST_GET_FAILURE
    };
}

/* MEMO GROUP EDIT */
export function editMemoListRequest(index, contents) {
    return (dispatch) => {
        dispatch(editMemoList());
        console.log(contents)
        return axios.put('/api/memo/list/' + contents._id, { contents })
        .then((response) => {
            dispatch(editMemoListSuccess(index, response.data.memolist));
        }).catch((error) => {
            if(error.response == undefined) console.error(error);

            dispatch(editMemoListFailure(error.response.data.code));
        });
    };
}

export function editMemoList() {
    return {
        type: MEMO_LIST_EDIT
    };
}

export function editMemoListSuccess(index, memolist) {
    return {
        type: MEMO_LIST_EDIT_SUCCESS,
        index,
        memolist
    };
}

export function editMemoListFailure(error) {
    return {
        type: MEMO_LIST_EDIT_FAILURE,
        error
    };
}

/* MEMOLIST REMOVE */
export function removeMemoListRequest(id, index) {
    return (dispatch) => {
        dispatch(removeMemoList());
        return axios.delete('/api/memo/list/' + id)
        .then((response) => {
            dispatch(removeMemoListSuccess(index));
        }).catch((error) => {
            dispatch(removeMemoListFailure());
        });
    };
}

export function removeMemoList() {
    return {
        type: MEMO_LIST_REMOVE
    };
}

export function removeMemoListSuccess(index) {
    return {
        type: MEMO_LIST_REMOVE_SUCCESS,
        index
    };
}

export function removeMemoListFailure(error) {
    return {
        type: MEMO_LIST_REMOVE_FAILURE,
        error
    };
}


