import authentication from './authentication';
import memolist from './memolist';
import memogroup from './memogroup';
import makeclass from './makeclass';
import homework from './homework';
import studentinfo from './studentinfo';
import lecture from './lecture';
import comment from './comment';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    memolist,
    memogroup,
    makeclass,
    homework,
    studentinfo,
    lecture,
    comment
});
