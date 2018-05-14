'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// baseUrl/api/test
router.get('*', function (req, res) {
    testFunc(req, res);
});

var testFunc = function testFunc(req, res) {
    var params = req.params;
    var fileName = _path2.default.join(__dirname, '../../public/uploads/손준혁.docx');
    var file = _fs2.default.readFileSync(fileName);
    res.sendFile(file);
};

var _default = router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(testFunc, 'testFunc', 'server/routes/test.js');

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/test.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/test.js');
}();

;