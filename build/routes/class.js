'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Class = require('../models/Class');

var _Class2 = _interopRequireDefault(_Class);

var _Lecture = require('../models/Lecture');

var _Lecture2 = _interopRequireDefault(_Lecture);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.post('/test', function (req, res) {
    createData(req, res);
});
router.post('/', function (req, res) {
    createClass(req, res);
});
router.put('/:id', function (req, res) {
    updateClass(req, res);
});
router.delete('/:id', function (req, res) {
    deleteClass(req, res);
});
router.get('/', function (req, res) {
    getAllClasses(req, res);
});

var createData = function createData(req, res) {
    console.log('test uri called');
    var data = _fs2.default.readFileSync('server/data/class.csv');
    data = _iconvLite2.default.decode(data, 'EUC-KR').split('\n');
    data.splice(data.length - 1, 1);

    var _loop = function _loop(i) {
        var row = data[i].split(',');
        var proceed = false;
        _Class2.default.find({ name: row[0] }, function (err, checkcls) {
            if (JSON.stringify(checkcls) == JSON.stringify([])) {
                var cls = new _Class2.default({
                    name: row[0],
                    teacher: row[1],
                    students: [],
                    startTime: row[2].replace(' ', ''),
                    endTime: row[3].replace(' ', ''),
                    days: row[4]
                });
                cls.save(function (err) {
                    if (err) throw err;
                });
            }
        });
    };

    for (var i = 0; i < data.length; i++) {
        _loop(i);
    }
};

var createClass = function createClass(req, res) {
    //Check login status
    if (typeof req.session.loginInfo === 'undefined') return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    // Check if content is valid
    if (!validateContents(req.body.contents)) return (0, _throwerror2.default)(res, 400, 'Empty contents.');

    var cls = new _Class2.default({
        name: req.body.contents.name,
        teacher: req.session.loginInfo.user._id,
        students: [],
        startTime: req.body.contents.startTime,
        endTime: req.body.contents.endTime,
        days: req.body.contents.days
    });
    _Class2.default.findOne({ name: req.body.contents.name }, function (err, exists) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (exists) return (0, _throwerror2.default)(res, 409, 'Class name already exists.');
        cls.save(function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({ success: true, data: cls });
        });
    });
};

var updateClass = function updateClass(req, res) {
    // Check login status
    if (typeof req.session.loginInfo === 'undefined') return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    // Check if content is valid
    if (!validateContents(req.body.contents)) return (0, _throwerror2.default)(res, 400, 'Empty contents.');
    _Class2.default.findOne({ name: req.body.contents.name }, function (err, exists) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        // if(exists)
        // return throwerror(res, 409, 'Class name already exists.');
        // Find Class
        _Class2.default.findById(req.params.id, function (err, cls) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            // IF Class does not exist
            if (cls == undefined) return (0, _throwerror2.default)(res, 409);

            // If exists, check teacher
            if (cls.teacher != req.session.loginInfo.user._id) return (0, _throwerror2.default)(res, 403, 'Unauthorized user.');

            // Modify class contents
            cls.name = req.body.contents.name;
            cls.days = req.body.contents.days;
            cls.startTime = req.body.contents.startTime;
            cls.endTime = req.body.contents.endTime;
            cls.students = req.body.contents.students;

            cls.save(function (err, cls) {
                if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
                return res.json({
                    success: true,
                    cls: cls
                });
            });
        });
    });
};

var deleteClass = function deleteClass(req, res) {
    // Check class Validity
    if (!_mongoose2.default.Types.ObjectId.isValid(req.params.id)) return throwError(res, 400, "Data format not valid.");

    // Check login status
    if (typeof req.session.loginInfo === 'undefined') return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    // Find memo by id
    _Class2.default.findById(req.params.id, function (err, cls) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (!cls) return (0, _throwerror2.default)(res, 409);
        //check if teacher is valid
        if (cls.teacher != req.session.loginInfo.user._id) return (0, _throwerror2.default)(res, 403, 'Unauthorized user.');

        // Remove class
        _Class2.default.remove({ _id: req.params.id }, function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
};

var getAllClasses = function getAllClasses(req, res) {
    _Class2.default.find().exec(function (err, classes) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        res.json(classes);
    });
};

var verifyList = ['name', 'startTime', 'endTime', 'days'];
var validateContents = function validateContents(contents) {
    var vfList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : verifyList;

    for (var i = 0; i < vfList.length; i++) {
        var key = vfList[i];
        if (contents[key] == undefined || contents[key] == '') {
            console.error('value not found: ', key, contents[key]);
            return false;
        }
    }
    return true;
};

Array.prototype.equals = function (array) {
    if (!array) return false;
    if (this.length != array.length) return false;
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] != array[i]) return false;
    }
    return true;
};
Array.prototype.diff = function (b) {
    var first = this.filter(function (i) {
        return b.indexOf(i) < 0;
    });
    return first;
};
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

var _default = router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(createData, 'createData', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(createClass, 'createClass', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(updateClass, 'updateClass', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(deleteClass, 'deleteClass', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(getAllClasses, 'getAllClasses', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(verifyList, 'verifyList', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(validateContents, 'validateContents', 'server/routes/class.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/class.js');
}();

;