'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Comment = new Schema({
	writtenDate: String,
	editedDate: String,
	writer: Object,
	content: String,
	homeworkId: String
	// replies: [String] // ids of comment
});

var _default = _mongoose2.default.model('comment', Comment);

exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(Schema, 'Schema', 'server/models/Comment.js');

	__REACT_HOT_LOADER__.register(Comment, 'Comment', 'server/models/Comment.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'server/models/Comment.js');
}();

;