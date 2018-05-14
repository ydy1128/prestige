'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Homework = new Schema({
	//_id: String,
	teacherId: String,
	title: String,
	content: String,
	fileNames: [String],
	accomplishments: [String],
	dueDate: String,
	writtenDate: String,
	classId: String
});

var _default = _mongoose2.default.model('homework', Homework);

exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(Schema, 'Schema', 'server/models/Homework.js');

	__REACT_HOT_LOADER__.register(Homework, 'Homework', 'server/models/Homework.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'server/models/Homework.js');
}();

;