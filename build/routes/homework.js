'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Homework = require('../models/Homework');

var _Homework2 = _interopRequireDefault(_Homework);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

var _util = require('util');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var uploadBasePath = 'public/uploads/';

router.post('/', function (req, res) {
    createHomework(req, res);
});
router.get('*', function (req, res) {
    readHomework(req, res);
});
router.put('/:id', function (req, res) {
    updateHomework(req, res);
});
router.delete('/:id', function (req, res) {
    deleteHomework(req, res);
});

var createHomework = function createHomework(req, res) {
    var homeworkInfo = req.body.contents;
    if (not(req.session.loginInfo)) {
        return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    }
    if (not(validateData(homeworkInfo, "all"))) {
        return (0, _throwerror2.default)(res, 400, "Data format not valid.");
    }

    var homework = new _Homework2.default(Object.assign(req.body.contents, {
        accomplishments: [],
        modifiedDate: "",
        teacherId: req.session.loginInfo.user._id
    }));

    homework.save(function (err) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        return res.json({ success: true, homework: homework });
    });
};

var readHomework = function readHomework(req, res) {
    var homeworkId = req.params.id;
    _Homework2.default.find(homeworkId ? { _id: homeworkId } : null).sort({ $natural: -1 }).exec(function (err, homeworks) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        res.json(homeworks);
    });
};

var updateHomework = function updateHomework(req, res) {
    var modifiedHwContents = req.body.contents;
    var homeworkId = req.params.id;
    var userId = modifiedHwContents.teacherId;

    // Find Class
    _Homework2.default.findById(homeworkId, function (err, homework) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (not(homework)) return (0, _throwerror2.default)(res, 409);
        if (homework.teacherId != userId) return (0, _throwerror2.default)(res, 401, 'Unauthorized user');

        Object.assign(homework, modifiedHwContents);
        homework.save(function (err, homework) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({ success: true, homework: homework });
        });
    });
};

var deleteHomework = function deleteHomework(req, res) {
    var homeworkId = req.params.id;
    var valid = _mongoose2.default.Types.ObjectId.isValid(homeworkId);
    var loginInfo = req.session.loginInfo;

    if (not(valid)) {
        return (0, _throwerror2.default)(res, 400, "Data format not valid.");
    }
    if (not(loginInfo)) {
        (0, _throwerror2.default)(res, 401, 'User not logged in.');
    }

    _Homework2.default.findById(homeworkId, function (err, homework) {
        var userId = req.session.loginInfo.user._id;
        if (err) return throwerror(res, 409, 'DB error.');
        if (not(homework)) return (0, _throwerror2.default)(res, 409);
        if (homework.teacherId != userId) return (0, _throwerror2.default)(res, 401, 'Unauthorized user');

        // Remove class
        _Homework2.default.remove({ _id: homeworkId }, function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            var filePath = _path2.default.join(__dirname, "../../", uploadBasePath, homeworkId);
            (0, _rimraf2.default)(filePath, function (res) {}, function (err) {});
            res.json({ success: true });
        });
    });
};

// Utils
var not = function not(factor) {
    return !factor;
};

var validateData = function validateData(data, checkList) {
    if (typeof checkList == "string" && checkList == "all") {
        checkList = Object.keys(data);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = checkList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var checkItem = _step.value;

            if (not(checkList.includes(checkItem))) return false;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
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

    __REACT_HOT_LOADER__.register(not, 'not', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(validateData, 'validateData', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(uploadBasePath, 'uploadBasePath', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(createHomework, 'createHomework', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(readHomework, 'readHomework', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(updateHomework, 'updateHomework', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(deleteHomework, 'deleteHomework', 'server/routes/homework.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/homework.js');
}();

;