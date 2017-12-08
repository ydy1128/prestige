import authentication from './authentication';
import makeclass from './makeclass';
import studentinfo from './studentinfo';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    makeclass,
    studentinfo
});