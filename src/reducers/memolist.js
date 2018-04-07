import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    get: {
        status: 'INIT',
        data: []
    },
    post: {
        status: 'INIT',
        error: -1
    },
    edit:{
        status: 'INIT',
        error: -1,
    },
    remove: {
        status: 'INIT',
        error: -1
    }
}

export default function memolist(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.MEMO_LIST_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.MEMO_LIST_POST_SUCCESS:
            console.log('actions: ',action.data)
            return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                },
                get: {
                    data: {
                        $push: [action.data]
                    }
                }
            });
        case types.MEMO_LIST_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.MEMO_LIST_GET:
            return update(state, {
                get: {
                    status: { $set: 'WAITING' },
                }
            });
        case types.MEMO_LIST_GET_SUCCESS: 
            console.log('SUCCESS');
            return update(state, {
                get: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data }
                }
            })
        case types.MEMO_LIST_GET_FAILURE:
            return update(state, {
                get: {
                    status: { $set: 'FAILURE' }
                }
            })

        case types.MEMO_LIST_EDIT: 
            return update(state, {
                edit: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 },
                }
            });
        case types.MEMO_LIST_EDIT_SUCCESS:
            return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' },
                },
                get: {
                    data: {
                        [action.index]: { $set: action.memolist }
                    }
                }
            });
        case types.MEMO_LIST_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });


        case types.MEMO_LIST_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.MEMO_LIST_REMOVE_SUCCESS:
            return update(state, {
                remove:{
                    status: { $set: 'SUCCESS' }
                },
                get: {
                    data: { $splice: [[action.index, 1]] }
                }
            });
        case types.MEMO_LIST_REMOVE_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        default:
            return state;
    }
}