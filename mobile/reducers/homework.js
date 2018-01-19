import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    board: {
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
        case types.HOMEWORK_BOARD:
            return update(state, {
                board: {
                    status: { $set: 'WAITING' },
                }
            });
        case types.HOMEWORK_BOARD_SUCCESS:
            return update(state, {
                board: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data },
                }
            })
            return state;
        case types.HOMEWORK_BOARD_FAILURE:
            return update(state, {
                board: {
                    status: { $set: 'FAILURE' }
                }
            })
        case types.HOMEWORK_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.HOMEWORK_POST_SUCCESS:
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
        case types.HOMEWORK_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        // case types.HOMEWORK_EDIT_PREP:
        //     return update(state, {
        //         editPrep: {
        //             name: { $set: action.name },
        //             days: { $set: action.days },
        //             starttime: { $set: action.starttime },
        //             endtime: { $set: action.endtime },
        //             students: { $set: action.students },
        //             index: { $set: action.index },
        //             _id: { $set: action._id },
        //             flag: { $set: action.flag }
        //         }
        //     });
        case types.HOMEWORK_EDIT:
            return update(state, {
                edit: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 },
                    cls: { $set: undefined }
                }
            });
        case types.HOMEWORK_EDIT_SUCCESS:
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
        case types.HOMEWORK_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.HOMEWORK_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.HOMEWORK_REMOVE_SUCCESS:
            return update(state, {
                remove:{
                    status: { $set: 'SUCCESS' }
                },
                board: {
                    data: { $splice: [[action.index, 1]] }
                }
            });
        case types.HOMEWORK_REMOVE_FAILURE:
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
