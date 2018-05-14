'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Lecture = new Schema({
	name: String,
	link: String,
	teacher: String,
	class: String,
	accomplishments: [{
		_id: String,
		accomplishments: Number,
		startTime: String,
		endTime: String
	}],
	date: String
});

var _default = _mongoose2.default.model('lecture', Lecture);

exports.default = _default;
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(Schema, 'Schema', 'server/models/Lecture.js');

	__REACT_HOT_LOADER__.register(Lecture, 'Lecture', 'server/models/Lecture.js');

	__REACT_HOT_LOADER__.register(_default, 'default', 'server/models/Lecture.js');
}();

;