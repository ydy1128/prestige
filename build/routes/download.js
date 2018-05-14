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

// baseUrl/api/download?hwId=[id]
router.get('*', function (req, res) {
    getList(req, res);
}); // 해당 hw id를 쿼리로 받아 해당 directory에 속한 file들의 경로를 array 로 제공

var getList = function getList(req, res) {
    var hwId = req.query.hwId;
    var dir = _path2.default.join(__dirname, '../..', '/public/uploads/', hwId);

    var filePaths = _fs2.default.readdirSync(dir).map(function (fileName) {
        return '/public/uploads/' + hwId + '/' + fileName;
    });
    res.json({ filePaths: filePaths });
    // 해당 hw id의 디렉토리 있는지 확인
    // 있으면 해당 디렉토리 내부 파일을 넘김
    // 없으면 directory 생성 후, empty array를 res로 전달
};

var getFile = function getFile(req, res) {
    var hwId = req.query.hwId;
    var fileName = req.query.fileName;
    var downloadPath = 'uploads/' + hwId + '/' + fileName;
    res.download(downloadPath);
    console.log(req.files);
};

var _default = router;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(getList, 'getList', 'server/routes/download.js');

    __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/download.js');

    __REACT_HOT_LOADER__.register(getFile, 'getFile', 'server/routes/download.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/download.js');
}();

;