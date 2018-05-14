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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _throwerror = require('./throwerror');

var _throwerror2 = _interopRequireDefault(_throwerror);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var uploadBasePath = 'public/uploads/';

var storage = _multer2.default.diskStorage({
  destination: function destination(req, file, callback) {
    var path = uploadBasePath + req.query.hwId;
    // remove previous files in hw's directory
    callback(null, path);
  },
  filename: function filename(req, file, callback) {
    callback(null, file.originalname); //callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = (0, _multer2.default)({ storage: storage });

var removeMiddleware = router.post('*', function (req, res, next) {
  var filePath = _path2.default.join(__dirname, "../../", uploadBasePath, req.query.hwId);
  (0, _rimraf2.default)(filePath, function (res) {
    (0, _mkdirp2.default)(filePath, function (err) {
      next();
    });
  }, function (err) {
    (0, _mkdirp2.default)(filePath, function (err) {
      next();
    });
  });
});

var uploadMiddleware = router.post('*', upload.array('file'), function (req, res) {
  var hwId = req.query.hwId;
  var userId = req.session.loginInfo.user._id;
  var fileNames = req.files.map(function (file) {
    return file.filename;
  });

  _Homework2.default.findById(hwId, function (err, hw) {
    if (err) return throwerror(res, 409, 'DB error.');
    if (!hw) return (0, _throwerror2.default)(res, 409);
    if (hw.teacherId != userId) return (0, _throwerror2.default)(res, 401, 'Unauthorized user');
    Object.assign(hw, { files: fileNames });

    hw.save(function (err, hw) {
      if (err) return throwerror(res, 409, 'DB error.');
      return res.json({ success: true, homework: hw });
    });
  });
});

router.use('*', [removeMiddleware, uploadMiddleware]);

var uploadDate = function uploadDate(req, res) {
  console.log(req.files);
};

var _default = router;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/upload.js');

  __REACT_HOT_LOADER__.register(uploadBasePath, 'uploadBasePath', 'server/routes/upload.js');

  __REACT_HOT_LOADER__.register(storage, 'storage', 'server/routes/upload.js');

  __REACT_HOT_LOADER__.register(upload, 'upload', 'server/routes/upload.js');

  __REACT_HOT_LOADER__.register(removeMiddleware, 'removeMiddleware', 'server/routes/upload.js');

  __REACT_HOT_LOADER__.register(uploadMiddleware, 'uploadMiddleware', 'server/routes/upload.js');

  __REACT_HOT_LOADER__.register(uploadDate, 'uploadDate', 'server/routes/upload.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/upload.js');
}();

;