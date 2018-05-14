'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Lecture = require('../models/Lecture');

var _Lecture2 = _interopRequireDefault(_Lecture);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
    createLecture(req, res);
});
router.get('/', function (req, res) {
    readLecture(req, res);
});
router.put('/:id', function (req, res) {
    updateLecture(req.params.id, req, res);
});
router.delete('/:id', function (req, res) {
    deleteLecture(req.params.id, req, res);
});

var createLecture = function createLecture(req, res) {
    var lecture_obj = req.body.contents;

    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    if (!validateContents(lecture_obj)) return (0, _throwerror2.default)(res, 400, 'Empty contents.');

    var lecture = new _Lecture2.default({
        name: lecture_obj.name,
        link: lecture_obj.link,
        teacher: req.session.loginInfo.user._id,
        class: lecture_obj.class,
        accomplishments: lecture_obj.accomplishments,
        date: new Date()
    });

    lecture.save(function (err) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        return res.json({ success: true, lecture: lecture });
    });
};

var readLecture = function readLecture(req, res) {
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    var condition = {};
    if (req.session.loginInfo.role == 'teacher') {
        condition = { teacher: req.session.loginInfo.user._id };
    } else {
        if (req.session.loginInfo.user.class == undefined) return (0, _throwerror2.default)(res, 403, 'Student is not assigned to class.');else condition = { class: req.session.loginInfo.user.class };
    }
    _Lecture2.default.find(condition).sort({ $natural: -1 }).exec(function (err, lectures) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        res.json({ success: true, lectures: lectures });
    });
};

var updateLecture = function updateLecture(id, req, res) {
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    if (!validateContents(req.body.contents)) return (0, _throwerror2.default)(res, 400, 'Empty contents.');
    if (req.body.contents.accomplishments == undefined) return (0, _throwerror2.default)(res, 400, 'Client data error.');

    _Lecture2.default.findById(id, function (err, lecture) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        // IF Class does not exist
        if (lecture == undefined) return (0, _throwerror2.default)(res, 409);
        if (req.session.loginInfo.role == 'teacher') {
            if (lecture.teacher != req.session.loginInfo.user._id) return (0, _throwerror2.default)(res, 403, 'Unauthorized user.');
        } else {
            // console.log(req)
            if (req.session.loginInfo.user.class != lecture.class) return (0, _throwerror2.default)(res, 403, 'Unauthorized user.');
        }
        // Modify class contents
        lecture.name = req.body.contents.name;
        lecture.link = req.body.contents.link;
        lecture.class = req.body.contents.class;
        lecture.accomplishments = req.body.contents.accomplishments;

        lecture.save(function (err, lecture) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({
                success: true,
                lecture: lecture
            });
        });
    });
};

var deleteLecture = function deleteLecture(id, req, res) {
    // Check class Validity
    if (!validateId(id)) return throwError(res, 400, "Data format not valid.");
    // Check login status
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    // Find memo by id
    _Lecture2.default.findById(id, function (err, lecture) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (!lecture) return (0, _throwerror2.default)(res, 409);
        //check if teacher is valid
        if (lecture.teacher != req.session.loginInfo.user._id) return (0, _throwerror2.default)(res, 403, 'Unauthorized user.');
        // Remove class
        _Lecture2.default.remove({ _id: id }, function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
};

var validateId = function validateId(id) {
    return _mongoose2.default.Types.ObjectId.isValid(id) ? true : false;
};

var verifyList = ['name', 'link', 'class'];
var validateContents = function validateContents(contents) {
    for (var i = 0; i < verifyList.length; i++) {
        var key = verifyList[i];
        if (contents[key] == undefined || contents[key] == '') {
            console.error('value not found: ', key, contents[key]);
            return false;
        }
    }
    return true;
};

var _default = router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(createLecture, 'createLecture', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(readLecture, 'readLecture', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(updateLecture, 'updateLecture', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(deleteLecture, 'deleteLecture', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(validateId, 'validateId', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(verifyList, 'verifyList', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(validateContents, 'validateContents', 'server/routes/lecture.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/lecture.js');
}();

;