import authentication from './authentication';
import makeclass from './makeclass';
import homework from './homework';
import studentinfo from './studentinfo';
import lecture from './lecture';
import comment from './comment';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    makeclass,
    homework,
    studentinfo,
    lecture,
    comment
});
