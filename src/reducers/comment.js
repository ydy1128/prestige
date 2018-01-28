import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    comments: {
        status: 'INIT',
        data: [],
        isLast: false
    },
    post: {
        status: 'INIT',
        error: -1
    },
    // editPrep: {
    //     name: '',
    //     days: '',
    //     starttime: '',
    //     endtime: '',
    //     students: '',
    //     index: '',
    //     _id: '',
    //     flag: true
    // },
    edit: {
        status: 'INIT',
        error: -1,
    },
    remove: {
        status: 'INIT',
        error: -1
    }
};
export default function makeclass(state, action) {

    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.COMMENT:
            return update(state, {
                comments: {
                    status: { $set: 'WAITING' },
                }
            });
        case types.COMMENT_SUCCESS:
            return update(state, {
                comments: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data },
                }
            })
            return state;
        case types.COMMENT_FAILURE:
            return update(state, {
                comments: {
                    status: { $set: 'FAILURE' }
                }
            })
        case types.COMMENT_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.COMMENT_POST_SUCCESS:
            return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                },
                board: {
                    data: {
                        $push: [action.data]
                    }
                }
            });
        case types.COMMENT_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.COMMENT_EDIT:
            return update(state, {
                edit: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 },
                    cls: { $set: undefined }
                }
            });
        case types.COMMENT_EDIT_SUCCESS:
            return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' },
                },
                board: {
                    data: {
                        [action.index]: { $set: action.cls }
                    }
                }
            });
        case types.COMMENT_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.COMMENT_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.COMMENT_REMOVE_SUCCESS:
            return update(state, {
                remove:{
                    status: { $set: 'SUCCESS' }
                },
                board: {
                    data: { $splice: [[action.index, 1]] }
                }
            });
        case types.COMMENT_REMOVE_FAILURE:
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
