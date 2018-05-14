'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var MemoGroup = new Schema({
	name: String,
	teacher: String,
	memoList: String,
	memos: [{
		text: String,
		label: String,
		dueDate: String,
		memoGroup: String
		// attachment: String,
	}]
});

var _default = _mongoose2.default.model('memogroup', MemoGroup);

exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(Schema, 'Schema', 'server/models/memo/MemoGroup.js');

	__REACT_HOT_LOADER__.register(MemoGroup, 'MemoGroup', 'server/models/memo/MemoGroup.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'server/models/memo/MemoGroup.js');
}();

;