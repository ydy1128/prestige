'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _memo = require('./memo');

var _memo2 = _interopRequireDefault(_memo);

var _teacher = require('./teacher');

var _teacher2 = _interopRequireDefault(_teacher);

var _student = require('./student');

var _student2 = _interopRequireDefault(_student);

var _class = require('./class');

var _class2 = _interopRequireDefault(_class);

var _homework = require('./homework');

var _homework2 = _interopRequireDefault(_homework);

var _lecture = require('./lecture');

var _lecture2 = _interopRequireDefault(_lecture);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

var _download = require('./download');

var _download2 = _interopRequireDefault(_download);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.use('/test', _test2.default);
router.use('/memo', _memo2.default);
router.use('/teacher', _teacher2.default);
router.use('/student', _student2.default);
router.use('/class', _class2.default);
router.use('/homework', _homework2.default);
router.use('/lecture', _lecture2.default);
router.use('/upload', _upload2.default);
router.use('/download', _download2.default);
router.use('/comment', _comment2.default);

var _default = router;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(router, 'router', 'server/routes/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'server/routes/index.js');
}();

;