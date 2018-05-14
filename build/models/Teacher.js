'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Teacher = new Schema({
    username: String,
    password: String,
    name: String,
    classes: [String],
    created: { type: Date, default: Date.now }
});

// generates hash
Teacher.methods.generateHash = function (password) {
    return _bcryptjs2.default.hashSync(password, 8);
};

// compares the password
Teacher.methods.validateHash = function (password) {
    return _bcryptjs2.default.compareSync(password, this.password);
};

var _default = _mongoose2.default.model('teacher', Teacher);

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(Schema, 'Schema', 'server/models/Teacher.js');

    __REACT_HOT_LOADER__.register(Teacher, 'Teacher', 'server/models/Teacher.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/models/Teacher.js');
}();

;