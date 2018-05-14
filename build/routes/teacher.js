'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Teacher = require('../models/Teacher');

var _Teacher2 = _interopRequireDefault(_Teacher);

var _Student = require('../models/Student');

var _Student2 = _interopRequireDefault(_Student);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/signup', function (req, res) {
    userSignUp(req, res);
});
router.post('/signin', function (req, res) {
    userSignIn(req, res);
});
router.get('/getinfo', function (req, res) {
    getSessionData(req, res);
});
router.put('/updateinfo', function (req, res) {
    updateUser(req, res);
});

router.get('/getstudentsinfo', function (req, res) {
    getAllStudents(req, res);
});
router.put('/changestudentpw/:id', function (req, res) {
    changeStudentPW(req, res);
});
router.put('/changestudentinfo/:id', function (req, res) {
    changeStudentInfo(req, res);
});

router.post('/logout', function (req, res) {
    userLogOut(req, res);
});

var userSignUp = function userSignUp(req, res) {
    // CHECK USERNAME FORMAT
    var usernameRegex = /^[a-z0-9]+$/;
    if (!validateContents(req.body)) return (0, _throwerror2.default)(res, 400, 'Empty content exists.');
    if (!usernameRegex.test(req.body.username) || req.body.username.length < 4) return (0, _throwerror2.default)(res, 400, 'Bad username.');

    // CHECK PASS LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") return (0, _throwerror2.default)(res, 400, 'Bad password.');

    // CHECK USER EXISTANCE
    _Teacher2.default.findOne({ username: req.body.username }, function (err, exists) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (exists) return (0, _throwerror2.default)(res, 409, 'Username already exists.');

        // CREATE ACCOUNT
        var account = new _Teacher2.default({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save(function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({ success: true });
        });
    });
};

var userSignIn = function userSignIn(req, res) {
    if (typeof req.body.password !== "string") return (0, _throwerror2.default)(res, 401, 'Login failed: password format not valid.');

    // FIND THE USER BY USERNAME
    _Teacher2.default.findOne({ username: req.body.username }, function (err, account) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');

        // CHECK ACCOUNT EXISTANCY
        if (!account) return (0, _throwerror2.default)(res, 401, 'Login failed: account does not exist.');

        // CHECK WHETHER THE PASSWORD IS VALID
        if (!account.validateHash(req.body.password)) return (0, _throwerror2.default)(res, 401, 'Login failed: wrong password.');

        // ALTER SESSION
        var session = req.session;
        account.password = '';
        session.loginInfo = {
            user: account,
            role: 'teacher'
        };
        // delete account.password;
        // RETURN SUCCESS
        return res.json({
            success: true,
            id: session.loginInfo
        });
    });
};

var getSessionData = function getSessionData(req, res) {
    if (typeof req.session.loginInfo === "undefined") return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    res.json({ info: req.session.loginInfo });
};

var updateUser = function updateUser(req, res) {
    if (typeof req.session.loginInfo === "undefined") return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    console.log(req.session.loginInfo.user._id);
    _Teacher2.default.findById(req.session.loginInfo.user._id, function (err, account) {
        if (req.body.obj.password != '') {
            if (req.body.obj.password.length < 4 || typeof req.body.obj.password !== "string") return (0, _throwerror2.default)(res, 400, 'Bad password.');
            account.password = account.generateHash(req.body.obj.password);
        }
        for (var key in req.body.obj) {
            if (key != 'password' && account.hasOwnProperty(key)) {
                if (req.body.obj[key] == undefined || req.body.obj[key] == '') return (0, _throwerror2.default)(res, 400, 'Bad contents.');
                account[key] = req.body.obj[key];
            }
        }
        account.save(function (err, account) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            // ALTER SESSION
            var session = req.session;
            account.password = '';
            session.loginInfo = {
                user: account,
                role: 'teacher'
            };
            // RETURN SUCCESS
            return res.json({
                success: true,
                account: session.loginInfo
            });
        });
    });
};

var getAllStudents = function getAllStudents(req, res) {
    if (typeof req.session.loginInfo === "undefined") return (0, _throwerror2.default)(res, 401, 'User not logged in.');

    _Student2.default.find({}, function (err, accounts) {
        return res.json({ info: accounts });
    });
};

var changeStudentPW = function changeStudentPW(req, res) {
    // CHECK PASS LENGTH
    if (req.body.pw.length < 4 || typeof req.body.pw !== "string") return (0, _throwerror2.default)(res, 401, 'Bad password.');

    _Student2.default.findById(req.params.id, function (err, std) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        // IF MEMO DOES NOT EXIST
        if (!std) return (0, _throwerror2.default)(res, 409);

        if (req.body.pw != req.body.check_pw) return (0, _throwerror2.default)(res, 401, 'Passwords do not match.');

        std.password = req.body.pw;
        std.password = std.generateHash(std.password);

        std.save(function (err, std) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({
                success: true
            });
        });
    });
};

var changeStudentInfo = function changeStudentInfo(req, res) {
    _Student2.default.findById(req.params.id, function (err, std) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        // IF MEMO DOES NOT EXIST
        if (!std) return (0, _throwerror2.default)(res, 409, 'DB error.');

        if (!validateContents(req.body.obj, stdVerifyList)) {
            return (0, _throwerror2.default)(res, 400, 'Bad contents.');
        }

        std.class = req.body.obj.class;
        std.name = req.body.obj.name;
        std.school = req.body.obj.school;
        std.level = req.body.obj.level;

        std.save(function (err, std) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            return res.json({
                success: true,
                std: std
            });
        });
    });
};

var userLogOut = function userLogOut(req, res) {
    req.session.destroy(function (err) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
    });
    return res.json({ sucess: true });
};

var verifyList = ['username', 'password', 'name'];
var stdVerifyList = ['name', 'school', 'level'];
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

var _default = router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(userSignUp, 'userSignUp', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(userSignIn, 'userSignIn', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(getSessionData, 'getSessionData', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(updateUser, 'updateUser', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(getAllStudents, 'getAllStudents', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(changeStudentPW, 'changeStudentPW', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(changeStudentInfo, 'changeStudentInfo', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(userLogOut, 'userLogOut', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(verifyList, 'verifyList', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(stdVerifyList, 'stdVerifyList', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(validateContents, 'validateContents', 'server/routes/teacher.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/teacher.js');
}();

;