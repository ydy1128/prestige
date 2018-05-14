'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Student = require('../models/Student');

var _Student2 = _interopRequireDefault(_Student);

var _Class = require('../models/Class');

var _Class2 = _interopRequireDefault(_Class);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/test', function (req, res) {
    createData(req, res);
});
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
router.post('/logout', function (req, res) {
    userLogOut(req, res);
});
router.delete('/:id', function (req, res) {
    deleteUser(req, res);
});
router.get('/inclass', function (req, res) {
    getStudentsByClassId(req, res);
});

var createData = function createData(req, res) {
    console.log('test uri called');
    var data = _fs2.default.readFileSync('server/data/students.csv');
    data = _iconvLite2.default.decode(data, 'EUC-KR').split('\n');
    data.splice(data.length - 1, 1);

    var _loop = function _loop(i) {
        var row = data[i].split(',');
        var proceed = false;
        _Student2.default.find({ username: row[0] }, function (err, std) {
            _Class2.default.find({ name: row[4] }, function (err, cls) {
                if (JSON.stringify(std) == JSON.stringify([]) && JSON.stringify(cls) != JSON.stringify([])) {
                    console.log(cls._id);
                    var account = new _Student2.default({
                        username: row[0],
                        password: row[1],
                        name: row[2],
                        school: row[3],
                        level: row[5],
                        class: ''
                    });
                    account.class = cls[0]._id;
                    account.password = account.generateHash(row[1]);
                    account.save(function (err) {
                        if (err) throw err;
                    });
                    console.log(cls[0].students);
                    cls[0].students.push(account._id);
                    cls[0].save(function (err) {
                        if (err) throw err;
                    });
                }
            });
        });
    };

    for (var i = 0; i < data.length; i++) {
        _loop(i);
    }
};

var userSignUp = function userSignUp(req, res) {
    // CHECK USERNAME FORMAT
    var usernameRegex = /^[a-z0-9]+$/;
    if (!validateContents(req.body)) return (0, _throwerror2.default)(res, 400, 'Empty content exists.');
    if (!usernameRegex.test(req.body.username) || req.body.username.length < 4) return (0, _throwerror2.default)(res, 400, 'Bad username.');

    // CHECK PASS LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") return (0, _throwerror2.default)(res, 400, 'Bad password.');

    // CHECK USER EXISTANCE
    _Student2.default.findOne({ username: req.body.username }, function (err, exists) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (exists) return (0, _throwerror2.default)(res, 409, 'Username already exists.');
        // CREATE ACCOUNT
        var account = new _Student2.default({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            school: req.body.school,
            level: req.body.level,
            class: ''
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
    _Student2.default.findOne({ username: req.body.username }, function (err, account) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');

        // CHECK ACCOUNT EXISTANCY
        if (!account) return (0, _throwerror2.default)(res, 401, 'Login failed: account does not exist.');

        // CHECK WHETHER THE PASSWORD IS VALID
        if (!account.validateHash(req.body.password)) return (0, _throwerror2.default)(res, 401, 'Login failed: wrong password.');

        // ALTER SESSION
        var session = req.session;
        account.password = '';
        session.loginInfo = {
            role: 'student',
            user: account
        };

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
    _Student2.default.findById(req.session.loginInfo.user._id, function (err, account) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (!account) return (0, _throwerror2.default)(res, 409, 'DB error.');
        console.log(account);
        if (req.body.obj.password != '') {
            if (req.body.obj.password.length < 4 || typeof req.body.obj.password !== "string") return (0, _throwerror2.default)(res, 400, 'Bad password.');
            account.password = account.generateHash(req.body.obj.password);
        }
        console.log(req.body.obj);
        for (var key in req.body.obj) {
            console.log(key, account[key], req.body.obj[key]);
            if (key != 'password' && account[key] != undefined) {
                if (req.body.obj[key] == undefined || req.body.obj[key] == '') return (0, _throwerror2.default)(res, 400, 'Bad contents.');
                console.log(key);
                account[key] = req.body.obj[key];
            }
        }
        console.log(account);
        account.save(function (err, account) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            if (!account) return (0, _throwerror2.default)(res, 409, 'DB error.');
            // ALTER SESSION
            var session = req.session;
            account.password = '';
            console.log(account);
            console.log(session.loginInfo);
            session.loginInfo.user = account;
            // RETURN SUCCESS
            return res.json({
                success: true,
                account: session.loginInfo
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

var deleteUser = function deleteUser(req, res) {
    // Check login status
    if (typeof req.session.loginInfo === 'undefined') return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    // Find student by id
    _Student2.default.findById(req.params.id, function (err, std) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (!std) return (0, _throwerror2.default)(res, 409);

        // Remove student
        _Student2.default.remove({ _id: req.params.id }, function (err) {
            if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
            res.json({ success: true });
        });
    });
};

var getStudentsByClassId = function getStudentsByClassId(req, res) {
    console.log(req.session.loginInfo.user.class);
    if (typeof req.session.loginInfo === 'undefined') return (0, _throwerror2.default)(res, 401, 'User not logged in.');
    _Student2.default.find({ class: req.session.loginInfo.user.class }, function (err, std) {
        if (err) return (0, _throwerror2.default)(res, 409, 'DB error.');
        if (!std) return (0, _throwerror2.default)(res, 409);
        console.log(std);
        return res.json({
            success: true,
            std: std
        });
    });
};

var verifyList = ['username', 'password', 'name', 'school'];
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

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(createData, 'createData', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(userSignUp, 'userSignUp', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(userSignIn, 'userSignIn', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(getSessionData, 'getSessionData', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(updateUser, 'updateUser', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(userLogOut, 'userLogOut', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(deleteUser, 'deleteUser', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(getStudentsByClassId, 'getStudentsByClassId', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(verifyList, 'verifyList', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(validateContents, 'validateContents', 'server/routes/student.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/student.js');
}();

;