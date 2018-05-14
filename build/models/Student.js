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

var Student = new Schema({
    username: String,
    password: String,
    name: String,
    school: String,
    class: String,
    level: Number
});

// generates hash
Student.methods.generateHash = function (password) {
    return _bcryptjs2.default.hashSync(password, 8);
};

// compares the password
Student.methods.validateHash = function (password) {
    return _bcryptjs2.default.compareSync(password, this.password);
};

var _default = _mongoose2.default.model('student', Student);

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(Schema, 'Schema', 'server/models/Student.js');

    __REACT_HOT_LOADER__.register(Student, 'Student', 'server/models/Student.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/models/Student.js');
}();

;