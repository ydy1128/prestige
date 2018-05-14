'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Comment = require('../models/Comment');

var _Comment2 = _interopRequireDefault(_Comment);

var _Homework = require('../models/Homework');

var _Homework2 = _interopRequireDefault(_Homework);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/homework/:homeworkId', function (req, res) {
    getCommentByHomeworkId(req, res);
});
router.post('/homework/:homeworkId', function (req, res) {
    createComment(req, res);
});
router.put('/', function (req, res) {
    updateComment(req, res);
});
router.delete('/:commentId', function (req, res) {
    deleteComment(req, res);
});

var getCommentByHomeworkId = function getCommentByHomeworkId(req, res) {
    console.log('params : ' + JSON.stringify(req.params));
    console.log('body : ' + JSON.stringify(req.body));
    var homeworkId = req.params.homeworkId;
    if (!homeworkId) {
        return (0, _throwerror2.default)(res, 404, 'homework id is required.');
    }

    _Comment2.default.find({ homeworkId: homeworkId }).exec(function (err, comments) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        res.json({ success: true, comments: comments });
    });
};

var createComment = function createComment(req, res) {
    console.log('params : ' + JSON.stringify(req.params));
    console.log('body : ' + JSON.stringify(req.body));
    if (!req.session.loginInfo) {
        return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    }
    if (!req.params.homeworkId) {
        return (0, _throwerror2.default)(res, 404, 'homework id is required.');
    }
    if (!req.body.comment) {
        return (0, _throwerror2.default)(res, 404, 'comment is required.');
    }

    var date = new Date().getTime() + "";
    Object.assign(req.body.comment, {
        writtenDate: date,
        editedDate: date,
        writer: req.session.loginInfo,
        homeworkId: req.params.homeworkId
    });

    var comment = new _Comment2.default(req.body.comment);
    comment.save(function (err) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        res.json({ success: true, comment: comment });
    });
};

var updateComment = function updateComment(req, res) {
    console.log('comment.updateComment');
    console.log('params : ' + JSON.stringify(req.params));
    console.log('body : ' + JSON.stringify(req.body));
    if (!req.session.loginInfo) {
        return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    }
    if (!req.body.comment) {
        return (0, _throwerror2.default)(res, 404, 'comment is required.');
    }

    _Comment2.default.findById(req.body.comment._id, function (err, comment) {
        var userId = req.session.loginInfo.user._id;
        console.log('comment : ' + JSON.stringify(comment));
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (comment == null) return (0, _throwerror2.default)(res, 404);
        if (comment.writer.user._id != userId) return (0, _throwerror2.default)(res, 401, 'Unauthorized user');

        Object.assign(comment, req.body.comment);

        comment.save(function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            res.json({ success: true, comment: comment });
        });
    });
};

var deleteComment = function deleteComment(req, res) {
    console.log('params : ' + JSON.stringify(req.params));
    var valid = _mongoose2.default.Types.ObjectId.isValid(req.params.commentId);
    if (!valid) {
        return (0, _throwerror2.default)(res, 400, "Data format not valid.");
    }

    _Comment2.default.findOne({ _id: req.params.commentId }, function (err, comment) {
        var userId = req.session.loginInfo.user._id;
        if (err) return throwerror(res, 409, 'DB error.');
        if (!comment) return (0, _throwerror2.default)(res, 404);
        if (comment.writer.user._id != userId) return (0, _throwerror2.default)(res, 401, 'Unauthorized user');

        comment.remove(function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
};

var _default = router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/comment.js');

    __REACT_HOT_LOADER__.register(getCommentByHomeworkId, 'getCommentByHomeworkId', 'server/routes/comment.js');

    __REACT_HOT_LOADER__.register(createComment, 'createComment', 'server/routes/comment.js');

    __REACT_HOT_LOADER__.register(updateComment, 'updateComment', 'server/routes/comment.js');

    __REACT_HOT_LOADER__.register(deleteComment, 'deleteComment', 'server/routes/comment.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/comment.js');
}();

;