'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var MemoList = new Schema({
	name: String,
	teacher: String
});

var _default = _mongoose2.default.model('memolist', MemoList);

exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(Schema, 'Schema', 'server/models/memo/MemoList.js');

	__REACT_HOT_LOADER__.register(MemoList, 'MemoList', 'server/models/memo/MemoList.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'server/models/memo/MemoList.js');
}();

;