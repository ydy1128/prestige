'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _MemoList = require('../models/memo/MemoList');

var _MemoList2 = _interopRequireDefault(_MemoList);

var _MemoGroup = require('../models/memo/MemoGroup');

var _MemoGroup2 = _interopRequireDefault(_MemoGroup);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/list', function (req, res) {
    createMemoList(req, res);
});
router.get('/list', function (req, res) {
    readMemoList(req, res);
});
router.put('/list/:id', function (req, res) {
    updateMemoList(req.params.id, req, res);
});
router.delete('/list/:id', function (req, res) {
    deleteMemoList(req.params.id, req, res);
});

router.post('/group', function (req, res) {
    createMemoGroup(req, res);
});
router.get('/group/:id', function (req, res) {
    readMemoGroup(req.params.id, req, res);
});
router.put('/group/:id', function (req, res) {
    updateMemoGroup(req.params.id, req, res);
});
router.delete('/group/:id', function (req, res) {
    deleteMemoGroup(req.params.id, req, res);
});
router.delete('/groups-by-list-id/:id', function (req, res) {
    deleteMemoGroupsById(req.params.id, req, res);
});

var createMemoList = function createMemoList(req, res) {
    var memoListObj = req.body.contents;

    if (memoListObj.name == '' || memoListObj.name == undefined) return (0, _throwerror2.default)(res, 400, 'Bad contents.');

    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    var memolist = new _MemoList2.default({
        name: memoListObj.name,
        teacher: req.session.loginInfo.user._id
    });

    memolist.save(function (err) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        return res.json({ success: true, memolist: memolist });
    });
};

var readMemoList = function readMemoList(req, res) {
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    if (req.session.loginInfo.role != 'teacher') return (0, _throwerror2.default)(res, 401, 'User not a teacher.');

    _MemoList2.default.find({}, function (err, memolist) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        res.json({ success: true, memolist: memolist });
    });
};

var updateMemoList = function updateMemoList(id, req, res) {
    if (!validateId(id)) return (0, _throwerror2.default)(res, 400, "Data format not valid.");
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    _MemoList2.default.findById(id, function (err, memolist) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');

        if (memolist == undefined) return (0, _throwerror2.default)(res, 409);

        memolist.name = req.body.contents.name;

        memolist.save(function (err, memolist) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({
                success: true,
                memolist: memolist
            });
        });
    });
};

var deleteMemoList = function deleteMemoList(id, req, res) {
    if (!validateId(id)) return (0, _throwerror2.default)(res, 400, "Data format not valid.");

    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    _MemoList2.default.findById(id, function (err, memolist) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (!memolist) return (0, _throwerror2.default)(res, 409);

        // Remove class
        _MemoList2.default.remove({ _id: id }, function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
};

// let validateId = (id) =>{
// 	return mongoose.Types.ObjectId.isValid(id) ? true : false;
// }

var createMemoGroup = function createMemoGroup(req, res) {
    var memoGroupObj = req.body.contents;
    if (memoGroupObj.name == '' || memoGroupObj.name == undefined) return (0, _throwerror2.default)(res, 400, 'Bad contents.');
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    var memogroup = new _MemoGroup2.default({
        name: memoGroupObj.name,
        teacher: req.session.loginInfo.user._id,
        memoList: memoGroupObj.memoList,
        memos: []
    });

    memogroup.save(function (err) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        return res.json({ success: true, memogroup: memogroup });
    });
};

var readMemoGroup = function readMemoGroup(id, req, res) {
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    if (req.session.loginInfo.role != 'teacher') return (0, _throwerror2.default)(res, 401, 'User not a teacher.');

    _MemoGroup2.default.find({ memoList: id }, function (err, memogroups) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        console.log(memogroups);
        res.json({ success: true, memogroups: memogroups });
    });
};

var updateMemoGroup = function updateMemoGroup(id, req, res) {
    if (!validateId(id)) return (0, _throwerror2.default)(res, 400, "Data format not valid.");
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    _MemoGroup2.default.findById(id, function (err, memogroup) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');

        if (memogroup == undefined) return (0, _throwerror2.default)(res, 409);
        console.log(memogroup);
        memogroup.name = req.body.contents.name;
        memogroup.memos = req.body.contents.memos;

        memogroup.save(function (err, memogroup) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({
                success: true,
                memogroup: memogroup
            });
        });
    });
};

var deleteMemoGroup = function deleteMemoGroup(id, req, res) {
    if (!validateId(id)) return (0, _throwerror2.default)(res, 400, "Data format not valid.");
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    _MemoGroup2.default.findById(id, function (err, memogroup) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (!memogroup) return (0, _throwerror2.default)(res, 409);

        // Remove class
        _MemoGroup2.default.remove({ _id: id }, function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
};

var deleteMemoGroupsById = function deleteMemoGroupsById(id, req, res) {
    if (!validateId(id)) return (0, _throwerror2.default)(res, 400, "Data format not valid.");
    if (req.session.loginInfo == undefined) return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    // Remove classes
    _MemoGroup2.default.remove({ memoList: id }, function (err) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        res.json({ success: true });
    });
};

var validateId = function validateId(id) {
    return _mongoose2.default.Types.ObjectId.isValid(id) ? true : false;
};

var _default = router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(createMemoList, 'createMemoList', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(readMemoList, 'readMemoList', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(updateMemoList, 'updateMemoList', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(deleteMemoList, 'deleteMemoList', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(createMemoGroup, 'createMemoGroup', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(readMemoGroup, 'readMemoGroup', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(updateMemoGroup, 'updateMemoGroup', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(deleteMemoGroup, 'deleteMemoGroup', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(deleteMemoGroupsById, 'deleteMemoGroupsById', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(validateId, 'validateId', 'server/routes/memo.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/memo.js');
}();

;